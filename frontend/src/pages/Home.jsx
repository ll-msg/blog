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
        apiCall('GET', `${API_BASE}/logged`, null, null, "").then(data => {
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
            <div className="flex flex-col items-center sm:flex-row sm:items-start sm:justify-center gap-10 mt-20">
                <div class="bg-darkblue-300 text-white rounded-xl p-4 flex items-center gap-6 w-fit">
                    <div class="bg-darkblue-200 text-white px-8 py-6 rounded-xl text-5xl font-bold">
                        {curTime.hour}:{curTime.minute}:{curTime.second}
                    </div>
                    <div class="flex flex-col items-center leading-tight gap-2 font-mono">
                        <span class="text-md">{curTime.dayOfWeek}</span>
                        <span class="text-2xl font-semibold text-[#EBBD65]">{curTime.day}</span>
                        <span class="text-md">{curTime.month}</span>
                    </div>
                </div>
                <Moveclock />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12 px-4">
                {/*TODO: probably add icons*/}
                {categories && categories.map(c => <Card key={c.id} category={c} handleClick={gotoDir}/>)}
            </div>
            
            {(role == 'admin') && <button className="fixed bottom-6 right-6 w-12 h-12 text-xl font-bold rounded-full bg-black text-white hover:bg-bg transition" onClick={() => openModal()}> + </button>}
        </div>
    )
}