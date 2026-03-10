import React, { FC, Key } from 'react'
import { getAllPosts } from '../lib/posts'

import SEO from '../components/SEO'
import BlogLink from '../components/BlogLink'

import css from '../styles/blog.module.css'

export async function getStaticProps() {
  const posts = getAllPosts()
  
  // Convert to match the old Contentful format for BlogLink component
  const blogPosts = posts.map(post => ({
    fields: {
      title: post.title,
      slug: post.slug,
      date: post.date,
      description: post.description,
      thumbnail: {
        fields: {
          file: {
            url: post.thumbnail.replace('https:', '')
          }
        }
      }
    }
  }))

  return {
    props: {
      blogPosts,
    },
  }
}

interface Props {
  blogPosts: any[]
}

const Blog: FC<Props> = ({ blogPosts }) => {
  const metadataImagePath =
    'https://itzami.com/images/overallSocialPreview.jpeg'

  return (
    <div className={css.host}>
      <SEO
        title="ItzaMi - Blog"
        description="I'm a self-taught front-end developer with a Master's Degree in Psychology and a knack for design. And this is where I share my experience and knowledge with the internet"
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
