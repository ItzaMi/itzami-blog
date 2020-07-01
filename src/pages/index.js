import React from "react"

import styled from "styled-components"

import JSONData from '../content/homepage'

import SEO from "../components/seo"

const Container = styled.div`
`

const Title = styled.h1`
  font-size: 150px;
  color: #8D9E71;
  font-weight: bold;
  line-height: 90%;
`

const IndexPage = () => (
  <Container>
    <SEO title="Home" />
    {JSONData.title.map((data, index) => {
      return <Title key={`content_item_${index}`}>{data.line}</Title>
    })}
  </Container>
)

export default IndexPage
