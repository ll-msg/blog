import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { apiCall, API_BASE } from "./Helper";
import { useNavigate } from 'react-router-dom';


export default function ArticleForm({ mode = "create", article = null }) {
  const [title, setTitle] = useState(article?.title || "");
  const [content, setContent] = useState(article?.body || "");
  const [categoryName, setCategoryName] = useState(article?.categoryName || "");
  const [categories, setCategories] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiCall('GET', `${API_BASE}/categories`).then(data => {
      if (data) setCategories(data);
    })
  }, []);
 
  const onSubmit = async() => {
    /**
     * 2. upload to database
     * 3. alert uploaded successful
     */
    if (!title || !content || !categoryName) {
      alert("Please fill in all the fields");
      return;
    }
    
    if (mode === "create") {
      try{
          await apiCall("POST", `${API_BASE}/article/create`, {
          title,
          content,
          userId: 1,
          createdAt: new Date().toISOString(),
          categoryName
        });
        alert("Your article has been successfully uploaded!");
        navigate('/');
      } catch(err) {
        alert(err);
        return;
      }
    } else if (mode === "update") {
      try{
          await apiCall("PUT", `${API_BASE}/article/${article.id}`, {
          title,
          content,
          categoryName
        });
        alert("Your article has been successfully updated!");
        navigate('/');
      } catch (err) {
        alert(err);
        return;
      }
    }
  }

  //TODO: need automatic retrieve catoegory
  return (
    <div className="modal-content">

      <h2>{mode === "create" ? "Create Article" : "Update Article"}</h2>
      
      <h2>Select Field</h2>
      <select className="modal-select" value={categoryName} onChange={(e) => setCategoryName(e.target.value)}>
          <option value="">--Please choose a field--</option>
          {categories && categories.map(c => (<option key={c.id}>{c.name}</option>))}
      </select>

      <h2>Title</h2>
      <textarea className="markdown-input small" id="create-title" value={title} onChange={(e) => setTitle(e.target.value)}></textarea>
      
      <h2>Content</h2>
      <textarea className="markdown-input" id="create-markdown-input" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Put your article here in markdown format"/>
      
      <h2>Preview</h2>
      <div className="markdown-preview">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>

      <div className="modal-actions">
        <button onClick={onSubmit}>{mode === "create" ? "Upload" : "Update"}</button>
      </div>
    </div>
  );
}
