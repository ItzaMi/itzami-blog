import { createClient } from "contentful"

import PostsList from "../components/PostsList"
import Logo from "../components/Logo"
import Nav from "../components/Nav"
import Info from "../components/Info"

import css from "../styles/blog.module.css"

export async function getStaticProps() {
  const client = createClient({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
  })

  const res = await client.getEntries({ content_type: "blogPost" })

  return {
    props: {
      blogPosts: res.items,
    },
  }
}

const Blog = ({ blogPosts }) => {
  let hostname

  if (typeof window !== "undefined") {
    hostname = window.location.hostname
  }

  const metadataImagePath = hostname + "/images/blogThumbnail.jpg"

  return (
    <div className={css.host}>
      <SEO
        title="ItzaMi - Blog"
        description="I’m a self-taught front-end developer with a Master’s Degree in Psychology and a knack for design. And this is where I share my experience and knowledge with the internet"
        image={metadataImagePath}
      />
      <Logo />
      <Nav />
      <Info page="Blog" />
      <PostsList posts={blogPosts} className={css.content} />
    </div>
  )
}

export default Blog
