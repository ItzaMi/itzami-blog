import { FC } from 'react'
import { getAllPosts, PostMeta } from '../lib/posts'

import SEO from '../components/SEO'
import BlogLink from '../components/BlogLink'

export async function getStaticProps() {
  const posts = getAllPosts()

  return {
    props: { posts },
  }
}

interface Props {
  posts: PostMeta[]
}

const Blog: FC<Props> = ({ posts }) => {
  const metadataImagePath =
    'https://itzami.com/images/overallSocialPreview.jpeg'

  return (
    <div className="py-[125px] max-md:py-5 max-md:pb-20">
      <SEO
        title="ItzaMi - Blog"
        description="I'm a self-taught front-end developer with a Master's Degree in Psychology and a knack for design. And this is where I share my experience and knowledge with the internet"
        image={metadataImagePath}
      />
      <section className="flex max-w-[500px] flex-col gap-2.5">
        {posts.map((post) => (
          <BlogLink post={post} key={post.slug} />
        ))}
      </section>
    </div>
  )
}

export default Blog
