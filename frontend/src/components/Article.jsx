import { apiCall, API_BASE } from "./Helper";
import { useEffect, useState } from 'react';
import ReactMarkdown from "react-markdown";
import { useNavigate } from 'react-router-dom';
import { FaEye } from "react-icons/fa";
import remarkGfm from 'remark-gfm'
import rehypeRaw from "rehype-raw";
import Sidebar from './Sidebar';

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
            <button className="fixed top-4 left-4 z-50 bg-bg border border-border rounded-md px-3 py-1 shadow hover:bg-darkblue-400" onClick={() => setOpen(true)}>
                ☰
            </button>
            <Sidebar open={open} onClose={() => setOpen(false)} categoryId={article?.category_id}/>
            {open && (<div className="fixed inset-0 bg-bg-soft/40 z-40"/>)}
            <div className="max-w-3xl mx-auto space-y-8 mb-20">
                <header className="border-b border-border pb-4 mt-10">
                    <h2 className="text-3xl font-semibold tracking-tight">{article?.title}</h2>
                    <div className="flex justify-between mt-3 text-sm text-darkblue-400">
                        {prev ? <button onClick={() => navigate(`/article/${prev.id}`)} className="hover:text-white cursor-pointer">← {prev.title}</button> : <span />}
                        {next ? <button onClick={() => navigate(`/article/${next.id}`)} className="hover:text-white cursor-pointer">{next.title} →</button> : <span />}
                    </div>
                    {role === "admin" && (
                        <div className="flex items-center gap-2 mt-5">
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
                <div className="flex items-center justify-between mt-2 text-sm text-darkblue-500">
                    <p>Last modified: {new Date(article?.created_at).toLocaleDateString()}</p>
                    <span className="inline-flex items-center gap-1 text-sm text-darkblue-500">{<FaEye />} {article?.views}</span>
                </div>
                <article className="prose prose-darkblue max-w-none border-t border-darkblue-200 pt-4">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                        {article?.body?.replace(/\\n/g, '\n')}
                    </ReactMarkdown>
                </article>
            </div>
        </div>
    );
}