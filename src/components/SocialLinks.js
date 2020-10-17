import React from "react"
import styled from "styled-components"

import Dribbble from "../icons/dribbble"
import Twitter from "../icons/twitter"
import Instagram from "../icons/instagram"
import GitHub from "../icons/github"

const Container = styled.div`
  ${({ spacing }) =>
    spacing &&
    `
    margin-top: 40px;
    margin-bottom: 20px;

    .socialMedia {
      margin-left: 0px;
      margin-right: 50px;
    }
  `}

  @media (max-width: 415px) {
    width: 100%;
    display: flex;
    justify-content: space-evenly;

    .socialMedia {
      margin-right: 0px;
    }
  }
`

const SocialLinks = ({ spacing, ...props }) => (
  <Container spacing={spacing}>
    <a
      aria-label="twitter button"
      href="https://twitter.com/HeyItzaMi"
      rel="noreferrer"
      target="_blank"
    >
      <Twitter />
    </a>
    <a
      aria-label="github button"
      href="https://github.com/ItzaMi"
      rel="noreferrer"
      target="_blank"
    >
      <GitHub />
    </a>
    <a
      aria-label="instagram button"
      href="https://www.instagram.com/mr.tomski/"
      rel="noreferrer"
      target="_blank"
    >
      <Instagram />
    </a>
    <a
      aria-label="dribbble button"
      href="https://dribbble.com/ItzaMi"
      rel="noreferrer"
      target="_blank"
    >
      <Dribbble />
    </a>
  </Container>
)
export default SocialLinks
