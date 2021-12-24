import React, { FC } from 'react'
import Link from 'next/link'

import css from './posts-list.module.css'

interface Props {
  posts: any
}

const PostsList: FC<Props> = ({ posts }) => {
  const sortedPostsPerDate = posts

  return (
    <div className={css.host}>
      <div className={css.wrapper}>
        {sortedPostsPerDate.map(
          (post: {
            sys: { id: React.Key | null | undefined }
            fields: {
              slug: any
              title:
                | boolean
                | React.ReactChild
                | React.ReactFragment
                | React.ReactPortal
                | null
                | undefined
              description:
                | boolean
                | React.ReactChild
                | React.ReactFragment
                | React.ReactPortal
                | null
                | undefined
            }
          }) => (
            <Link key={post.sys.id} href={`/writing/${post.fields.slug}`}>
              <a className={css.postContainer}>
                <p className={css.postTitle}>{post.fields.title}</p>
                <p className={css.postDescription}>{post.fields.description}</p>
              </a>
            </Link>
          )
        )}
      </div>
    </div>
  )
}

export default PostsList
