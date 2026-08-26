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
  | 'idle'
  | 'completed'
  | 'failed'
  | 'offline'

export interface AgentActivity {
  id: string
  parentId?: string
  source: AgentSource
  name: string
  host: string
  phase: AgentPhase
  updated: string
}

export interface AgentEvent {
  id: string
  elapsed: string
  source: AgentSource
  name: string
  from?: AgentPhase
  to: AgentPhase
}

export interface AgentActivitySnapshot {
  mode: 'live' | 'unavailable'
  agents: AgentActivity[]
  events: AgentEvent[]
}

export const emptyAgentActivitySnapshot: AgentActivitySnapshot = {
  mode: 'live',
  agents: [],
  events: [],
}
