import content from '../content/about.content.json'

import SEO from '../components/SEO'

import css from '../styles/about.module.css'

const About = () => {
  const metadataImagePath =
    'https://itzami.com/images/overallSocialPreview.jpeg'

  return (
    <div className={css.host}>
      <SEO
        title="ItzaMi - The blog website of Rui Sousa"
        description="I’m a self-taught front-end developer with a Master’s Degree in Psychology and a knack for design. And this is where I share my experience and knowledge with the internet"
        image={metadataImagePath}
      />

      {content.content.map((paragraph, index) => {
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
