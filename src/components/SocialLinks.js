import React from "react";
import styled from "styled-components";

import Dribbble from '../icons/dribbble';
import Twitter from '../icons/twitter';
import Instagram from '../icons/instagram';
import GitHub from '../icons/github';

const Container = styled.div`

`

const SocialLinks = () => (
    <Container>
        <a href="https://twitter.com/HeyItzaMi" target="_blank"><Twitter /></a>
        <a href="https://github.com/ItzaMi" target="_blank"><GitHub /></a>
        <a href="https://www.instagram.com/mr.tomski/" target="_blank"><Instagram /></a>
        <a href="https://dribbble.com/ItzaMi" target="_blank"><Dribbble /></a>
    </Container>
)
export default SocialLinks;
