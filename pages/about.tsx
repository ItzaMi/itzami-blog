import SEO from '../components/SEO'

import css from '../styles/about.module.css'

const About = () => {
  const metadataImagePath = 'https://itzami.com/images/aboutThumbnail.jpg'

  const content = [
    "Hi, welcome! I'm Rui and I'm a self-taught front-end developer 👋",
    "My story starts in Portugal (and so it remains so far) as I am on the verge of finishing my Master's Degree in Psychology. I wasn't sure if I wanted to practice Psychology but the difficulties associated with practicing Psychology in Portugal (it's a very long story) made me think if I actually wanted to devote my effort to get into it.",
    'During my mental debate, in 2018, I found out that it was possible to get a programming career without actually needing a Computer Sciences course and, suddenly, everything was made clear: I was going to try to become a web developer... And so began my adventure in <b>September 2018</b>!',
    "At that time I wasn't really sure what I could or couldn't do or even what I wanted to do but one thing was certain: I wanted to leave my mark in the internet. Even if it was on an obscure website that no one would ever visit... <b>I would just be happy to know that some part of me, or my work, was out there.</b>",
    'So I studied and I studied and I followed a lot of tutorials and applied to a lot of jobs, just wishing that someone would give me my first opportunity within the field.',
    'That soon happened within 6 months of starting my study, in April 2019, and my first job was as a Web Developer/Web Designer for a digital marketing agency. I mostly worked with WordPress but <b>I WAS IN</b>.',
    'After getting that first job I didn\'t stop and kept studying (specially since I wanted to get into a software company) and after a looooooooong time of trial-and-error (with a lot of interviews), <a target="_blank" href="https://coletiv.com/">Coletiv</a> gave me the opportunity, on February 2020, and now here I stand! 😎 I can finally say that I am a <b>Front-End Developer</b> and I am indeed leaving my mark on the internet!',
    "I'm sure that I'll write a more <i>in detail</i> description in the blog part of this website (<i>btw, you should totally check it out</i>) but, for now, this is pretty much everything you may want to know about me.",
    "Feel free to keep following this blog closely since it's not intended to solely talk about coding. I imagine it as a place where I can share my hobbies and passions so expect a lot of gaming and music as well!",
    'If you want to follow me on social media, you can do so on <a target="_blank" href="https://twitter.com/HeyItzaMi">Twitter</a>, <a target="_blank" href="https://www.youtube.com/channel/UCwnDdBqfYvxIzDXXtyQ75fg">YouTube</a>, <a target="_blank" href="https://github.com/ItzaMi">GitHub</a> and <a target="_blank" href="https://dribbble.com/ItzaMi">Dribbble</a> 👋',
  ]

  return (
    <div className={css.host}>
      <SEO
        title="ItzaMi - The blog website of Rui Sousa"
        description="I’m a self-taught front-end developer with a Master’s Degree in Psychology and a knack for design. And this is where I share my experience and knowledge with the internet"
        image={metadataImagePath}
      />

      {content.map((paragraph, index) => {
        return (
          <p
            className={css.paragraph}
            key={index}
            dangerouslySetInnerHTML={{ __html: paragraph }}
          />
        )
      })}
    </div>
  )
}

export default About
