import { FC } from 'react'
import { GetStaticProps, GetStaticPaths } from 'next'
import { getAllPostSlugs, getPostBySlug, Post } from '../../lib/posts'

import SEO from '../../components/SEO'
import BlogPost from '../../components/BlogPost'

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug as string
  const post = getPostBySlug(slug)

  if (!post) {
    return { notFound: true }
  }

  return {
    props: { post },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllPostSlugs()
  const paths = slugs.map(slug => ({ params: { slug } }))

  return {
    paths,
    fallback: false,
  }
}

interface Props {
  post: Post
}

const Slug: FC<Props> = ({ post }) => {
  return (
    <div className="w-full max-w-[840px] py-[125px] max-md:py-5 max-md:pb-20">
      <SEO
        title={post.title}
        description={post.description}
        image={post.thumbnail}
      />
      <div>
        <h1 className="mb-[30px] text-[28px] max-md:mb-5 max-md:text-xl">
          {post.title}
        </h1>
        <BlogPost content={post.content} />
      </div>
    </div>
  )
}

export default Slug
