import Head from "next/head"
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
  return (
    <div className={css.host}>
      <Head>
        <title>ItzaMi</title>
        <meta
          name="description"
          content="ItzaMi - The blog website of Rui Sousa"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Logo />
      <Nav />
      <Info page="Blog" />
      <PostsList posts={blogPosts} className={css.content} />
    </div>
  )
}

export default Blog
