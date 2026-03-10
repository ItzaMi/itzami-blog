import React from 'react'
import { getAllPostSlugs, getPostBySlug } from '../../lib/posts'

import SEO from '../../components/SEO'
import BlogPost from '../../components/BlogPost'

import css from '../../styles/post.module.css'

export async function getStaticProps(context) {
  const post = getPostBySlug(context.params.slug)

  if (!post) {
    return { props: {} }
  }

  // Convert to match the old Contentful format for BlogPost component
  const formattedPost = {
    fields: {
      title: post.title,
      description: post.description,
      thumbnail: {
        fields: {
          file: {
            url: post.thumbnail.replace('https:', '')
          }
        }
      },
      markdown: post.content
    }
  }

  return {
    props: {
      post: formattedPost,
    },
  }
}

export async function getStaticPaths() {
  const slugs = getAllPostSlugs()
  const paths = slugs.map(slug => ({ params: { slug } }))

  return {
    paths,
    fallback: false,
  }
}

const Slug = ({ post }) => {
  const modifiedImageUrl = 'https:' + post.fields.thumbnail.fields.file.url

  return (
    <div className={css.host}>
      <SEO
        title={post.fields.title}
        description={post.fields.description}
        image={modifiedImageUrl}
      />
      <div className={css.content}>
        <h1 className={css.postTitle}>{post.fields.title}</h1>
        <BlogPost post={post} />
      </div>
    </div>
  )
}

export default Slug
