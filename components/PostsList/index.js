import React from "react"
import Link from "next/link"

import css from "./posts-list.module.css"

const PostsList = ({ posts = [] }) => {
  const sortedPostsPerDate = [...posts].sort((a, b) => {
    return new Date(b.fields.date) - new Date(a.fields.date)
  })

  return (
    <div className={css.host}>
      <div className={css.wrapper}>
        {sortedPostsPerDate.map(post => (
          <Link key={post.sys.id} href={`/blog/${post.fields.slug}`}>
            <a className={css.postContainer}>
              <p className={css.postTitle}>{post.fields.title}</p>
              <p className={css.postDescription}>{post.fields.description}</p>
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default PostsList
