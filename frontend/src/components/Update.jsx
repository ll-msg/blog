import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiCall } from "./Helper";
import ArticleForm from "./ArticleForm";

export default function Update() {
    const {articleId, dirId} = useParams();
    const [article, setArticle] = useState(null);

    useEffect(() => {
        apiCall("GET", `http://localhost:5000/article/${articleId}`, null, null, "")
        .then(data => setArticle(data));
    }, [articleId]);

    if (!article) return;

    return <ArticleForm mode="update" article={article} />
}   