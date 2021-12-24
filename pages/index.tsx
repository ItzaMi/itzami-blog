import { FC } from 'react'
import Link from 'next/link'
import { createClient } from 'contentful'

import SEO from '../components/SEO'
import BlogLink from '../components/BlogLink'

import css from '../styles/home.module.css'

export async function getStaticProps() {
  const client = createClient({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN!,
  })

  const res = await client.getEntries({ content_type: 'blogPost' })

  return {
    props: {
      blogPosts: res.items,
    },
  }
}

interface Props {
  blogPosts: any
}

const Home: FC<Props> = ({ blogPosts }) => {
  const metadataImagePath = 'https://itzami.com/images/homepageThumbnail.jpg'

  const featuredBlogPosts = blogPosts.filter((post: any) =>
    post.metadata.tags.find((post: any) => post.sys.id === 'featured')
  )

  return (
    <main className={css.host}>
      <SEO
        title="ItzaMi - The blog website of Rui Sousa"
        description="I’m a self-taught front-end developer with a Master’s Degree in Psychology and a knack for design. And this is where I share my experience and knowledge with the internet"
        image={metadataImagePath}
      />

      <section className={css.section}>
        <div className={css.innerSection}>
          <h1 className={css.title}>Rui Sousa</h1>
          <p className={css.description}>
            Looking to leave my brand on the internet.
            <br />
            Self-taught front-end developer with a Master’s Degree in
            Psychology.
            <br />
            ReactJS developer at{' '}
            <Link href="https://coletiv.com/">
              <a className={css.textLink}>Coletiv</a>
            </Link>
            .
          </p>
        </div>
      </section>

      <section className={css.featuredSection}>
        <h2 className={css.featuredTitle}>Featured Posts</h2>
        <div className={css.featuredLinksContainer}>
          {featuredBlogPosts.map((post: any) => (
            <BlogLink post={post} />
          ))}
        </div>
      </section>
    </main>
  )
}

export default Home
