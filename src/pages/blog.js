import React from "react"
import styled from "styled-components"

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

const Title = styled.p`
  font-size: 6rem;
  font-weight: bold;
  width: 100%;
`

const BlogPostsWrapper = styled.div`
  width: 100%;
  height: 100%;
`

const Blog = () => (
  <Container>
    <SEO title="Blog" />
    <NavBar />
    <Wrapper>
      <BottomContainer>
        <Title>{JSONData.title}</Title>
      </BottomContainer>
      <BlogPostsWrapper></BlogPostsWrapper>
    </Wrapper>
  </Container>
)

export default Blog
