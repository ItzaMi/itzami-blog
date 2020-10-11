import React from "react"
import styled from "styled-components"
import { graphql } from "gatsby"

import SEO from "../components/seo"
import NavBar from "../components/NavBar"

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
`

const BlogContent = styled.div`
  margin-top: 2rem;

  h2,
  h3,
  h4 {
    margin-top: 4rem;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 3rem;
  }

  h3 {
    font-size: 2.5rem;
  }

  h4 {
    font-size: 2rem;
  }

  a {
    color: #8d9e71;
    text-decoration: none;
    font-weight: bold;
  }
`

export default function BlogPost({ data }) {
  const post = data.markdownRemark
  return (
    <Container>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.title}
        author={post.frontmatter.title}
      />
      <NavBar type="small" />
      <BlogContainer>
        <h1>{post.frontmatter.title}</h1>
        <BlogContent dangerouslySetInnerHTML={{ __html: post.html }} />
      </BlogContainer>
    </Container>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`
