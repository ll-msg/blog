import { apiCall, API_BASE } from "./Helper";
import { useEffect, useState } from 'react';
import ReactMarkdown from "react-markdown";
import { useNavigate } from 'react-router-dom';
import { FaEye } from "react-icons/fa";

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
        <div className="max-w-3xl mx-auto space-y-8">
            <header className="border-b border-neutral-300 pb-4 mt-10">
                <h2 className="text-3xl font-semibold tracking-tight">{article?.title}</h2>
            </header>
            <div className="flex items-center justify-between mt-2 text-sm text-neutral-500">
                <p>Last modified: {new Date(article?.created_at).toLocaleDateString()}</p>
                <span className="inline-flex items-center gap-1 text-sm text-neutral-500">{<FaEye />} {article?.views}</span>
            </div>
            {role === 'admin' && (<button className="px-4 py-1 border border-neutral-800 rounded-md text-sm hover:bg-neutral-900 hover:text-white transition" onClick={() => startUpdate()}> Update</button>)}
            {role === 'admin' && (<button className="px-4 py-1 border border-neutral-800 rounded-md text-sm hover:bg-red-600 hover:border-red-600 hover:text-white transition" onClick={() => startDelete()}> Delete</button>)}
            <article className="prose max-w-none text-neutral-800 leading-relaxed border-t border-neutral-200 pt-6">
                <ReactMarkdown>{article?.body}</ReactMarkdown>
            </article>
        </div>
    );
}