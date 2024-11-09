import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

interface MarkdownRendererProps {
    content: string;
    className?: string;
    overrides?: Record<string, string>;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
    return (
        <div className={className}>
            <ReactMarkdown
                className="prose-sm w-full"
                remarkPlugins={[remarkGfm]}
                components={{
                    h2: ({ children }) => (
                        <h2 className="text-lg font-semibold mb-2">{children}</h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-base font-semibold mb-2">{children}</h3>
                    ),
                    p: ({ children }) => (
                        <p className="mb-2 last:mb-0">{children}</p>
                    ),
                    a: ({ href, children }) => (
                        <Link
                            href={href || '#'}
                            className="underline hover:opacity-80"
                        >
                            {children}
                        </Link>
                    ),
                    code: ({ node, inline, children, ...props }) => (
                        inline ?
                            <code className="bg-black/20 px-1 py-0.5 rounded" {...props}>
                                {children}
                            </code> :
                            <code className="block bg-black/20 p-2 rounded text-sm overflow-x-auto" {...props}>
                                {children}
                            </code>
                    ),
                    ul: ({ children }) => (
                        <ul className="list-disc list-inside mb-2">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="list-decimal list-inside mb-2">
                            {children}
                        </ol>
                    ),
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-current pl-2 my-2 italic opacity-90">
                            {children}
                        </blockquote>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}