import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaSearch, FaGithub, FaSun, FaMoon, FaEllipsisV, FaHome } from "react-icons/fa";
import { apiCall, API_BASE } from "./Helper";


export default function Layout({children}) {
    const navigate = useNavigate();
    const location = useLocation();
    const [dark, setDark] = useState(false);
    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [input, setInput] = useState("");
    const [mobileSearch, setMobileSearch] = useState(false);
    const [mobileActions, setMobileActions] = useState(false);


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
    const handleHome = () => {
        window.location.href = `/`;
    };

    // search
    const search = () => {
        navigate(`/search?q=${encodeURIComponent(input)}`);
    };

    // clear search
    useEffect(() => {
        if (location.pathname === '/' || location.pathname === '/about') {
            setInput(""); 
        }
    }, [location.pathname])

    return (
        <div className="bg-bg min-h-screen flex flex-col text-text">
            <header className="sticky top-0 z-40 border-b border-border bg-bg-soft/90 backdrop-blur-md">
                <div className="mx-auto max-w-5xl flex items-center justify-between h-16 px-4 sm:px-6">
                    <nav className="hidden lg:flex items-center gap-8 text-sm text-text-soft">
                        <NavLink to='/' end className="hover:text-white">Home</NavLink>
                        <NavLink to='/about' className="hover:text-white">About Me</NavLink>
                    </nav>
                    <div className="flex-1"></div>
                    <div className="flex items-center gap-2 border border-border rounded-lg bg-bg-soft px-4 py-1 shadow-sm w-60 lg:w-80 mr-5">
                        <input type="text" placeholder="e.g. Majority vote Algorithm..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => {if(e.key === "Enter") search()}}
                        className="flex-1 bg-transparent outline-none text-text placeholder:text-darkblue-400"/>
                        <button className="p-2 rounded-md hover:bg-bg transition" onClick={() => search()}><FaSearch /></button>
                    </div>
    
                    <div className="ml-auto flex items-center gap-2">
                        <button className="flex lg:hidden items-center justify-center h-8 w-8 sm:h-9 sm:w-9 border border-border rounded-md hover:bg-bg-hover transition text-gray-200"
                            onClick={() => setMobileActions(!mobileActions)}
                        >
                            <FaEllipsisV />
                        </button>
                        {loggedIn && <img className="hidden lg:flex h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover border border-border"  src={user.avatar} alt="header-avatar"/>}
                        {!loggedIn && <button className="hidden lg:flex flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 border border-border rounded-md hover:bg-bg-hover transition text-gray-200" onClick={() => handleLogin()}>{<FaGithub/>}</button>}
                        <button className="flex hidden lg:flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 border border-border rounded-md hover:bg-bg-hover transition text-gray-200" onClick={() => setDark(!dark)}> {dark ? <FaSun/> : <FaMoon/>} </button>
                    </div>
                </div>
            </header>
            {mobileActions && (
                <div className="sm:hidden border-t border-border bg-bg-soft px-6 py-3">
                    <div className="flex flex-col gap-2">
                        <button className="flex items-center gap-2 p-2 border border-border rounded-md hover:bg-bg-hover transition" onClick={() => { setMobileActions(false); handleHome(); }}>
                            <FaHome /> Home
                        </button>
                        {!loggedIn && (
                            <button className="flex items-center gap-2 p-2 border border-border rounded-md hover:bg-bg-hover transition" onClick={() => { setMobileActions(false); handleLogin(); }}>
                                <FaGithub /> Login with GitHub
                            </button>
                        )}

                        {loggedIn && (
                            <button className="flex items-center gap-2 p-2 border border-border rounded-md hover:bg-bg-hover transition"> <FaGithub /> Logged in </button>
                        )}

                        <button className="flex items-center gap-2 p-2 border border-border rounded-md hover:bg-bg-hover transition" onClick={() => { setDark(!dark); }}>
                            {dark ? <FaSun /> : <FaMoon />} 
                            {dark ? "Light Mode" : "Dark Mode"}
                        </button>
                    </div>
                </div>
            )}
            <main className="flex-1">{children}</main>
            <footer className="mt-14 py-4 text-center text-text-soft border-t border-border text-sm bg-bg-soft/90">
                © 2025 MyBlog • Built with React
            </footer>
        </div>
    )
}