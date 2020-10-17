import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"

const Container = styled(Link)`
  position: absolute;
  top: 50%;
  right: 0px;
  transform: translate(0%, -50%);

  padding: 20px 30px;
  width: 35%;

  text-decoration: none;

  @media (max-width: 415px) {
    position: initial;
    transform: none;

    display: block;

    width: 100%;
    padding: 20px;
    box-sizing: border-box;
  }
`

const Title = styled.p`
  font-size: 1.3rem;
  font-weight: bold;

  @media (max-width: 415px) {
    font-size: 0.8rem;
    line-height: 1rem;
  }
`

const SubTitle = styled.p`
  font-size: 1rem;
  font-weight: 300;
  margin-bottom: 1rem;

  @media (max-width: 415px) {
    font-size: 0.6rem;
    margin-bottom: 8px;
    line-height: 1rem;
  }
`

const HeroBlogPost = ({ post }) => (
  <>
    {post.map(({ node }, index) => {
      return (
        <Container to={node.fields.slug} className="shadowBox" key={index}>
          <SubTitle>Latest post</SubTitle>
          <Title>{node.frontmatter.title}</Title>
        </Container>
      )
    })}
  </>
)

export default HeroBlogPost
