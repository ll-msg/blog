import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from './Helper';

export default function Directory() {
    const navigate = useNavigate();
    const [dir, setDir] = useState([]);
    const [role, setRole] = useState('user');

    useEffect(() => {
        const path = window.location.pathname;
        const id = path.split("/").pop();
        apiCall('GET', `http://localhost:5000/${id}/directory`, null, null, "").then(data => {
            if (data) setDir(data);
        })
    }, []);

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

    const handleClick = (tableId) => {
        navigate(`/article/${tableId}`)
    }
    return (
        <div className="tableContent">
            <ul>
                {dir.map(d => <li key={d.id} onClick={() => handleClick(d.id)}>{d.title}</li>)}
            </ul>
            {/*TODO: need auto fill category, think need restructure the route */}
            {(role == 'admin') && <button className='quick-ball' onClick={() => openModal()}> + </button>}
        </div>
    )
}