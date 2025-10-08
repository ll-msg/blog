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
        <div className="min-h-[100dvh] bg-white text-neutral-900 px-6 py-10">
            <ul className="divide-y divide-neutral-200">
                {dir.map(d => <li className="cursor-pointer py-3 text-neutral-800 hover:text-black transition-colors" key={d.id} onClick={() => handleClick(d.id)}>
                    <span className="underline-offset-2 hover:underline">
                        {d.title}
                    </span>
                </li>)}
            </ul>
            {dir.length === 0 && (
                <p className="text-neutral-500 italic mt-4">
                    No articles found in this category.
                </p>
            )}
            {/*TODO: need auto fill category, think need restructure the route */}
            {(role == 'admin') && <button className="fixed bottom-6 right-6 w-12 h-12 text-xl font-bold rounded-full bg-black text-white hover:bg-neutral-800 transition" onClick={() => openModal()}> + </button>}
        </div>
    )
}