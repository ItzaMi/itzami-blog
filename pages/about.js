import Head from "next/head"

import Logo from "../components/Logo"
import Nav from "../components/Nav"
import Info from "../components/Info"

import content from "../content/about.content.json"

import css from "../styles/about.module.css"

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
      <Info page="About" />
      <div className={css.content}>
        {content.content.map((paragraph, index) => {
          return (
            <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
          )
        })}
      </div>
    </div>
  )
}
