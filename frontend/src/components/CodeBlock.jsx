import remarkGfm from 'remark-gfm'
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import ReactMarkdown from "react-markdown";

export default function CodeBlock({content}) {
    return(
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSlug]}
            components={{
                code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || "");
                    if (!inline && match) {
                        return (
                            <div className="code-block-wrapper">
                                <SyntaxHighlighter style={atomOneDark} language={match[1]} PreTag="pre">
                                    {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                            </div>
                        );
                    }
                    return (
                        <code className={className} {...props}>
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