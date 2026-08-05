import { FC } from 'react'
import Link from 'next/link'

import { getAllPosts, PostMeta } from '../lib/posts'
import content from '../content/home.content.json'
import { projects } from '../content/site.content'
import { getReadingData } from '../lib/books'

import SEO from '../components/SEO'
import BlogLink from '../components/BlogLink'

export async function getStaticProps() {
  const posts = getAllPosts()
  const readingData = getReadingData()

  return {
    props: {
      posts,
      currentlyReading: readingData.currentlyReading.map((book) => ({
        title: book.title,
        author: book.author,
      })),
    },
  }
}

interface Props {
  posts: PostMeta[]
  currentlyReading: Array<{
    title: string
    author: string
  }>
}

const Home: FC<Props> = ({ posts, currentlyReading }) => {
  const metadataImagePath =
    'https://itzami.com/images/overallSocialPreview.jpeg'
  const latestPosts = posts.slice(0, 3)

  return (
    <main className="w-full max-w-[800px] py-[125px] max-md:py-5 max-md:pb-28">
      <SEO
        title="ItzaMi - The blog website of Rui Sousa"
        description="I'm a self-taught front-end developer with a Master's Degree in Psychology and a knack for design. And this is where I share my experience and knowledge with the internet"
        image={metadataImagePath}
      />

      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-2.5">
          <h1 className="text-sm font-medium tracking-tight">Rui Sousa</h1>
          <div className="max-w-[75%] text-sm leading-[26px] tracking-tight text-muted max-md:max-w-full">
            {content.content.map((paragraph, index) => {
              return (
                <p
                  className="[&_a]:text-primary [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-[3px] [&_a]:transition-all [&_a]:duration-200 [&_a]:ease-in hover:[&_a]:text-muted"
                  key={index}
                  dangerouslySetInnerHTML={{ __html: paragraph }}
                />
              )
            })}
          </div>
        </div>
      </section>

      <section className="mt-[95px] flex max-w-[560px] flex-col gap-2.5 max-md:mt-20">
        <h2 className="text-sm font-medium tracking-tight text-primary">
          Projects
        </h2>
        <div className="flex flex-col gap-2.5 px-2.5 py-5">
          <p className="text-sm leading-[26px] tracking-tight text-muted">
            A running list of things I made, shipped, paused, or learned from.
          </p>
          <Link
            href="/projects"
            className="mt-1 w-fit text-sm font-medium tracking-tight text-primary underline underline-offset-[3px] transition-all duration-200 ease-in hover:text-muted"
          >
            View {projects.length} projects
          </Link>
        </div>
      </section>

      <section className="mt-[95px] flex max-w-[560px] flex-col gap-2.5 max-md:mt-20">
        <h2 className="text-sm font-medium tracking-tight text-primary">
          Reading
        </h2>
        <div className="flex flex-col gap-2.5 px-2.5 py-5">
          <div className="grid gap-1">
            <p className="text-sm leading-[26px] tracking-tight text-muted">
              Currently reading
            </p>
            {currentlyReading.length > 0 ? (
              <ul className="grid gap-1">
                {currentlyReading.map((book) => (
                  <li
                    className="text-sm leading-[26px] tracking-tight text-primary"
                    key={`${book.title}-${book.author}`}
                  >
                    {book.title}
                    <span className="text-muted"> by {book.author}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm leading-[26px] tracking-tight text-muted">
                Nothing at the moment.
              </p>
            )}
          </div>
          <Link
            href="/reading"
            className="mt-1 w-fit text-sm font-medium tracking-tight text-primary underline underline-offset-[3px] transition-all duration-200 ease-in hover:text-muted"
          >
            View reading list
          </Link>
        </div>
      </section>

      <section className="mt-[95px] flex flex-col gap-2.5 max-md:mt-20">
        <h2 className="text-sm font-medium tracking-tight text-primary">
          Latest writing
        </h2>
        <div className="flex max-w-[580px] flex-col gap-[7px]">
          {latestPosts.map((post) => (
            <BlogLink post={post} key={post.slug} />
          ))}
        </div>
      </section>
    </main>
  )
}

export default Home
