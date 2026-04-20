import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { duotoneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import type { Components } from 'react-markdown'

const CodeBlock: Partial<Components> = {
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '')
    const codeString = String(children).replace(/\n$/, '')

    return match ? (
      <SyntaxHighlighter
        style={duotoneLight}
        language={match[1]}
        PreTag="div"
      >
        {codeString}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },
}

export default CodeBlock
