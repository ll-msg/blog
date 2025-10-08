import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaSun, FaMoon, FaGithub } from "react-icons/fa";
import { apiCall, API_BASE } from "./Helper";
import Sidebar from './Sidebar';

export default function Layout({children}) {
    const [light, setLight] = useState(false);
    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);

    // light/night mode
    useEffect(() => {
        if (light) {
            document.body.classList.add("light");
        } else {
            document.body.classList.remove("light");
        }
    }, [light])

    // github login
    // JWT token
    useEffect(() => {
        apiCall('GET', `${API_BASE}/logged`, null, null, "").then(data => {
            if (data && data.role != 'guest') {
                setLoggedIn(true);
                setUser(data);
            }
        });
    }, []);
    const handleLogin = () => {
        window.location.href = `${API_BASE}/auth/github`;
    };

    return (
        <div>
            <header className="sticky top-0 z-40 border-b border-neutral-300 bg-white/90 backdrop-blur-md">
                <div className="mx-auto max-w-5xl flex items-center justify-between h-16 px-6">
                    <nav className="flex items-center gap-8 text-sm text-neutral-700">
                        <NavLink to='/' end className="hover:text-black">Home</NavLink>
                        <NavLink to='/about' className="hover:text-black">About</NavLink>
                    </nav>
                    <div className="ml-auto flex items-center gap-2">
                        {loggedIn && <img className="h-9 w-9 rounded-full object-cover border border-neutral-300" src={user.avatar} alt="header-avatar"/>}
                        {!loggedIn && <button className="flex items-center justify-center h-9 w-9 border border-neutral-300 rounded-md hover:bg-neutral-100 transition" onClick={() => handleLogin()}>{<FaGithub/>}</button>}
                        <button className="flex items-center justify-center h-9 w-9 border border-neutral-300 rounded-md hover:bg-neutral-100 transition" onClick={() => setLight(!light)}> {light ? <FaMoon/> : <FaSun/>} </button>
                    </div>
                </div>
            </header>
            <main>{children}</main>
        </div>
    )
}