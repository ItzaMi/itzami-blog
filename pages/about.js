import Head from "next/head"

import Logo from "../components/Logo"
import Nav from "../components/Nav"
import Info from "../components/Info"

import content from "../content/about.content.json"

import css from "../styles/about.module.css"

export default function Home() {
  let hostname

  if (typeof window !== "undefined") {
    hostname = window.location.hostname
  }

  const metadataImagePath = hostname + "/images/aboutThumbnail.jpg"

  return (
    <div className={css.host}>
      <SEO
        title="ItzaMi - About "
        description="I’m a self-taught front-end developer with a Master’s Degree in Psychology and a knack for design. And this is where I share my experience and knowledge with the internet"
        image={metadataImagePath}
      />
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
