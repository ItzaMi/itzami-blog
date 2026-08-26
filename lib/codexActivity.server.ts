import { promises as fs } from 'fs'
import { createHash } from 'crypto'
import os from 'os'
import path from 'path'

import {
  AgentActivity,
  AgentActivitySnapshot,
  AgentEvent,
  AgentPhase,
} from './agentActivity'

const RECENT_SESSION_WINDOW_MS = 30 * 60 * 1000
const OFFLINE_AFTER_MS = 10 * 60 * 1000
const MAX_SESSION_FILES = 20
const MAX_EVENTS = 8

interface StatusChange {
  at: number
  phase: AgentPhase
}

interface ParsedSession {
  id: string
  lastRecordAt: number
  statusChanges: StatusChange[]
}

interface SessionRecord {
  timestamp?: string
  type?: string
  payload?: {
    id?: string
    type?: string
    name?: string
  }
}

const toTimestamp = (value?: string) => {
  const timestamp = value ? Date.parse(value) : Number.NaN
  return Number.isFinite(timestamp) ? timestamp : 0
}

const anonymousId = (value: string) =>
  createHash('sha256').update(value).digest('hex').slice(0, 12)

const relativeTime = (timestamp: number, now: number) => {
  const seconds = Math.max(0, Math.floor((now - timestamp) / 1000))

  if (seconds < 5) return 'now'
  if (seconds < 60) return `${seconds}s ago`

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`

  return `${Math.floor(minutes / 60)}h ago`
}

const phaseForTool = (tool?: string): AgentPhase => {
  if (!tool) return 'building'

  if (tool.includes('web') || tool.includes('search')) return 'researching'
  if (tool.includes('view') || tool.includes('screenshot')) return 'reviewing'
  if (tool.includes('test') || tool.includes('browser')) return 'testing'
  if (tool.includes('deploy') || tool.includes('wrangler')) return 'deploying'

  return 'building'
}

const phaseForRecord = (record: SessionRecord): AgentPhase | null => {
  if (record.type === 'event_msg') {
    if (record.payload?.type === 'task_started') return 'thinking'
    if (
      record.payload?.type === 'task_complete' ||
      record.payload?.type === 'turn_aborted'
    ) {
      return 'idle'
    }
  }

  if (record.type === 'response_item') {
    if (record.payload?.type === 'reasoning') return 'thinking'
    if (record.payload?.type === 'custom_tool_call') {
      return phaseForTool(record.payload.name)
    }
  }

  return null
}

const recentSessionFiles = async (now: number) => {
  const sessionsRoot =
    process.env.CODEX_SESSIONS_DIR || path.join(os.homedir(), '.codex', 'sessions')
  const dateDirectories = [new Date(now), new Date(now - 24 * 60 * 60 * 1000)].map(
    (date) =>
      path.join(
        sessionsRoot,
        String(date.getFullYear()),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
      ),
  )

  const files = (
    await Promise.all(
      dateDirectories.map(async (directory) => {
        try {
          const names = await fs.readdir(directory)
          return names
            .filter((name) => name.endsWith('.jsonl'))
            .map((name) => path.join(directory, name))
        } catch {
          return []
        }
      }),
    )
  ).flat()

  const withStats = await Promise.all(
    files.map(async (file) => ({ file, stat: await fs.stat(file) })),
  )

  return withStats
    .filter(({ stat }) => now - stat.mtimeMs <= RECENT_SESSION_WINDOW_MS)
    .sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs)
    .slice(0, MAX_SESSION_FILES)
    .map(({ file }) => file)
}

const parseSession = async (file: string): Promise<ParsedSession | null> => {
  const contents = await fs.readFile(file, 'utf8')
  let id = path.basename(file, '.jsonl')
  let lastRecordAt = 0
  const statusChanges: StatusChange[] = []

  for (const line of contents.split('\n')) {
    if (!line) continue

    try {
      const record = JSON.parse(line) as SessionRecord
      const timestamp = toTimestamp(record.timestamp)
      if (timestamp) lastRecordAt = Math.max(lastRecordAt, timestamp)
      if (record.type === 'session_meta' && record.payload?.id) {
        id = record.payload.id
      }

      // Only lifecycle and tool names are retained. Text-bearing fields are
      // deliberately ignored and can never reach the API response.
      const phase = phaseForRecord(record)
      if (!phase || !timestamp) continue

      const previous = statusChanges.at(-1)
      if (previous?.phase === phase) {
        previous.at = timestamp
      } else {
        statusChanges.push({ at: timestamp, phase })
      }
    } catch {
      // A session can be read while Codex is appending its latest JSON line.
    }
  }

  if (!lastRecordAt || statusChanges.length === 0) return null
  return { id, lastRecordAt, statusChanges }
}

export const getCodexActivitySnapshot = async (
  now = Date.now(),
): Promise<AgentActivitySnapshot> => {
  // The transcript adapter is strictly a local prototype. Production will use
  // the privacy-safe VPS feed instead of inspecting a deployment filesystem.
  if (process.env.VERCEL) {
    return { mode: 'unavailable', agents: [], events: [] }
  }

  try {
    const files = await recentSessionFiles(now)
    const parsed = await Promise.all(files.map(parseSession))
    const sessions = parsed
      .filter((session): session is ParsedSession => Boolean(session))
      .filter((session) => now - session.lastRecordAt <= RECENT_SESSION_WINDOW_MS)
      .sort((a, b) => b.lastRecordAt - a.lastRecordAt)

    const agents: AgentActivity[] = sessions.map((session, index) => {
      const latest = session.statusChanges.at(-1)!
      const phase =
        now - session.lastRecordAt > OFFLINE_AFTER_MS ? 'offline' : latest.phase

      return {
        id: anonymousId(session.id),
        source: 'codex',
        name: index === 0 ? 'Codex' : `Codex ${index + 1}`,
        host: 'This Mac',
        phase,
        updated: relativeTime(session.lastRecordAt, now),
      }
    })

    const names = new Map(
      sessions.map((session, index) => [
        session.id,
        index === 0 ? 'Codex' : `Codex ${index + 1}`,
      ]),
    )
    const events: AgentEvent[] = sessions
      .flatMap((session) =>
        session.statusChanges.map((change, index, changes) => ({
          id: anonymousId(`${session.id}-${change.at}`),
          at: change.at,
          elapsed: relativeTime(change.at, now),
          source: 'codex' as const,
          name: names.get(session.id) || 'Codex',
          from: changes[index - 1]?.phase,
          to: change.phase,
        })),
      )
      .sort((a, b) => b.at - a.at)
      .slice(0, MAX_EVENTS)
      .map(({ at: _at, ...event }) => event)

    return { mode: 'live', agents, events }
  } catch {
    return { mode: 'unavailable', agents: [], events: [] }
  }
}
