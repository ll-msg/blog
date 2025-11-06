import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiCall, API_BASE } from "./Helper";

export default function Sidebar({open, onClose, categoryId}){
    const navigate = useNavigate();

    // get directory
    const [dir, setDir] = useState([]);
    useEffect(() => {
        if (!categoryId) return;
        apiCall('GET', `${API_BASE}/${categoryId}/directory`, null, null, "")
            .then(data => { 
                if (data) setDir(data); 
            });
    }, [categoryId]);

    const jumpArticle = (item_id) => {
        onClose();
        navigate(`/article/${item.id}`);
    }

    return (
        <aside className={`fixed top-0 left-0 h-full w-64 bg-bg shadow-xl z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="flex justify-end p-4">
                <button className="icon-btn" onClick={onClose}>×</button>
            </div>
            <div className="personal-info">
            </div>
            <nav className="flex flex-col space-y-3 px-6">
                {dir.map(item =>
                    <button key={item.id} className="text-left text-text hover:text-white" onClick={() => jumpArticle(item.id)}>
                        {item.title}
                    </button>
                )}
            </nav>
        </aside>
    )
}