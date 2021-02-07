import React from "react"
import styled from "styled-components"
import { Link, graphql } from "gatsby"
import { defineCustomElements as deckDeckGoHighlightElement } from '@deckdeckgo/highlight-code/dist/loader';

import JSONData from "../content/blog"

import SEO from "../components/seo"
import NavBar from "../components/NavBar"

deckDeckGoHighlightElement();

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0px 20px 20px 20px;

  height: 70vh;

  @media (max-width: 415px) {
    flex-direction: column;
  }
`

const BottomContainer = styled.div`
  display: flex;
  margin-right: 35px;

  align-items: flex-end;

  height: 100%;
  width: 30vw;

  @media (max-width: 415px) {
    width: 100%;
    height: auto;
  }
`

const Title = styled.h1`
  font-size: 5rem;
  font-weight: bold;
  width: 100%;

  @media (max-width: 415px) {
    font-size: 2rem;
  }
`

const BlogPostsWrapper = styled.div`
  width: 60%;
  height: 100%;

  margin: auto;

  div {
    margin-bottom: 3rem;

    @media (max-width: 415px) {
      margin-bottom: 1.5rem;
    }
  }

  @media (max-width: 415px) {
    width: 100%;
    margin-top: 20px;
  }
`

const StyledLink = styled(Link)`
  text-decoration: none;
`

const BlogPostTitle = styled.h6`
  color: #8d9e71;

  @media (max-width: 415px) {
    font-size: 1.3rem;
    margin-bottom: 14px;
  }
`

const BlogPostLink = styled.p`
  color: #8d9e71;
  display: block;

  @media (max-width: 415px) {
    font-size: 1rem;
    line-height: 1.4rem;
  }
`

const BlogPostExcerpt = styled.p`
  display: inline;

  @media (max-width: 415px) {
    font-size: 1rem;
    line-height: 1.4rem;
  }
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
              <BlogPostTitle>{node.frontmatter.title}</BlogPostTitle>
              <BlogPostExcerpt>{node.excerpt}</BlogPostExcerpt>
              <BlogPostLink>Read Post</BlogPostLink>
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
