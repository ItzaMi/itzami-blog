import { projects } from '../content/site.content'

import SEO from '../components/SEO'
import BlogLink from '../components/BlogLink'

const projectGroups = [
  {
    key: 'ongoing',
    title: 'Still around',
    description: 'Projects that are live, useful, or still part of my orbit.',
  },
  {
    key: 'closed',
    title: 'Closed',
    description:
      'Projects that shipped, taught me something, and then reached their natural end.',
  },
] as const

const groupedProjects = projects.reduce<
  Record<(typeof projectGroups)[number]['key'], typeof projects>
>(
  (groups, project) => {
    groups[project.group] = [...groups[project.group], project]
    return groups
  },
  {
    ongoing: [],
    closed: [],
  },
)

const Projects = () => {
  const metadataImagePath =
    'https://itzami.com/images/overallSocialPreview.jpeg'

  return (
    <main className="w-full max-w-[800px] py-[125px] max-md:py-5 max-md:pb-28">
      <SEO
        title="ItzaMi - Projects"
        description="A running list of projects Rui Sousa has worked on."
        image={metadataImagePath}
      />

      <section className="max-w-[560px]">
        <h1 className="text-sm font-medium tracking-tight text-primary">
          Projects
        </h1>
        <p className="mt-3 text-sm leading-[26px] tracking-tight text-muted">
          Things I shipped, paused, closed, or kept around. Some made sense as
          products. Some were just useful reps.
        </p>
      </section>

      <section className="mt-14 flex max-w-[560px] flex-col gap-16">
        {projectGroups.map((group) => (
          <section className="flex flex-col gap-7" key={group.key}>
            <div className="max-w-[520px]">
              <h2 className="text-sm font-medium tracking-tight text-primary">
                {group.title}
              </h2>
              <p className="mt-1 text-sm leading-[24px] tracking-tight text-muted">
                {group.description}
              </p>
            </div>

            <div className="flex flex-col gap-7">
              {groupedProjects[group.key].map((project) => (
                <BlogLink
                  description={project.description}
                  href={project.href}
                  key={project.title}
                  meta={`${project.year} · ${project.kind}`}
                  title={project.title}
                />
              ))}
            </div>
          </section>
        ))}
      </section>
    </main>
  )
}

export default Projects
