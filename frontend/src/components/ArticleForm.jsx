import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { apiCall, API_BASE } from "./Helper";
import { useNavigate } from 'react-router-dom';
import remarkGfm from 'remark-gfm'
import rehypeRaw from "rehype-raw";


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
    <div className="max-w-3xl mx-auto space-y-6 mb-20">

      <h2 className="text-2xl font-semibold border-b border-border pb-3 mt-10">
        {mode === "create" ? "Create Article" : "Update Article"}
      </h2>
      
      <label className="block text-sm font-medium text-text-softmb-2"> Select Field</label>
      <select  className="w-full border-b border-border bg-transparent outline-none py-2 text-text focus:border-black" value={categoryName} onChange={(e) => setCategoryName(e.target.value)}>
          <option value="">--Please choose a field--</option>
          {categories && categories.map(c => (<option key={c.id}>{c.name}</option>))}
      </select>

      <label className="block text-sm font-medium text-text-softmb-2">Title</label>
      <input type="text" className="w-full border-b border-border bg-transparent outline-none py-1 text-darkblue-00 focus:border-black" id="create-title" value={title} onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter your article title"
      />

      <label className="block text-sm font-medium text-text-softmb-2">Content</label>
      <textarea className="w-full min-h-[200px] border-b border-border bg-transparent outline-none py-2 text-text resize-y focus:border-black" id="create-markdown-input" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Put your article here in markdown format"/>
      
      <h2 className="text-sm font-medium text-text-softmb-2">Preview</h2>
      <div className="prose max-w-none border-t border-darkblue-200 pt-4 text-text">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {content}
        </ReactMarkdown>
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-2 border border-darkblue-800 text-darkblue-900 rounded-md hover:bg-darkblue-900 hover:text-white transition" onClick={onSubmit}>{mode === "create" ? "Upload" : "Update"}</button>
      </div>
    </div>
  );
}
