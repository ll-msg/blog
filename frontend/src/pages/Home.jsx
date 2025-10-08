import { FaSearch } from 'react-icons/fa';
import Card from '../components/Card';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiCall, API_BASE } from '../components/Helper';

export default function Home() {
    const navigate = useNavigate();
    const [role, setRole] = useState('user');
    const [categories, setCategories] = useState(null);
    const [input, setInput] = useState("");

    useEffect(() => {
        console.log(API_BASE)
        apiCall('GET', `${API_BASE}/categories`).then(data => {
            if (data) setCategories(data);
        })
    }, []);

    const gotoDir = (dirId) => {
        navigate(`/content/${dirId}`)
    }

    // logged in page
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

    // search for content
    const search = () => {
        navigate(`/search?q=${encodeURIComponent(input)}`);
    };


    return (
        <div>
            <div className="flex flex-col items-center justify-center mt-16 mb-10 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Hello! Welcome to my little study space</h1>
                <div className="walk-dino"></div>
            </div>
            <div className="max-w-xl mx-auto flex items-center gap-2 border border-neutral-300 rounded-lg bg-white px-4 py-2 shadow-sm">
                <input type="text" placeholder="What are you looking for today?" value={input} onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent outline-none text-neutral-800 placeholder:text-neutral-400"/>
                <button className="p-2 border border-neutral-300 rounded-md hover:bg-neutral-100 transition" onClick={() => search()}><FaSearch /></button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12 px-4">
                {/*TODO: probably add icons*/}
                {categories && categories.map(c => <Card key={c.id} category={c} handleClick={gotoDir}/>)}
            </div>
            
            {(role == 'admin') && <button className="fixed bottom-6 right-6 w-12 h-12 text-xl font-bold rounded-full bg-black text-white hover:bg-neutral-800 transition" onClick={() => openModal()}> + </button>}
        </div>
    )
}