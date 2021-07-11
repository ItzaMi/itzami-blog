import Head from "next/head"

const SEO = ({ title, description, image }) => {
  return (
    <Head>
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {/* <meta property="og:url" content="https://www.dgtlnk.com/blog/https/" /> */}
      <meta property="og:site_name" content="ItzaMi" />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:site" content="@heyitzami" />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@heyitzami" />
    </Head>
  )
}

export default SEO
