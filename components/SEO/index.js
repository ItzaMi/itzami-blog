import Head from "next/head"

const SEO = ({ title, description, image }) => {
  const modifiedImageUrl = image

  return (
    <Head>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {/* <meta property="og:url" content="https://www.dgtlnk.com/blog/https/" /> */}
      <meta property="og:site_name" content="ItzaMi" />
      <meta property="og:image" content={modifiedImageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:site" content="@heyitzami" />
      <meta name="twitter:image" content={modifiedImageUrl} />
      <meta name="twitter:creator" content="@heyitzami" />
    </Head>
  )
}

export default SEO
