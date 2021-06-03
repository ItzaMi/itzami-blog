import React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"
import { useLocation } from "@reach/router"
import { useStaticQuery, graphql } from "gatsby"

/** When in doubt, check
 * https://www.gatsbyjs.com/docs/add-seo-component/
 */
const Seo = ({ title, description, image, article }) => {
  const { pathname } = useLocation()
  const { site } = useStaticQuery(query)

  const {
    defaultTitle,
    defaultDescription,
    siteUrl,
    defaultImage,
    twitterUsername,
  } = site.siteMetadata

  const seoFields = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: `${siteUrl}${image || defaultImage}`,
    url: `${siteUrl}${pathname}`,
  }

  return (
    <Helmet title={seoFields.title}>
      <meta name="description" content={seoFields.description} />
      <meta name="image" content={seoFields.image} />
      {console.log(seoFields.image)}

      {seoFields.url && <meta property="og:url" content={seoFields.url} />}

      {(article ? true : null) && <meta property="og:type" content="article" />}

      {seoFields.title && (
        <meta property="og:title" content={seoFields.title} />
      )}

      {seoFields.description && (
        <meta property="og:description" content={seoFields.description} />
      )}

      {seoFields.image && (
        <meta property="og:image" content={seoFields.image} />
      )}

      <meta name="twitter:card" content="summary_large_image" />

      {twitterUsername && (
        <meta name="twitter:creator" content={twitterUsername} />
      )}

      {seoFields.title && (
        <meta name="twitter:title" content={seoFields.title} />
      )}

      {seoFields.description && (
        <meta name="twitter:description" content={seoFields.description} />
      )}

      {seoFields.image && (
        <meta name="twitter:image" content={seoFields.image} />
      )}
    </Helmet>
  )
}

export default Seo

Seo.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  article: PropTypes.bool,
}

Seo.defaultProps = {
  title: null,
  description: null,
  image: null,
  article: false,
}

const query = graphql`
  query Seo {
    site {
      siteMetadata {
        defaultTitle: title
        defaultDescription: description
        siteUrl: url
        defaultImage: image
        twitterUsername
      }
    }
  }
`
