import { FaSearch } from 'react-icons/fa';
import Card from '../components/Card';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiCall } from '../components/Helper';

export default function Home() {
    const navigate = useNavigate();
    const [role, setRole] = useState('user');
    const [categories, setCategories] = useState(null);

    useEffect(() => {
    apiCall('GET', 'http://localhost:5000/categories').then(data => {
        if (data) setCategories(data);
    })
    }, []);

    const gotoDir = (dirId) => {
        navigate(`/content/${dirId}`)
    }

    // logged in page
    useEffect(() => {
        apiCall('GET', 'http://localhost:5000/logged', null, null, "").then(data => {
            if (data) {
                setRole(data.role);
            }
        });
    }, []);

    const openModal = () => {
        navigate(`/content/create`)
    }

    return (
        <div>
            <div className='welcome-msg'>
                <h1>Hello! Welcome to my little study space</h1>
                <div className="walk-dino"></div>
            </div>
            <div className="search-bar">
                <input type="text" placeholder="What are you looking for today?"/>
                <button className="header-btn"><FaSearch /></button>
            </div>
            <div className="cards">
                {/*TODO: probably add icons*/}
                {categories && categories.map(c => <Card key={c.id} category={c} handleClick={gotoDir}/>)}
            </div>
            {(role == 'admin') && <button className='quick-ball' onClick={() => openModal()}> + </button>}
        </div>
    )
}