import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { apiCall } from "./Helper";

export default function ArticleForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryName, setCategoryName] = useState("");

  const onSubmit = async() => {
    /**
     * 2. upload to database
     * 3. alert uploaded successful
     */
    if (!title || !content || !categoryName) {
      alert("Please fill in all the fields");
      return;
    }
    
    const res = await apiCall('POST', 'http://localhost:5000/article/create', {
        title,
        content, 
        userId: 1,
        createdAt: new Date().toISOString(),
        categoryName
    }, null, null);
    if (res) {
        alert("Your article has been successfully uploaded!");
    } else {
        alert("error")
    }
  }

  //TODO: need automatic retrieve catoegory
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        
        <h2>Select Field</h2>
        {/*TODO: category id/user id */}
        <select className="modal-select" value={categoryName} onChange={(e) => setCategoryName(e.target.value)}>
            <option value="">--Please choose a field--</option>
            <option value="AI">AI</option>
            <option value="UI/UX">UI/UX</option>
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
          <button onClick={() => onSubmit()}>Upload</button>
        </div>
      </div>
    </div>
  );
}
