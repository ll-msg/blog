import { apiCall, API_BASE } from "./Helper";
import { useEffect, useState } from 'react';
import ReactMarkdown from "react-markdown";
import { useNavigate } from 'react-router-dom';
import { FaEye } from "react-icons/fa";
import remarkGfm from 'remark-gfm'
import rehypeRaw from "rehype-raw";
import CategorySideBar from "./CategorySideBar";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

export default function Article() {
    const [article, setArticle] = useState(null);
    const [role, setRole] = useState('guest');
    const [open, setOpen] = useState(false);
    const [prev, setPrev] = useState(null);
    const [next, setNext] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const path = window.location.pathname;
        const id = path.split("/").pop();
        apiCall('GET', `${API_BASE}/article/${id}`, null, null, "").then(data => {
            if (data) setArticle(data);
        })
    }, [window.location.pathname]);

    // check logged in
    useEffect(() => {
        apiCall('GET', `${API_BASE}/logged`, null, null, "").then(data => {
            if (data) {
                setRole(data.role);
            }
        });
    }, []);

    const startUpdate = () => {
        navigate(`update`);
    }

    const startDelete = () => {
        //TODO: customized popup
        const path = window.location.pathname;
        const id = path.split("/").pop();
        try{
            apiCall('DELETE', `${API_BASE}/article/${id}`, null, null, "");
            alert("You successfully deleted this article!");
            navigate('/');
        } catch(err){
            alert(err);
        }
    }

    // find previous / next article
    useEffect(() => {
        setPrev(null)
        setNext(null)
        if (!article) return;
        apiCall("GET", `${API_BASE}/${article.category_id}/directory`, null, null, "")
        .then(list => {
            if (!list) return;
            const idx = list.findIndex(a => a.id === article.id);
            if (idx > 0) setPrev(list[idx - 1]);
            if (idx < list.length - 1) setNext(list[idx + 1]);
        });
    }, [article]);


    return (
        <div>
            <button className="fixed top-3 left-3 sm:top-4 sm:left-4 z-50 bg-bg border border-border rounded-md px-3 py-1 shadow hover:bg-bg-hover" onClick={() => setOpen(true)}>
                ☰
            </button>
            <CategorySideBar open={open} onClose={() => setOpen(false)} article={article?.id}/>
            {open && (<div className="fixed inset-0 bg-bg-soft/40 z-40"/>)}
            <div className="max-w-3xl mx-auto space-y-8 mb-20 px-4 sm:px-0">
                <header className="border-b border-border pb-4 mt-10">
                    <div className="flex flex-col sm:flex-row justify-between gap-2 mt-3 text-sm text-darkblue-800 mb-3">
                        {prev ? <button onClick={() => navigate(`/article/${prev.id}`)} className="hover:text-white cursor-pointer">← {prev.title}</button> : <span />}
                        {next ? <button onClick={() => navigate(`/article/${next.id}`)} className="hover:text-white cursor-pointer">{next.title} →</button> : <span />}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{article?.title}</h2>
                    {role === "admin" && (
                        <div className="flex items-center gap-2 mt-5 flex-wrap">
                            <button onClick={startUpdate} className="px-3 py-1.5 text-sm font-medium border border-border rounded-md text-text-soft hover:bg-bg-soft transition"> Edit </button>
                            <button 
                                onClick={() => {
                                    if (window.confirm("Delete this article?")) startDelete();
                                }}
                                className="px-3 py-1.5 text-sm font-medium border border-red-400 text-red-600 rounded-md hover:bg-red-50 transition"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </header>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mt-2 text-sm text-darkblue-500">
                    <p>Last modified: {new Date(article?.created_at).toLocaleDateString()}</p>
                    <span className="inline-flex items-center gap-1 text-sm text-darkblue-500">{<FaEye />} {article?.views}</span>
                </div>

                <article className="prose prose-sm sm:prose-base prose-darkblue max-w-none border-t border-darkblue-200 pt-4">
                    <ReactMarkdown 
                        remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}
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
                        {article?.body?.replace(/\\n/g, '\n')}
                    </ReactMarkdown>
                </article>
            </div>
        </div>
    );
}