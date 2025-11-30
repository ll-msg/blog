import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall, API_BASE } from "./Helper";

export default function Directory() {
    const navigate = useNavigate();
    const [dir, setDir] = useState([]);
    const [role, setRole] = useState('user');
    

    useEffect(() => {
        const path = window.location.pathname;
        const id = path.split("/").pop();
        apiCall('GET', `${API_BASE}/${id}/directory`, null, null, "").then(data => {
            if (data) setDir(data);
        })
    }, []);

    useEffect(() => {
        apiCall('GET', `${API_BASE}/logged`, null, null, "").then(data => {
            if (data) {
                setRole(data.role);
            }
        });
    }, []);

    const openModal = () => {
        navigate(`/content/create`)
    }

    const handleClick = (tableId) => {
        navigate(`/article/${tableId}`)
    }
    return (
        <div className="min-h-[100dvh] bg-bg text-darkblue-900 px-6 py-10">
            <div className="max-w-5xl mx-auto">
                <ul className="divide-y divide-darkblue-200">
                    {dir.map(d => <li className="cursor-pointer py-3 text-text hover:text-white transition-colors" key={d.id} onClick={() => handleClick(d.id)}>
                        <span className="underline-offset-2 hover:underline">
                            {d.title}
                        </span>
                    </li>)}
                </ul>
                {dir.length === 0 && (
                    <div className="flex flex-col items-center justify-center mt-20 text-darkblue-500 italic">
                        <p className="text-darkblue-500 italic mt-4">
                            No articles found in this category.
                        </p>
                    </div>
                )}
                {(role == 'admin') && <button className="fixed bottom-6 right-6 w-12 h-12 text-xl font-bold rounded-full bg-black text-white hover:bg-darkblue-800 transition" onClick={() => openModal()}> + </button>}
            </div>
        </div>
    )
}