import { FC } from 'react'
import Link from 'next/link'

interface Props {
  post: {
    slug: string
    title: string
    description: string
  }
}

const BlogLink: FC<Props> = ({ post }) => {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="rounded-md px-2.5 py-5 no-underline transition-all duration-200 ease-in hover:bg-hover"
    >
      <p className="text-sm leading-[26px] font-semibold tracking-tight text-primary">
        {post.title}
      </p>
      <p className="text-[13px] leading-[18px] tracking-tight text-muted">
        {post.description}
      </p>
    </Link>
  )
}

export default BlogLink
