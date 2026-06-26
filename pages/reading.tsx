import { getReadingData, ReadingData } from '../lib/books'

import SEO from '../components/SEO'
import BookList from '../components/BookList'

export async function getStaticProps() {
  return {
    props: {
      readingData: getReadingData(),
    },
  }
}

interface Props {
  readingData: ReadingData
}

function getReadYear(dateRead: string) {
  if (!dateRead) {
    return 'Undated'
  }

  return dateRead.split('/')[0] || 'Undated'
}

const Reading = ({ readingData }: Props) => {
  const metadataImagePath =
    'https://itzami.com/images/overallSocialPreview.jpeg'
  const { counts, currentlyReading, read } = readingData
  const readByYear = read.reduce<Record<string, typeof read>>((years, book) => {
    const year = getReadYear(book.dateRead)

    return {
      ...years,
      [year]: [...(years[year] || []), book],
    }
  }, {})
  const years = Object.keys(readByYear).sort((a, b) => {
    if (a === 'Undated') {
      return 1
    }

    if (b === 'Undated') {
      return -1
    }

    return Number(b) - Number(a)
  })

  return (
    <main className="py-[125px] max-md:py-5 max-md:pb-40">
      <SEO
        title="ItzaMi - Reading"
        description="Books Rui Sousa is reading and has recently finished."
        image={metadataImagePath}
      />

      <section className="max-w-[560px]">
        <h1 className="text-sm font-medium tracking-tight text-primary">
          Reading
        </h1>
        <p className="mt-3 text-sm leading-[26px] tracking-tight text-muted">
          {counts.total} registered books and {counts.currentlyReading}{' '}
          currently in progress.
        </p>
      </section>

      <section className="mt-14 max-w-[800px]">
        {currentlyReading.length > 0 ? (
          <section>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-sm font-medium tracking-tight text-primary">
                Current reads
              </h2>
              <span className="text-[13px] tracking-tight text-muted">
                {counts.currentlyReading}
              </span>
            </div>
            <BookList books={currentlyReading} />
          </section>
        ) : null}

        <section className="mt-12">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-sm font-medium tracking-tight text-primary">
              Finished books
            </h2>
            <span className="text-[13px] tracking-tight text-muted">
              {counts.read}
            </span>
          </div>
          <div className="mt-5 grid gap-12">
            {years.map((year) => (
              <section
                className="grid grid-cols-[64px_1fr] gap-5 max-sm:grid-cols-1 max-sm:gap-3"
                key={year}
              >
                <div className="sticky top-8 self-start bg-surface/90 backdrop-blur-sm max-sm:top-0 max-sm:z-10 max-sm:-mx-2.5 max-sm:px-2.5 max-sm:py-2">
                  <h3 className="text-sm font-medium leading-[24px] tracking-tight text-primary">
                    {year}
                  </h3>
                </div>

                <ol className="grid gap-1">
                  {readByYear[year].map((book) => (
                    <li
                      className="group grid grid-cols-[58px_1fr] items-baseline gap-3 rounded-md px-2.5 py-1.5 text-sm leading-[24px] tracking-tight transition-all duration-200 ease-in hover:bg-hover max-sm:grid-cols-1 max-sm:gap-0 max-sm:py-2.5"
                      key={book.goodreadsId || `${book.title}-${book.author}`}
                    >
                      {book.dateRead ? (
                        <span className="font-mono text-[11px] text-muted max-sm:mb-0.5">
                          {book.dateRead.slice(5)}
                        </span>
                      ) : null}
                      <span>
                        <span className="text-primary">{book.title}</span>
                        <span className="text-muted max-sm:block">
                          {' '}
                          by {book.author}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}

export default Reading
