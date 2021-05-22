import React from "react"
import styled from "styled-components"
import { graphql } from "gatsby"

import JSONData from "../content/homepage"

import Seo from "../components/Seo"
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

  @media (max-width: 415px) {
    height: 50vh;
    flex-direction: column;
    align-items: start;
    margin: 0px 25px 20px;
  }
`

const Introduction = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  max-width: 50%;

  @media (max-width: 415px) {
    max-width: 100%;
  }
`

const IndexPage = ({ data }) => {
  const blogPost = data.allMarkdownRemark.edges

  return (
    <Container>
      <Seo
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
    allMarkdownRemark(
      limit: 1
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
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
