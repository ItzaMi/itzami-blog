import content from '../content/about.content.json'

import SEO from '../components/SEO'

const About = () => {
  const metadataImagePath =
    'https://itzami.com/images/overallSocialPreview.jpeg'

  return (
    <div className="py-[125px] max-md:py-5 max-md:pb-20">
      <SEO
        title="ItzaMi - The blog website of Rui Sousa"
        description="I'm a self-taught front-end developer with a Master's Degree in Psychology and a knack for design. And this is where I share my experience and knowledge with the internet"
        image={metadataImagePath}
      />

      {content.content.map((paragraph, index) => {
        return (
          <p
            className="mb-5 text-sm leading-[26px] tracking-tight text-primary [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-[3px] [&_a]:transition-all [&_a]:duration-200 [&_a]:ease-in hover:[&_a]:text-muted"
            key={index}
            dangerouslySetInnerHTML={{ __html: paragraph }}
          />
        )
      })}
    </div>
  )
}

export default About
