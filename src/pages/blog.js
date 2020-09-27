import React from "react"
import styled from "styled-components"
import { Link, graphql } from "gatsby"

import JSONData from "../content/blog"

import SEO from "../components/seo"
import NavBar from "../components/NavBar"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 40px;
`

const BottomContainer = styled.div`
  display: flex;
  margin: 0px 35px;

  align-items: flex-end;

  height: 100%;
  width: 30vw;
`

const Title = styled.h1`
  font-size: 5rem;
  font-weight: bold;
  width: 100%;
`

const BlogPostsWrapper = styled.div`
  width: 100%;
  height: 100%;
`

const Blog = ({ data }) => (
  <Container>
    <SEO title="Blog" />
    <NavBar />
    <Wrapper>
      <BottomContainer>
        <Title>{JSONData.title}</Title>
      </BottomContainer>
      <BlogPostsWrapper>
        <h1>Amazing Pandas Eating Things</h1>
        <h4>{data.allMarkdownRemark.totalCount} Posts</h4>
        {data.allMarkdownRemark.edges.map(({ node }) => (
          <div key={node.id}>
            <Link to={node.fields.slug}>
              <h3>
                {node.frontmatter.title} <span>— {node.frontmatter.date}</span>
              </h3>
              <p>{node.excerpt}</p>
            </Link>
          </div>
        ))}
      </BlogPostsWrapper>
    </Wrapper>
  </Container>
)

export default Blog

export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
          }
          fields {
            slug
          }
          excerpt
        }
      }
    }
  }
`
