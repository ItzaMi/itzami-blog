import React from "react";
import { Link } from 'gatsby';
import styled from "styled-components";

import JSONData from '../content/homepage';

const Container = styled.div`
    display: flex;
    align-items: end;
    width: 100%;
    justify-content: space-between;
    margin-top: 25px;
`

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const Title = styled(props => <Link {...props} />)`
  font-size: 150px;
  color: #8D9E71;
  font-weight: bold;
  line-height: 90%;
  text-decoration: none;
  margin-left: 25px;
`

const Menu = styled.ul`
    margin-right: 35px;
    list-style-type: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 15%;
`

const StyledLink = styled(props => <Link {...props} />)`
    font-size: 30px;
    font-weight: bold;
    text-decoration: none;
`

const NavBar = () => {
    return (
        <Container>
            <TitleContainer>
                {JSONData.title.map((data, index) => {
                    return <Title to="/" key={`content_item_${index}`}>{data.line}</Title>
                })}
            </TitleContainer>
            <Menu>
                <StyledLink className="navLink" to="/blog">Blog</StyledLink>
                <StyledLink className="navLink" to="/about">About</StyledLink>
            </Menu>
        </Container>
    )
}

export default NavBar;