import React from "react"
import styled from "styled-components"
import { graphql } from "gatsby"

import JSONData from "../content/homepage"

import SEO from "../components/seo"
import NavBar from "../components/NavBar"
import HeroBlogPost from "../components/HeroBlogPost"
import SocialLinks from "../components/SocialLinks"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
`

const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0px 35px 40px;
  align-items: flex-end;
`

const Introduction = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  max-width: 50%;
`

const IndexPage = ({ data }) => {
  const blogPost = data.allMarkdownRemark.edges

  return (
    <Container>
      <SEO
        title={data.site.siteMetadata.title}
        description={data.site.siteMetadata.description}
        author={data.site.siteMetadata.author}
      />
      <NavBar />
      <HeroBlogPost post={blogPost} />
      <BottomContainer>
        <Introduction>{JSONData.introduction}</Introduction>
        <SocialLinks />
      </BottomContainer>
    </Container>
  )
}

export default IndexPage

export const query = graphql`
  query {
    allMarkdownRemark(limit: 1) {
      edges {
        node {
          frontmatter {
            title
            date
          }
          excerpt
          fields {
            slug
          }
        }
      }
    }
    site {
      siteMetadata {
        title
        description
        author
      }
    }
  }
`
