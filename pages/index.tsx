import { FC, Key } from 'react'
import Link from 'next/link'
import { createClient } from 'contentful'

import content from '../content/home.content.json'

import SEO from '../components/SEO'
import BlogLink from '../components/BlogLink'

import css from '../styles/home.module.css'

export async function getStaticProps() {
  const client = createClient({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN!,
  })

  const res = await client.getEntries({
    content_type: 'blogPost',
    'metadata.tags.sys.id[in]': 'featured',
    order: '-sys.createdAt',
  })

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
          <div className={css.description}>
            {content.content.map((paragraph, index) => {
              return (
                <p
                  className={css.paragraph}
                  key={index}
                  dangerouslySetInnerHTML={{ __html: paragraph }}
                />
              )
            })}
          </div>
        </div>
      </section>

      <section className={css.featuredSection}>
        <h2 className={css.featuredTitle}>Featured Posts</h2>
        <div className={css.featuredLinksContainer}>
          {blogPosts.map((post: any, key: Key) => (
            <BlogLink post={post} key={key} />
          ))}
        </div>
      </section>
    </main>
  )
}

export default Home
