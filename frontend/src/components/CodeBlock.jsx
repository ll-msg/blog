import remarkGfm from 'remark-gfm'
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import ReactMarkdown from "react-markdown";

export default function CodeBlock({content}) {
    return(
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSlug]}
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
                }
            }}
        >
            {content}
        </ReactMarkdown>
    )
}
