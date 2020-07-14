import React from "react";
import styled from "styled-components";

import JSONData from '../content/homepage';

import SEO from "../components/seo";
import NavBar from '../components/NavBar';
import SocialLinks from '../components/SocialLinks'

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
`

const Introduction = styled.p`
  font-size: 30px;
  font-weight: bold;
  max-width: 50%;
`

const IndexPage = () => {

  return (
    <Container>
      <SEO title="Home" />
      <NavBar />
      <BottomContainer>
        <Introduction>{JSONData.introduction}</Introduction>
        <SocialLinks />
      </BottomContainer>
    </Container>
  )
}

export default IndexPage;
