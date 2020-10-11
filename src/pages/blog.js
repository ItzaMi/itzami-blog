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
  margin: 0px 25px 25px 25px;

  height: 70vh;
`

const BottomContainer = styled.div`
  display: flex;
  margin-right: 35px;

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
  width: 60%;
  height: 100%;

  margin: auto;

  div {
    margin-bottom: 3rem;
  }
`

const StyledLink = styled(Link)`
  text-decoration: none;
`

const BlogPostTitle = styled.h6`
  color: #8d9e71;
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
        {data.allMarkdownRemark.edges.map(({ node }) => (
          <div key={node.id}>
            <StyledLink to={node.fields.slug}>
              <BlogPostTitle>
                {node.frontmatter.title} <span>— {node.frontmatter.date}</span>
              </BlogPostTitle>
              <p>{node.excerpt}</p>
            </StyledLink>
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
