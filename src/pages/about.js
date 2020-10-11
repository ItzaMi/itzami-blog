import React from "react"
import styled from "styled-components"
import { Link, graphql } from "gatsby"

import JSONData from "../content/about"

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

const ContentWrapper = styled.div`
  width: 60%;
  height: 100%;

  margin: auto;

  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* make scrollbar transparent */
  }

  a {
    color: #8d9e71 !important;
    text-decoration: none;
    font-weight: bold;
  }
`

const StyledLink = styled(Link)`
  text-decoration: none;
`

const AboutPage = () => (
  <Container>
    <SEO title="Blog" />
    <NavBar />
    <Wrapper>
      <BottomContainer>
        <Title>{JSONData.title}</Title>
      </BottomContainer>
      <ContentWrapper>
        {JSONData.content.map((line, index) => {
          return <p key={index} dangerouslySetInnerHTML={{ __html: line }} />
        })}
      </ContentWrapper>
    </Wrapper>
  </Container>
)

export default AboutPage

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
  }
`
