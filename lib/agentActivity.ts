export type AgentSource = 'codex' | 'cursor' | 'claude' | 'vps'

export type AgentPhase =
  | 'thinking'
  | 'researching'
  | 'building'
  | 'reviewing'
  | 'testing'
  | 'deploying'
  | 'monitoring'
  | 'waiting'
  | 'completed'
  | 'failed'
  | 'offline'

export interface AgentActivity {
  id: string
  parentId?: string
  source: AgentSource
  name: string
  host: string
  project: string
  phase: AgentPhase
  summary: string
  updated: string
}

export interface AgentEvent {
  id: string
  elapsed: string
  source: AgentSource
  message: string
  tone?: 'success' | 'warning'
}

export interface AgentActivitySnapshot {
  mode: 'demo' | 'live'
  agents: AgentActivity[]
  events: AgentEvent[]
}

export const agentActivitySnapshot: AgentActivitySnapshot = {
  mode: 'demo',
  agents: [
    {
      id: 'codex-main',
      source: 'codex',
      name: 'Codex',
      host: 'Mac',
      project: 'itzami-blog',
      phase: 'building',
      summary: 'Shaping the first text version of the agent room.',
      updated: '8s ago',
    },
    {
      id: 'codex-reviewer',
      parentId: 'codex-main',
      source: 'codex',
      name: 'Interface reviewer',
      host: 'Subagent',
      project: 'itzami-blog',
      phase: 'reviewing',
      summary: 'Checking hierarchy, copy, and small-screen readability.',
      updated: '14s ago',
    },
    {
      id: 'cursor-buggy',
      source: 'cursor',
      name: 'Cursor',
      host: 'Mac',
      project: 'Buggy',
      phase: 'testing',
      summary: 'Running the checks around a new onboarding flow.',
      updated: '21s ago',
    },
    {
      id: 'claude-screenedit',
      source: 'claude',
      name: 'Claude Code',
      host: 'Mac',
      project: 'ScreenEdit',
      phase: 'waiting',
      summary: 'Review complete. Waiting for the next instruction.',
      updated: '2m ago',
    },
    {
      id: 'vps-links',
      source: 'vps',
      name: 'Link watcher',
      host: 'VPS',
      project: 'O Meu Baby Shower',
      phase: 'monitoring',
      summary: 'Checking the public purchase-link health report.',
      updated: '31s ago',
    },
  ],
  events: [
    {
      id: 'event-1',
      elapsed: '00:00',
      source: 'codex',
      message: 'Codex joined itzami-blog.',
    },
    {
      id: 'event-2',
      elapsed: '00:18',
      source: 'codex',
      message: 'Started building the text-first agent room.',
    },
    {
      id: 'event-3',
      elapsed: '00:31',
      source: 'codex',
      message: 'Spawned Interface reviewer.',
    },
    {
      id: 'event-4',
      elapsed: '00:42',
      source: 'vps',
      message: 'Link watcher reported a healthy heartbeat.',
      tone: 'success',
    },
    {
      id: 'event-5',
      elapsed: '00:58',
      source: 'cursor',
      message: 'Cursor moved Buggy into testing.',
    },
    {
      id: 'event-6',
      elapsed: '01:12',
      source: 'claude',
      message: 'Claude Code is waiting for input.',
      tone: 'warning',
    },
  ],
}
