import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"

import CodeBlock from "../CodeBlock"

import css from "./blog-post.module.css"

const BlogPost = ({ post }) => {
  return (
    <ReactMarkdown
      components={CodeBlock}
      rehypePlugins={[rehypeRaw]}
      className={css.host}
    >
      {post.fields.markdown}
    </ReactMarkdown>
  )
}

export default BlogPost
