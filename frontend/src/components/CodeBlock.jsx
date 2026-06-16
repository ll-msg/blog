import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math';
import rehypeRaw from "rehype-raw";
import rehypeKatex from 'rehype-katex';
import rehypeSlug from "rehype-slug";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import ReactMarkdown from "react-markdown";

export default function CodeBlock({content}) {
    return(
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeRaw, rehypeKatex, rehypeSlug]}
            components={{
                code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || "");
                    if (!inline && match) {
                        return (
                            <div className="hud-panel-glow my-6 overflow-hidden border border-[#4df0ff]/25 border-l-[3px] border-l-[#4df0ff] bg-[#0a121a]">
                                <SyntaxHighlighter
                                  style={atomOneDark}
                                  language={match[1]}
                                  PreTag="pre"
                                  customStyle={{
                                    margin: 0,
                                    fontSize: '0.8rem',
                                    borderRadius: 0,
                                    background: '#0a121a',
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
                          className="border border-[#4df0ff]/20 bg-[#0a121a] px-1.5 py-0.5 font-mono text-[0.88em] font-normal text-[#9fe6ff]"
                        >
                            {children}
                        </code>
                    );
                },
                a({node, children, ...props}) {
                    return (
                        <a
                          {...props}
                          className="text-[#4df0ff] underline decoration-1 underline-offset-[3px] hover:text-[#9bf6ff]"
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
