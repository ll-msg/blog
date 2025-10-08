import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiCall, API_BASE } from "./Helper";
import { useNavigate } from 'react-router-dom';

export default function Search() {
    const [searchParams] = useSearchParams();
    const input = searchParams.get("q");
    const [articles, setArticles] = useState([]);
    const [no, setNo] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        try{
            apiCall('GET', `${API_BASE}/search?q=${encodeURIComponent(input)}`).then(data => {
                console.log(data)
                if (data && data.length > 0) {
                    setArticles(data);
                } else {
                    setNo("Sorry there's nothing here yet :(");
                }
            });
        } catch(err) {
            console.log(err);
        }
    }, [])

    const openArticle = (id) => {
        navigate(`/article/${id}`)
    }
    
    return (
         <div className="min-h-screen bg-neutral-50 text-neutral-900 px-4 py-12">
            {articles && articles.map(a => (
                <div key={a.id} className="cursor-pointer border border-neutral-300 rounded-lg bg-white p-6 hover:border-black hover:shadow-sm transition" onClick={() => openArticle(a.id)}>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">{a.title}</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">{a.snippet}</p>
                </div>
            ))}
            {no &&  <p className="text-neutral-600 italic">{no}</p>}
        </div>
    )
}