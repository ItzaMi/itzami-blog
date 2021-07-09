import Head from "next/head"

import Logo from "../components/Logo"
import Nav from "../components/Nav"
import Info from "../components/Info"

import css from "../styles/index.module.css"

export default function Home() {
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
      <Info />
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
        <div className={css.postContainer}>
          <p className={css.postCTA}>Read my latest post</p>
          <p className={css.postTitle}>
            How to build an accordion with JavaScript
          </p>
        </div>
      </div>
    </div>
  )
}
