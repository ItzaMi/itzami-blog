/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

function SEO({ description, lang, meta, title, image, url }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            url
            title
            description
            author
            defaultImage: image
            twitterUsername
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description

  // const imageOG = `${site.siteMetadata.siteUrl}${
  //   image || site.siteMetadata.defaultImage
  // }`

  return (
    <Helmet>
      <meta
        property="og:image"
        content={`${site.siteMetadata.url}icons/icon-144x144.png`}
      />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content="https://itzami.com" />
    </Helmet>
  )
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
}

export default SEO
