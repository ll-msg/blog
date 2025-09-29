import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiCall } from "./Helper";
import { useNavigate } from 'react-router-dom';

export default function Search() {
    const [searchParams] = useSearchParams();
    const input = searchParams.get("q");
    const [articles, setArticles] = useState([]);
    const [no, setNo] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        try{
            apiCall('GET', `http://localhost:5000/search?q=${encodeURIComponent(input)}`).then(data => {
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
        <div className="search-result">
            {articles && articles.map(a => (
                <div key={a.id} className="search-card" onClick={() => openArticle(a.id)}>
                    <h3>{a.title}</h3>
                    <p>{a.snippet}</p>
                </div>
            ))}
            {no && <p>{no}</p>}
        </div>
    )
}