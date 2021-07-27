import React, { useEffect, useState } from "react"
import { createClient } from "contentful"

import Logo from "../../components/Logo"
import Nav from "../../components/Nav"
import Info from "../../components/Info"
import SEO from "../../components/SEO"
import BlogPost from "../../components/BlogPost"

import css from "../../styles/post.module.css"

export async function getStaticProps(context) {
  const client = createClient({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
  })

  // Fetch all results where `fields.slug` is equal to the `slug` param
  const result = await client
    .getEntries({
      content_type: "blogPost",
      "fields.slug": context.params.slug,
    })
    .then(response => response.items)

  // Since `slug` was set to be a unique field, we can be confident that
  // the only result in the query is the correct post.
  const post = result.pop()

  // If nothing was found, return an empty object for props, or else there would
  // be an error when Next tries to serialize an `undefined` value to JSON.
  if (!post) {
    return { props: {} }
  }

  // Return the post as props
  return {
    props: {
      post,
    },
  }
}

export async function getStaticPaths() {
  const client = createClient({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
  })

  // Query Contentful for all blog posts in the space
  const posts = await client
    .getEntries({ content_type: "blogPost" })
    .then(response => response.items)

  // Map the result of that query to a list of slugs.
  // This will give Next the list of all blog post pages that need to be
  // rendered at build time.
  const paths = posts.map(({ fields: { slug } }) => ({ params: { slug } }))

  return {
    paths,
    fallback: false,
  }
}

const Slug = ({ post }) => {
  const [isWindowOnMobileScreen, setIsWindowOnMobileScreen] = useState(false)
  const modifiedImageUrl = "https:" + post.fields.thumbnail.fields.file.url

  const handleResize = () => {
    if (window) {
      setIsWindowOnMobileScreen(window.matchMedia("(max-width: 500px)").matches)
    }
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize)
  }, [])

  return (
    <div className={css.host}>
      <SEO
        title={post.fields.title}
        description={post.fields.description}
        image={modifiedImageUrl}
      />
      <Logo className={css.logo} />
      <Nav className={css.nav} />
      {!isWindowOnMobileScreen && <Info page="Blog" />}
      <div className={css.content}>
        <BlogPost post={post} />
      </div>
    </div>
  )
}

export default Slug
