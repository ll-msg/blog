import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaSun, FaMoon, FaGithub } from "react-icons/fa";
import { apiCall, API_BASE } from "./Helper";

export default function Layout({children}) {
    const [dark, setDark] = useState(false);
    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);

    // light/night mode
    useEffect(() => {
        console.log("useEffect dark ran. dark=", dark);
        console.log("html.classList =", document.documentElement.classList.value);
        if (dark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [dark])

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
        <div className="bg-bg min-h-screen flex flex-col text-text">
            <header className="sticky top-0 z-40 border-b border-border bg-bg-soft/90 backdrop-blur-md">
                <div className="mx-auto max-w-5xl flex items-center justify-between h-16 px-6">
                    <nav className="flex items-center gap-8 text-sm text-text-soft">
                        <NavLink to='/' end className="hover:text-white">Home</NavLink>
                        <NavLink to='/about' className="hover:text-white">About</NavLink>
                    </nav>
                    <div className="ml-auto flex items-center gap-2">
                        {loggedIn && <img className="h-9 w-9 rounded-full object-cover border border-border" src={user.avatar} alt="header-avatar"/>}
                        {!loggedIn && <button className="flex items-center justify-center h-9 w-9 border border-border rounded-md hover:bg-bg-hover transition text-gray-200" onClick={() => handleLogin()}>{<FaGithub/>}</button>}
                        <button className="flex items-center justify-center h-9 w-9 border border-border rounded-md hover:bg-bg-hover transition text-gray-200" onClick={() => setDark(!dark)}> {dark ? <FaSun/> : <FaMoon/>} </button>
                    </div>
                </div>
            </header>
            <main>{children}</main>
        </div>
    )
}