import { apiCall, API_BASE } from "./Helper";
import { useEffect, useState } from 'react';
import ReactMarkdown from "react-markdown";
import { useNavigate } from 'react-router-dom';
import { FaEye } from "react-icons/fa";
import remarkGfm from 'remark-gfm'
import rehypeRaw from "rehype-raw";

export default function Article() {
    const [article, setArticle] = useState(null);
    const [role, setRole] = useState('guest');
    const navigate = useNavigate();

    useEffect(() => {
        const path = window.location.pathname;
        const id = path.split("/").pop();
        apiCall('GET', `${API_BASE}/article/${id}`, null, null, "").then(data => {
            if (data) setArticle(data);
        })
    }, []);

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
        //TODO: alert("Are you sure you want to delete this article? It's currently irreversible.") => change to customized popup
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

    return (
        <div className="max-w-3xl mx-auto space-y-8 mb-20">
            <header className="border-b border-border pb-4 mt-10">
                <h2 className="text-3xl font-semibold tracking-tight">{article?.title}</h2>
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
    );
}