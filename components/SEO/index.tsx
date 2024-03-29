import { FC } from 'react'
import Head from 'next/head'

interface Props {
  title: string
  description: string
  image: string
}

const SEO: FC<Props> = ({ title, description, image }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {/* <meta property="og:url" content="https://www.dgtlnk.com/blog/https/" /> */}
      <meta property="og:site_name" content="ItzaMi" />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:site" content="@heyitzami" />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@heyitzami" />
    </Head>
  )
}

export default SEO
