import { FaSearch } from 'react-icons/fa';
import Card from '../components/Card';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiCall } from '../components/Helper';

export default function Home() {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);
    //TODO: need automatic retrieve catoegory
    const categories = [
        { id: 1, name: 'AI', description: '总之这是一个测试例子我已经尽可能写长一点了总之它是用来测试description长度的' }, 
        { id: 2, name: 'UI/UX', description: 'JS learning' },
        { id: 3, name: 'Media Player', description: ''},
        { id: 4, name: 'Secret', description: ''}
    ];

    const gotoDir = (dirId) => {
        navigate(`/content/${dirId}`)
    }

    // logged in page
    useEffect(() => {
        apiCall('GET', 'http://localhost:5000/logged', null, null, "").then(data => {
            if (data) {
                setLoggedIn(true);
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
                {categories.map(c => <Card key={c.id} category={c} handleClick={gotoDir}/>)}
            </div>
            {loggedIn && <button className='quick-ball' onClick={() => openModal()}> + </button>}
        </div>
    )
}