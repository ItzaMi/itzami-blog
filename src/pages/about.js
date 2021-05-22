import React from "react"
import styled from "styled-components"
import { graphql } from "gatsby"

import JSONData from "../content/about"

import Seo from "../components/Seo"
import NavBar from "../components/NavBar"
import SocialLinks from "../components/SocialLinks"

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

  @media (max-width: 415px) {
    width: 100%;
    margin-top: 20px;
    overflow-y: initial;
  }
`

const AboutPage = () => (
  <Container>
    <Seo
      title="About"
      description="Hi, welcome! I'm Rui and I'm a self-taught front-end developer with a Master's degree in Psychology 👋"
    />
    <NavBar />
    <Wrapper>
      <BottomContainer>
        <Title>{JSONData.title}</Title>
      </BottomContainer>
      <ContentWrapper>
        {JSONData.content.map((line, index) => {
          return <p key={index} dangerouslySetInnerHTML={{ __html: line }} />
        })}
        <SocialLinks spacing="true" />
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
