import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import useDarkMode from "use-dark-mode"

import JSONData from "../content/homepage"

const Container = styled.div`
  display: flex;
  align-items: end;
  width: 100%;
  justify-content: space-between;
  margin-top: 25px;

  @media (max-width: 415px) {
    margin-top: 20px;
  }
`

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const Title = styled(props => <Link {...props} />)`
  font-size: 5rem;
  color: #8d9e71 !important;
  font-weight: bold;
  line-height: 90%;
  text-decoration: none;
  margin-left: 25px;

  @media (max-width: 415px) {
    font-size: 2rem;
    margin-left: 20px;
  }
`

const Button = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const Menu = styled.ul`
  margin-right: 35px;
  list-style-type: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 20%;

  @media (max-width: 415px) {
    width: 45%;
    margin-right: 20px;
  }
`

const StyledLink = styled(props => <Link {...props} />)`
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;

  @media (max-width: 415px) {
    font-size: 1rem;
  }
`

const NavBar = () => {
  const darkMode = useDarkMode(false)

  return (
    <Container>
      <TitleContainer>
        {JSONData.title.map((data, index) => {
          return (
            <Title to="/" key={`content_item_${index}`}>
              {data.line}
            </Title>
          )
        })}
      </TitleContainer>
      <Menu>
        <StyledLink className="navLink" to="/blog">
          Blog
        </StyledLink>
        <StyledLink className="navLink" to="/about">
          About
        </StyledLink>
        <li className="dark-mode-toggle">
          <Button checked={darkMode.value} onClick={darkMode.toggle}></Button>
        </li>
      </Menu>
    </Container>
  )
}

export default NavBar
