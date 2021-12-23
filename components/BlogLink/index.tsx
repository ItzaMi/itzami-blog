import { FC } from 'react'
import Link from 'next/link'

import css from './blog-link.module.css'

interface Props {
  post: any
}

const BlogLink: FC<Props> = ({ post }) => {
  return (
    <Link key={post.sys.id} href={`/blog/${post.fields.slug}`}>
      <a className={css.host}>
        <p className={css.title}>{post.fields.title}</p>
        <p className={css.description}>{post.fields.description}</p>
      </a>
    </Link>
  )
}

export default BlogLink
