import React from "react"
import styled from "styled-components"
import { graphql } from "gatsby"
import { defineCustomElements as deckDeckGoHighlightElement } from "@deckdeckgo/highlight-code/dist/loader"

import Seo from "../components/Seo"
import NavBar from "../components/NavBar"
import SocialLinks from "../components/SocialLinks"

deckDeckGoHighlightElement()

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const BlogContainer = styled.div`
  width: 60%;
  max-width: 1000px;
  margin: auto;
  margin-top: 3rem;
  margin-bottom: 3rem;

  h1 {
    font-size: 3.5rem;
  }

  p {
    margin-bottom: 15px;
  }

  @media (max-width: 415px) {
    width: 90%;
    margin: 80px 20px 20px;

    h1 {
      font-size: 1.5rem;
    }
  }
`

const BlogContent = styled.div`
  margin-top: 2rem;

  h2,
  h3,
  h4 {
    margin-top: 4rem;
    margin-bottom: 1rem;
  }

  a {
    color: #8d9e71 !important;
    text-decoration: none;
    font-weight: bold;
  }

  img {
    margin-bottom: 30px !important;
    position: relative !important;
  }

  .gatsby-resp-image-link {
    pointer-events: none;
  }

  .gatsby-resp-image-background-image {
    padding-bottom: 0px !important;
  }

  blockquote {
    font-weight: bold;
    margin-left: 0px;
    padding-left: 20px;
  }
`

export default function BlogPost({ data }) {
  const post = data.markdownRemark
  return (
    <Container>
      <Seo
        title={post.frontmatter.title}
        description={post.frontmatter.description}
        author={post.frontmatter.author}
        image={post.frontmatter.image.childImageSharp.fluid}
      />
      <NavBar type="small" />
      <BlogContainer>
        <h1>{post.frontmatter.title}</h1>
        <BlogContent dangerouslySetInnerHTML={{ __html: post.html }} />
        <SocialLinks spacing="true" />
      </BlogContainer>
    </Container>
  )
}

export const query = graphql`
  query ($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        description
        author
        image {
          childImageSharp {
            fluid(maxWidth: 2048, quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`
