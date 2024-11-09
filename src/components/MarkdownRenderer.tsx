import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

interface MarkdownRendererProps {
    content: string;
    className?: string;
    overrides?: Record<string, string>;
}

export default function MarkdownRenderer({ content, className = '', overrides = {}}: MarkdownRendererProps) {
  return (
        <ReactMarkdown
            className={`prose prose-invert max-w-none ${className}`}
            remarkPlugins={[remarkGfm]}
            components={{
                h2: ({ children }) => (
                    <h2 className="text-2xl font-mono text-green-400 mt-8 mb-4">{children}</h2>
                ),
                h3: ({ children }) => (
                    <h3 className="text-xl font-mono text-green-400 mt-6 mb-3">{children}</h3>
                ),
                p: ({ children }) => (
                    <p className={`mb-4 ${overrides?.p ?? "text-gray-300"}`}>{children}</p>
                ),
                a: ({ href, children }) => (
                    <Link
                        href={href || '#'}
                        className="text-green-400 hover:text-green-300 underline"
                    >
                        {children}
                    </Link>
                ),
                code: ({ node, inline, children, ...props }) => (
                    inline ?
                        <code className="bg-green-900/30 text-green-400 px-1 py-0.5 rounded" {...props}>
                            {children}
                        </code> :
                        <code className="block bg-green-900/30 p-4 rounded-lg overflow-x-auto" {...props}>
                            {children}
                        </code>
                ),
                ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-4 text-gray-300">
                        {children}
                    </ul>
                ),
                ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-4 text-gray-300">
                        {children}
                    </ol>
                ),
                blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-green-500 pl-4 my-4 text-gray-400 italic">
                        {children}
                    </blockquote>
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );
}