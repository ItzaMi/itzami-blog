import React, { useContext } from "react"
import styled from "styled-components"
import { ThemeManagerContext } from "gatsby-styled-components-dark-mode"

import JSONData from '../content/homepage'

import SEO from "../components/seo"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
`

const Title = styled.h1`
  font-size: 150px;
  color: #8D9E71;
  font-weight: bold;
  line-height: 90%;
`

const Introduction = styled.p`
  font-size: 30px;
  font-weight: bold;
  max-width: 50%;
`

const IndexPage = () => (
  <Container>

    <SEO title="Home" />
    <div>
      {JSONData.title.map((data, index) => {
        return <Title key={`content_item_${index}`}>{data.line}</Title>
      })}
    </div>
    <Introduction>{JSONData.introduction}</Introduction>
  </Container>
)

export default IndexPage
