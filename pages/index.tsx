import { FC } from 'react'

import { getAllPosts, Post } from '../lib/posts'
import content from '../content/home.content.json'

import SEO from '../components/SEO'
import BlogLink from '../components/BlogLink'

export async function getStaticProps() {
  const posts = getAllPosts()

  return {
    props: { posts },
  }
}

interface Props {
  posts: Post[]
}

const Home: FC<Props> = ({ posts }) => {
  const metadataImagePath =
    'https://itzami.com/images/overallSocialPreview.jpeg'

  return (
    <main className="w-full max-w-[800px] py-[125px] max-md:py-5 max-md:pb-20">
      <SEO
        title="ItzaMi - The blog website of Rui Sousa"
        description="I'm a self-taught front-end developer with a Master's Degree in Psychology and a knack for design. And this is where I share my experience and knowledge with the internet"
        image={metadataImagePath}
      />

      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-2.5">
          <h1 className="text-sm font-medium tracking-tight">Rui Sousa</h1>
          <div className="max-w-[75%] text-sm leading-[26px] tracking-tight text-muted max-md:max-w-full">
            {content.content.map((paragraph, index) => {
              return (
                <p
                  className="[&_a]:text-primary [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-[3px] [&_a]:transition-all [&_a]:duration-200 [&_a]:ease-in hover:[&_a]:text-muted"
                  key={index}
                  dangerouslySetInnerHTML={{ __html: paragraph }}
                />
              )
            })}
          </div>
        </div>
      </section>

      <section className="mt-[150px] flex flex-col gap-2.5 max-md:mt-20">
        <h2 className="text-sm font-medium tracking-tight text-primary">
          Featured Posts
        </h2>
        <div className="flex max-w-[500px] flex-col gap-[7px]">
          {posts.map((post) => (
            <BlogLink post={post} key={post.slug} />
          ))}
        </div>
      </section>
    </main>
  )
}

export default Home
