import Head from "next/head"
import Link from "next/link"
import { createClient } from "contentful"

import Logo from "../components/Logo"
import Nav from "../components/Nav"
import Info from "../components/Info"
import SEO from "../components/SEO"

import css from "../styles/index.module.css"

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

const Home = ({ blogPosts }) => {
  const latestPost = [...blogPosts].reduce((a, b) =>
    a.fields.date > b.fields.date ? a : b
  )

  return (
    <div className={css.host}>
      <SEO
        title="ItzaMi - The blog website of Rui Sousa"
        description="I’m a self-taught front-end developer with a Master’s Degree in Psychology and a knack for design. And this is where I share my experience and knowledge with the internet"
        image="/assets/homepageThumbnail.jpg"
      />
      <Logo />
      <Nav />
      <Info page="Homepage" />
      <div className={css.content}>
        <div className={css.descriptionContainer}>
          <p>Hey, I’m Rui 👋</p>
          <p>
            I’m a self-taught front-end developer with a Master’s Degree in
            Psychology and a knack for design
          </p>
          <p>
            And this is where I share my experience and knowledge with the
            internet
          </p>
        </div>
        <Link href={`/blog/${latestPost.fields.slug}`}>
          <div className={css.postContainer}>
            <p className={css.postCTA}>Read my latest post</p>
            <p className={css.postTitle}>{latestPost.fields.title}</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Home
