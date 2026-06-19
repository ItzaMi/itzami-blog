import { apps } from '../content/site.content'

import SEO from '../components/SEO'

const statusLabels = {
  active: 'Active',
  paused: 'Paused',
  shipped: 'Shipped',
  retired: 'Retired',
  failed: 'Failed',
  'not-for-profit': 'Not for profit',
  idea: 'Idea',
}

const Apps = () => {
  const metadataImagePath =
    'https://itzami.com/images/overallSocialPreview.jpeg'

  return (
    <main className="py-[125px] max-md:py-5 max-md:pb-28">
      <SEO
        title="ItzaMi - Apps"
        description="Apps and small products by Rui Sousa."
        image={metadataImagePath}
      />

      <section className="max-w-[560px]">
        <h1 className="text-sm font-medium tracking-tight text-primary">
          Apps
        </h1>
        <p className="mt-3 text-sm leading-[26px] tracking-tight text-muted">
          Small tools I have worked on, from shipped apps to unfinished ideas.
        </p>
      </section>

      <section className="mt-14 flex max-w-[640px] flex-col gap-7">
        {apps.map((app) => {
          const content = (
            <>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <h2 className="text-sm font-medium tracking-tight text-primary">
                  {app.title}
                </h2>
                <span className="text-[13px] leading-[18px] text-muted">
                  {app.year}
                </span>
              </div>
              <p className="mt-1 text-sm leading-[24px] tracking-tight text-muted">
                {app.description}
              </p>
              <p className="mt-1 text-[13px] leading-[18px] text-muted">
                {statusLabels[app.status]}
              </p>
            </>
          )

          if (!app.href) {
            return (
              <div className="rounded-md px-2.5 py-1.5" key={app.title}>
                {content}
              </div>
            )
          }

          return (
            <a
              href={app.href}
              key={app.title}
              className="block rounded-md px-2.5 py-1.5 no-underline transition-all duration-200 ease-in hover:bg-hover"
            >
              {content}
            </a>
          )
        })}
      </section>
    </main>
  )
}

export default Apps
