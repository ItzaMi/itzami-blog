import ReactMarkdown from "react-markdown"

import CodeBlock from "../CodeBlock"

const BlogPost = ({ post }) => {
  return (
    <ReactMarkdown components={CodeBlock}>{post.fields.markdown}</ReactMarkdown>
  )
}

export default BlogPost
