import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Components } from 'react-markdown';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content, className = '' }) => {
  const components: Components = {
    code({ node, className: codeClassName, children, ...props }) {
      const match = /language-(\w+)/.exec(codeClassName || '');
      const codeString = String(children).replace(/\n$/, '');
      const isBlockCode = !!match || codeString.includes('\n');

      if (isBlockCode) {
        const lang = match ? match[1] : 'text';
        return (
          <SyntaxHighlighter
            PreTag="div"
            language={lang}
            style={oneDark}
            customStyle={{ margin: 0, borderRadius: 8, fontSize: 14 }}
            codeTagProps={{ style: { fontFamily: 'ui-monospace, monospace' } }}
            showLineNumbers={false}
          >
            {codeString}
          </SyntaxHighlighter>
        );
      }

      return (
        <code className="inline-code" {...props}>
          {children}
        </code>
      );
    },
    pre({ children }) {
      return <div className="markdown-pre">{children}</div>;
    },
  };

  return (
    <div className={`markdown-body ${className}`}>
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
};
