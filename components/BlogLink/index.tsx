import { FC } from 'react'
import Link from 'next/link'

interface Props {
  post?: {
    slug: string
    title: string
    description: string
  }
  href?: string
  title?: string
  meta?: string
  description?: string
}

const contentClassName =
  'rounded-md px-2.5 py-5 no-underline transition-all duration-200 ease-in hover:bg-hover'

const BlogLink: FC<Props> = ({ post, href, title, meta, description }) => {
  const resolvedHref = href || (post ? `/blog/${post.slug}` : undefined)
  const resolvedTitle = title || post?.title
  const resolvedDescription = description || post?.description

  const content = (
    <>
      <p className="text-sm leading-[26px] font-semibold tracking-tight text-primary">
        {resolvedTitle}
        {meta ? (
          <span className="ml-2 font-normal text-muted">
            {meta}
          </span>
        ) : null}
      </p>
      <p className="text-[13px] leading-[18px] tracking-tight text-muted">
        {resolvedDescription}
      </p>
    </>
  )

  if (!resolvedHref) {
    return (
      <div className={contentClassName.replace(' hover:bg-hover', '')}>
        {content}
      </div>
    )
  }

  if (resolvedHref.startsWith('/')) {
    return (
      <Link href={resolvedHref} className={contentClassName}>
        {content}
      </Link>
    )
  }

  return (
    <a
      href={resolvedHref}
      className={contentClassName}
      target="_blank"
      rel="noreferrer"
    >
      {content}
    </a>
  )
}

export default BlogLink
