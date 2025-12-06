import Card from '../components/Card';
import Moveclock from "../components/Moveclock";
import { useEffect, useState } from 'react';
import { apiCall, API_BASE } from '../components/Helper';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();
    const [role, setRole] = useState('guest');
    const [categories, setCategories] = useState(null);
    const [curTime, setCurTime] = useState({});
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

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
        apiCall('GET', `${API_BASE}/logged` ).then(data => {
            if (data) {
                setRole(data.role);
            }
        });
    }, []);

    const openModal = () => {
        navigate(`/content/create`)
    }

    const updateTime = () => {
        const now = new Date();
        // progress
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const total = 24 * 60 * 60 * 1000;
        const progress = ((now - start) / total * 100).toFixed(2);

        const currentTime = {
            year: now.getFullYear(),
            month: months[now.getMonth()],
            day: String(now.getDate()).padStart(2, '0'),
            dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' }),
            hour: String(now.getHours()).padStart(2, '0'),
            minute: String(now.getMinutes()).padStart(2, '0'),
            second: String(now.getSeconds()).padStart(2, '0'),
            dayProgress: progress + "%"
        }
        setCurTime(currentTime);
    }

    useEffect(() => {
        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, [])

    return (
        <div className="bg-bg text-text">
            <div className="flex flex-col items-center sm:flex-row sm:items-start sm:justify-center gap-6 sm:gap-10 mt-10 sm:mt-20 px-4">
                <div className="bg-bg-soft text-text rounded-xl p-4 flex items-center gap-4 sm:gap-6 w-fit">
                    <div className="bg-bg-hover text-text px-6 sm:px-8 py-4 sm:py-6 rounded-xl text-4xl sm:text-5xl font-bold">
                        {curTime.hour}:{curTime.minute}:{curTime.second}
                    </div>
                    <div className="flex flex-col items-center leading-tight gap-1 sm:gap-2 font-mono text-sm sm:text-base">
                        <span className="text-md">{curTime.dayOfWeek}</span>
                        <span className="text-2xl font-semibold text-[#EBBD65]">{curTime.day}</span>
                        <span className="text-md">{curTime.month}</span>
                    </div>
                </div>
                <Moveclock />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12 px-4">
                {/*TODO: probably add icons*/}
                {!categories && [...Array(5)].map((_, i) => (<div key={i} className="animate-pulse h-32 bg-bg-soft rounded-xl"/>))}
                {categories && categories.map(c => <Card key={c.id} category={c} handleClick={gotoDir}/>)}
            </div>
            
            {(role == 'admin') && <button className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 text-lg sm:text-xl font-bold rounded-full bg-black text-white hover:bg-bg transition" onClick={() => openModal()}> + </button>}
        </div>
    )
}