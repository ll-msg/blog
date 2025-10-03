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
            <div className='welcome-msg'>
                <h1>Hello! Welcome to my little study space</h1>
                <div className="walk-dino"></div>
            </div>
            <div className="search-bar">
                <input type="text" placeholder="What are you looking for today?" value={input} onChange={(e) => setInput(e.target.value)}/>
                <button className="header-btn" onClick={() => search()}><FaSearch /></button>
            </div>
            <div className="cards">
                {/*TODO: probably add icons*/}
                {categories && categories.map(c => <Card key={c.id} category={c} handleClick={gotoDir}/>)}
            </div>
            <iframe data-testid="embed-iframe" className="spotify-player" style={{borderRadius:"12px"}} src="https://open.spotify.com/embed/playlist/471GHyuVhCTgR5q928kw4o?utm_source=generator" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            {(role == 'admin') && <button className='quick-ball' onClick={() => openModal()}> + </button>}
        </div>
    )
}