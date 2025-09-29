import { apiCall } from './Helper';
import { useEffect, useState } from 'react';
import ReactMarkdown from "react-markdown";
import { useNavigate } from 'react-router-dom';

export default function Article() {
    const [article, setArticle] = useState(null);
    const [role, setRole] = useState('user');
    const navigate = useNavigate();

    useEffect(() => {
        const path = window.location.pathname;
        const id = path.split("/").pop();
        apiCall('GET', `http://localhost:5000/article/${id}`, null, null, "").then(data => {
            if (data) setArticle(data);
        })
    }, []);

    // check logged in
    useEffect(() => {
        apiCall('GET', 'http://localhost:5000/logged', null, null, "").then(data => {
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
            apiCall('DELETE', `http://localhost:5000/article/${id}`, null, null, "");
            alert("You successfully deleted this article!");
            navigate('/');
        } catch(err){
            alert(err);
        }
    }

    return (
        <div className="article-container">
            <div className="article-header">
                <h2>{article?.title}</h2>
                {role === 'admin' && (<button className="update-btn" onClick={() => startUpdate()}> Update</button>)}
                {role === 'admin' && (<button className="delete-btn" onClick={() => startDelete()}> Delete</button>)}
            </div>
            <div className="article-meta">
                <p>{new Date(article?.created_at).toLocaleDateString()}</p>
            </div>
            <div className="markdown-body">
                <ReactMarkdown>{article?.body}</ReactMarkdown>
            </div>
            <div className="article-views">👁 {article?.views}</div>
        </div>
    );
}