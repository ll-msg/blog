import Card from '../components/Card';
import Clock from "../components/clock";
import { useEffect, useState } from 'react';
import { apiCall, API_BASE } from '../components/Helper';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();
    const [role, setRole] = useState('guest');
    const [categories, setCategories] = useState(null);
    const [curTime, setCurTime] = useState({});

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
            month: now.getMonth() + 1,
            day: String(now.getDate()).padStart(2, '0'),
            dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' }),
            hour: now.getHours(),
            minute: now.getMinutes(),
            second: now.getSeconds(),
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
        <div className="bg-bg min-h-screen text-text">
            <div className="flex flex-col items-center sm:flex-row sm:items-start sm:justify-center gap-10 mt-20">
                <pre className="text-left text-[15px]">
{`const currentTime = {
  year: ${curTime.year},
  month: ${curTime.month},
  day: ${curTime.day},
  dayOfWeek: "${curTime.dayOfWeek}",
  hour: ${curTime.hour},
  minute: ${curTime.minute},
  second: ${curTime.second},
  dayProgress: ${curTime.dayProgress}
};`}
                </pre>
                <Clock />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12 px-4">
                {/*TODO: probably add icons*/}
                {categories && categories.map(c => <Card key={c.id} category={c} handleClick={gotoDir}/>)}
            </div>
            
            {(role == 'admin') && <button className="fixed bottom-6 right-6 w-12 h-12 text-xl font-bold rounded-full bg-black text-white hover:bg-bg transition" onClick={() => openModal()}> + </button>}
        </div>
    )
}