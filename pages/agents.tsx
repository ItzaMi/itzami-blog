import { useEffect, useState } from 'react'

import {
  AgentActivity,
  AgentActivitySnapshot,
  AgentPhase,
  AgentSource,
  emptyAgentActivitySnapshot,
} from '../lib/agentActivity'

import SEO from '../components/SEO'

const phasePresentation: Record<AgentPhase, { label: string; color?: string }> =
  {
    thinking: { label: 'Thinking', color: '#7866c7' },
    researching: { label: 'Researching', color: '#3a78a8' },
    building: { label: 'Building', color: '#356c9a' },
    reviewing: { label: 'Reviewing', color: '#8a6b25' },
    testing: { label: 'Testing', color: '#7a5a9f' },
    deploying: { label: 'Deploying', color: '#307669' },
    monitoring: { label: 'Monitoring', color: '#3c7a57' },
    waiting: { label: 'Waiting', color: '#b48a38' },
    idle: { label: 'Idle' },
    completed: { label: 'Completed', color: '#3c7a57' },
    failed: { label: 'Failed', color: '#b75a52' },
    offline: { label: 'Offline' },
  }

const sourceLabels: Record<AgentSource, string> = {
  codex: 'Codex',
  cursor: 'Cursor',
  claude: 'Claude',
  vps: 'VPS agent',
}

const inactivePhases: AgentPhase[] = [
  'waiting',
  'idle',
  'completed',
  'failed',
  'offline',
]

interface AgentRowProps {
  agent: AgentActivity
  children?: AgentActivity[]
  nested?: boolean
}

const StatusBadge = ({ label, color }: { label: string; color?: string }) => {
  return (
    <span
      className={`rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted ${color ? '' : 'border-divider'}`}
      style={color ? { borderColor: color, color: color } : undefined}
    >
      {label}
    </span>
  )
}

const AgentRow = ({ agent, children = [], nested = false }: AgentRowProps) => {
  const presentation = phasePresentation[agent.phase]

  return (
    <li className={`relative ${nested ? 'ml-8 max-sm:ml-5' : ''}`}>
      <span
        className={`absolute top-7 h-px bg-divider ${
          nested ? '-left-8 w-8 max-sm:-left-5 max-sm:w-5' : '-left-[29px] w-7'
        }`}
        aria-hidden="true"
      />
      <article className="grid min-h-[102px] grid-cols-[minmax(0,1fr)_auto] items-center gap-8 border-b border-divider px-1 py-6 max-sm:min-h-0 max-sm:grid-cols-[minmax(0,1fr)_auto] max-sm:gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
            <span>{sourceLabels[agent.source]}</span>
            <span aria-hidden="true">/</span>
            <span>{agent.host}</span>
          </div>
          <h3 className="mt-2 text-[15px] font-medium tracking-tight text-primary">
            {agent.name}
          </h3>
        </div>

        <div className="flex min-w-[142px] items-center justify-end gap-3 max-sm:min-w-0">
          <StatusBadge label={presentation.label} />
        </div>
      </article>

      {children.length > 0 ? (
        <ol className="border-l border-divider">
          {children.map((child) => (
            <AgentRow agent={child} key={child.id} nested />
          ))}
        </ol>
      ) : null}
    </li>
  )
}

const Agents = () => {
  const metadataImagePath =
    'https://itzami.com/images/overallSocialPreview.jpeg'
  const [snapshot, setSnapshot] = useState<AgentActivitySnapshot>(
    emptyAgentActivitySnapshot
  )
  const [isConnecting, setIsConnecting] = useState(true)

  useEffect(() => {
    let isMounted = true

    const refresh = async () => {
      try {
        const response = await fetch('/api/agent-activity', {
          cache: 'no-store',
        })
        if (!response.ok) throw new Error('Agent feed unavailable')

        const nextSnapshot = (await response.json()) as AgentActivitySnapshot
        if (isMounted) setSnapshot(nextSnapshot)
      } catch {
        if (isMounted) {
          setSnapshot({ mode: 'unavailable', agents: [], events: [] })
        }
      } finally {
        if (isMounted) setIsConnecting(false)
      }
    }

    void refresh()
    const interval = window.setInterval(refresh, 3000)

    return () => {
      isMounted = false
      window.clearInterval(interval)
    }
  }, [])

  const { agents, events, mode } = snapshot
  const rootAgents = agents.filter((agent) => !agent.parentId)
  const connectedCount = agents.filter(
    (agent) => agent.phase !== 'offline'
  ).length
  const workingCount = agents.filter(
    (agent) => !inactivePhases.includes(agent.phase)
  ).length
  const idleCount = agents.filter((agent) => agent.phase === 'idle').length

  return (
    <main className="w-full max-w-[800px] py-[125px] max-md:py-5 max-md:pb-28">
      <SEO
        title="ItzaMi - Agents"
        description="A public signal showing whether Rui Sousa's software agents are active, waiting, or idle."
        image={metadataImagePath}
      />

      <section className="max-w-[620px]">
        <div className="flex items-center gap-2.5">
          <h1 className="text-sm font-medium tracking-tight text-primary">
            Agents
          </h1>
          <span className="rounded-full border border-divider px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
            {isConnecting ? 'connecting' : `${mode} feed`}
          </span>
        </div>
        <p className="mt-3 max-w-[560px] text-sm leading-[26px] tracking-tight text-muted">
          A quiet signal from the software agents I have running. It shows their
          presence, never the work itself.
        </p>
      </section>

      <section
        className="mt-10 grid max-w-[680px] grid-cols-3 border-y border-divider py-4 max-sm:grid-cols-1 max-sm:gap-3"
        aria-label="Agent room summary"
      >
        <div className="max-sm:flex max-sm:items-baseline max-sm:justify-between">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
            Connected
          </p>
          <p className="mt-1 text-sm font-medium tracking-tight text-primary max-sm:mt-0">
            {connectedCount} online
          </p>
        </div>
        <div className="border-x border-divider px-6 max-sm:flex max-sm:items-baseline max-sm:justify-between max-sm:border-x-0 max-sm:px-0">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
            Working
          </p>
          <p className="mt-1 text-sm font-medium tracking-tight text-primary max-sm:mt-0">
            {workingCount} now
          </p>
        </div>
        <div className="pl-6 max-sm:flex max-sm:items-baseline max-sm:justify-between max-sm:pl-0">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
            Idle
          </p>
          <p className="mt-1 text-sm font-medium tracking-tight text-primary max-sm:mt-0">
            {idleCount} {idleCount === 1 ? 'agent' : 'agents'}
          </p>
        </div>
      </section>

      <section className="mt-16 max-w-[680px]">
        <div className="flex items-end justify-between gap-5">
          <div>
            <h2 className="text-sm font-medium tracking-tight text-primary">
              Current room
            </h2>
            <p className="mt-1 text-xs leading-[20px] tracking-tight text-muted">
              Delegated agents stay connected to the agent that started them.
            </p>
          </div>
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
            Local source
          </p>
        </div>

        {rootAgents.length > 0 ? (
          <ol className="mt-5 border-l border-divider pl-7">
            {rootAgents.map((agent) => (
              <AgentRow
                agent={agent}
                children={agents.filter((child) => child.parentId === agent.id)}
                key={agent.id}
              />
            ))}
          </ol>
        ) : (
          <p className="mt-5 border-y border-divider py-8 text-xs tracking-tight text-muted">
            {isConnecting
              ? 'Looking for recent Codex sessions…'
              : 'No recent Codex sessions detected.'}
          </p>
        )}
      </section>

      <section className="mt-20 max-w-[680px]">
        <div className="flex items-baseline justify-between gap-5">
          <h2 className="text-sm font-medium tracking-tight text-primary">
            Event stream
          </h2>
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
            Status changes
          </span>
        </div>

        {events.length > 0 ? (
          <ol className="mt-5 divide-y divide-divider border-y border-divider">
            {events.map((event) => (
              <li
                className="grid grid-cols-[52px_76px_1fr] items-baseline gap-3 py-3 text-xs tracking-tight max-sm:grid-cols-[46px_1fr]"
                key={event.id}
              >
                <time className="font-mono text-[10px] text-muted">
                  {event.elapsed}
                </time>
                <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted max-sm:hidden">
                  {sourceLabels[event.source]}
                </span>
                <span className="text-primary">
                  <span className="font-medium">{event.name}</span>{' '}
                  {event.from ? (
                    <>
                      moved from{' '}
                      <span className="text-muted">
                        {phasePresentation[event.from].label.toLowerCase()}
                      </span>{' '}
                      to{' '}
                    </>
                  ) : (
                    <>came online as </>
                  )}
                  <span className="font-medium">
                    {phasePresentation[event.to].label.toLowerCase()}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-5 border-y border-divider py-8 text-xs tracking-tight text-muted">
            Status changes will appear here when an agent starts working.
          </p>
        )}
      </section>

      <section className="mt-16 max-w-[680px] border-l-2 border-divider pl-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
          About this feed
        </p>
        <p className="mt-2 max-w-[580px] text-xs leading-[21px] tracking-tight text-muted">
          This experimental feed reads lifecycle metadata from recent local
          Codex sessions. It reports presence and status only—never project
          names, prompts, transcripts, commands, file paths, or private output.
        </p>
      </section>
    </main>
  )
}

export default Agents
