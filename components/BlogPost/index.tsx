import { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

import CodeBlock from '../CodeBlock'

interface Props {
  content: string
}

const BlogPost: FC<Props> = ({ content }) => {
  return (
    <ReactMarkdown
      components={CodeBlock}
      rehypePlugins={[rehypeRaw]}
      className="prose max-w-none text-primary prose-headings:text-primary prose-a:text-primary prose-a:font-medium prose-a:underline prose-a:underline-offset-[3px] prose-a:transition-all prose-a:duration-200 prose-a:ease-in hover:prose-a:text-muted prose-img:max-w-full prose-img:md:max-w-[800px] prose-code:rounded prose-code:bg-code-bg prose-code:px-2 prose-code:py-1 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-li:mb-2.5"
    >
      {content}
    </ReactMarkdown>
  )
}

export default BlogPost
