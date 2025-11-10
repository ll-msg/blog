import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiCall, API_BASE } from "./Helper";
import { useNavigate } from 'react-router-dom';

function stripMarkdown(markdown) {
  return markdown
    .replace(/[#_*>\-\[\]()`]/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/\n+/g, " ")
    .trim();
}

function highlight(text, keyword) {
  if (!keyword) return text;
  const regex = new RegExp(`(${keyword})`, "gi");
  return text.replace(regex, "<strong class='text-white font-semibold'>$1</strong>");
}

export default function Search() {
    const [searchParams] = useSearchParams();
    const input = searchParams.get("q");
    const [articles, setArticles] = useState([]);
    const [no, setNo] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        try{
            apiCall('GET', `${API_BASE}/search?q=${encodeURIComponent(input)}`).then(data => {
                console.log("searching...")
                if (data && data.length > 0) {
                    setArticles(data);
                } else {
                    setArticles([]);
                    setNo("Sorry there's nothing here yet :(");
                }
            });
        } catch(err) {
            console.log(err);
        }
    }, [input])

    const openArticle = (id) => {
        navigate(`/article/${id}`)
    }
    
    return (
        <div className="min-h-screen bg-darkblue-50 text-darkblue-900 px-4 py-12">
            {articles && articles.length > 0 ? articles.map(a => {
                const plainText = stripMarkdown(a.snippet);
                const highlighted = highlight(plainText, input);
                return (
                    <div key={a.id} className="cursor-pointer border border-border rounded-lg bg-bg-soft p-6 hover:border-black hover:shadow-sm transition mb-4" onClick={() => openArticle(a.id)}>
                        <h3 className="text-lg font-semibold text-darkblue-600 mb-2" dangerouslySetInnerHTML={{ __html: highlight(a.title, input) }} />
                        <p className="text-sm text-darkblue-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: highlighted }} />
                    </div>
                );
            }) : (no && <div className="flex flex-col items-center justify-center mt-20 text-darkblue-500 italic">
                            <p className="text-darkblue-500 italic mt-4">
                                {no}
                            </p>
                        </div>)}
        </div>
    );
}