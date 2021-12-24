import React, { FC, Key } from 'react'
import { createClient } from 'contentful'

import SEO from '../components/SEO'
import BlogLink from '../components/BlogLink'

import css from '../styles/blog.module.css'

export async function getStaticProps() {
  const client = createClient({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN!,
  })

  const res = await client.getEntries({ content_type: 'blogPost' })

  return {
    props: {
      blogPosts: res.items,
      order: '-sys.createdAt',
    },
  }
}

interface Props {
  blogPosts: any
}

const Blog: FC<Props> = ({ blogPosts }) => {
  const metadataImagePath =
    'https://itzami.com/images/overallSocialPreview.jpeg'

  return (
    <div className={css.host}>
      <SEO
        title="ItzaMi - Blog"
        description="I’m a self-taught front-end developer with a Master’s Degree in Psychology and a knack for design. And this is where I share my experience and knowledge with the internet"
        image={metadataImagePath}
      />
      <section className={css.postsWrapper}>
        {blogPosts.map((post: any, key: Key) => (
          <BlogLink post={post} key={key} />
        ))}
      </section>
    </div>
  )
}

export default Blog
