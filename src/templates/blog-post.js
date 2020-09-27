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
  margin: auto;
  margin-top: 2rem;
`

export default function BlogPost({ data }) {
  const post = data.markdownRemark
  return (
    <>
      <Container>
        <SEO
          title={post.frontmatter.title}
          description={post.frontmatter.title}
          author={post.frontmatter.title}
        />
        <NavBar type="small" />
        <BlogContainer>
          <h1>{post.frontmatter.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </BlogContainer>
      </Container>
    </>
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
