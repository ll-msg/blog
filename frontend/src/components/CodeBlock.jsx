import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math';
import rehypeRaw from "rehype-raw";
import rehypeKatex from 'rehype-katex';
import rehypeSlug from "rehype-slug";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import ReactMarkdown from "react-markdown";

export default function CodeBlock({content}) {
    return(
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeRaw, rehypeKatex, rehypeSlug]}
            components={{
                code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || "");
                    if (!inline && match) {
                        return (
                            <div className="my-6 overflow-hidden rounded-[8px] border border-[#dddddd] bg-[#fafafa]">
                                <SyntaxHighlighter
                                  style={atomOneLight}
                                  language={match[1]}
                                  PreTag="pre"
                                  customStyle={{
                                    margin: 0,
                                    fontSize: '0.8rem',
                                    borderRadius: 0,
                                    background: '#fafafa',
                                  }}
                                >
                                    {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                            </div>
                        );
                    }
                    return (
                        <code
                          {...props}
                          className="rounded bg-[#f1f1f1] px-1.5 py-0.5 font-mono text-[0.88em] font-normal text-[#d19a66]"
                        >
                            {children}
                        </code>
                    );
                },
                a({node, children, ...props}) {
                    return (
                        <a
                          {...props}
                          className="text-[#1677ff] underline decoration-1 underline-offset-[3px] hover:text-[#0958d9]"
                        >
                            {children}
                        </a>
                    );
                }
            }}
        >
            {content}
        </ReactMarkdown>
    )
}
