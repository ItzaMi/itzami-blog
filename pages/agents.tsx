import { AgentActivity, AgentPhase, AgentSource, agentActivitySnapshot } from '../lib/agentActivity'

import SEO from '../components/SEO'

const phasePresentation: Record<
  AgentPhase,
  { label: string; dot: string; pulse?: string }
> = {
  thinking: { label: 'Thinking', dot: 'bg-[#7866c7]', pulse: 'bg-[#7866c7]' },
  researching: { label: 'Researching', dot: 'bg-[#3a78a8]', pulse: 'bg-[#3a78a8]' },
  building: { label: 'Building', dot: 'bg-[#356c9a]', pulse: 'bg-[#356c9a]' },
  reviewing: { label: 'Reviewing', dot: 'bg-[#8a6b25]', pulse: 'bg-[#8a6b25]' },
  testing: { label: 'Testing', dot: 'bg-[#7a5a9f]', pulse: 'bg-[#7a5a9f]' },
  deploying: { label: 'Deploying', dot: 'bg-[#307669]', pulse: 'bg-[#307669]' },
  monitoring: { label: 'Monitoring', dot: 'bg-[#3c7a57]', pulse: 'bg-[#3c7a57]' },
  waiting: { label: 'Waiting', dot: 'bg-[#b48a38]' },
  completed: { label: 'Completed', dot: 'bg-[#3c7a57]' },
  failed: { label: 'Failed', dot: 'bg-[#b75a52]' },
  offline: { label: 'Offline', dot: 'bg-[#a4abb0]' },
}

const sourceLabels: Record<AgentSource, string> = {
  codex: 'Codex',
  cursor: 'Cursor',
  claude: 'Claude',
  vps: 'VPS agent',
}

const inactivePhases: AgentPhase[] = [
  'waiting',
  'completed',
  'failed',
  'offline',
]

interface AgentRowProps {
  agent: AgentActivity
  children?: AgentActivity[]
  nested?: boolean
}

const StatusDot = ({ phase }: { phase: AgentPhase }) => {
  const presentation = phasePresentation[phase]

  return (
    <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
      {presentation.pulse ? (
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-30 motion-reduce:animate-none ${presentation.pulse}`}
        />
      ) : null}
      <span
        className={`relative inline-flex h-2.5 w-2.5 rounded-full ${presentation.dot}`}
      />
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
      <article className="grid grid-cols-[minmax(0,1fr)_auto] gap-6 border-b border-divider px-1 py-6 max-sm:grid-cols-1 max-sm:gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
            <span>{sourceLabels[agent.source]}</span>
            <span aria-hidden="true">/</span>
            <span>{agent.host}</span>
          </div>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <h3 className="text-[15px] font-medium tracking-tight text-primary">
              {agent.name}
            </h3>
            <span className="text-xs tracking-tight text-muted">
              {agent.project}
            </span>
          </div>
          <p className="mt-2 max-w-[520px] text-sm leading-[24px] tracking-tight text-primary">
            {agent.summary}
          </p>
        </div>

        <div className="flex min-w-[112px] items-start justify-end gap-2 pt-1 max-sm:min-w-0 max-sm:justify-start max-sm:pt-0">
          <StatusDot phase={agent.phase} />
          <div className="-mt-1 text-right max-sm:text-left">
            <p className="text-xs font-medium tracking-tight text-primary">
              {presentation.label}
            </p>
            <p className="mt-0.5 font-mono text-[10px] tracking-tight text-muted">
              {agent.updated}
            </p>
          </div>
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
  const { agents, events, mode } = agentActivitySnapshot
  const rootAgents = agents.filter((agent) => !agent.parentId)
  const workingCount = agents.filter(
    (agent) => !inactivePhases.includes(agent.phase),
  ).length
  const waitingCount = agents.filter(
    (agent) => agent.phase === 'waiting',
  ).length

  return (
    <main className="w-full max-w-[800px] py-[125px] max-md:py-5 max-md:pb-28">
      <SEO
        title="ItzaMi - Agents"
        description="A live view of the software agents working across Rui Sousa's projects."
        image={metadataImagePath}
      />

      <section className="max-w-[620px]">
        <div className="flex items-center gap-2.5">
          <h1 className="text-sm font-medium tracking-tight text-primary">
            Agents
          </h1>
          <span className="rounded-full border border-divider px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
            {mode} feed
          </span>
        </div>
        <p className="mt-3 max-w-[560px] text-sm leading-[26px] tracking-tight text-muted">
          A room for the software agents working across my projects. This first
          pass establishes the shared language; live sources come next.
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
            {agents.length} agents
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
            Waiting
          </p>
          <p className="mt-1 text-sm font-medium tracking-tight text-primary max-sm:mt-0">
            {waitingCount} agent
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
              Parent agents keep their delegated work connected below them.
            </p>
          </div>
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
            Example state
          </p>
        </div>

        <ol className="mt-5 border-l border-divider pl-7">
          {rootAgents.map((agent) => (
            <AgentRow
              agent={agent}
              children={agents.filter((child) => child.parentId === agent.id)}
              key={agent.id}
            />
          ))}
        </ol>
      </section>

      <section className="mt-20 max-w-[680px]">
        <div className="flex items-baseline justify-between gap-5">
          <h2 className="text-sm font-medium tracking-tight text-primary">
            Event stream
          </h2>
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
            One demo run
          </span>
        </div>

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
              <span
                className={
                  event.tone === 'success'
                    ? 'text-[#367356]'
                    : event.tone === 'warning'
                      ? 'text-[#8a6b25]'
                      : 'text-primary'
                }
              >
                {event.message}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 max-w-[680px] border-l-2 border-divider pl-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
          About this feed
        </p>
        <p className="mt-2 max-w-[580px] text-xs leading-[21px] tracking-tight text-muted">
          Everything shown here is example data. The live version will publish
          short, public-safe updates rather than prompts, transcripts, commands,
          file paths, or private output.
        </p>
      </section>
    </main>
  )
}

export default Agents
