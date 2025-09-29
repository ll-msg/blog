import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaSun, FaMoon, FaGithub } from "react-icons/fa";
import { apiCall } from './Helper';
import Sidebar from './Sidebar';

export default function Layout({children}) {
    const [light, setLight] = useState(false);
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);

    // light/night mode
    useEffect(() => {
        if (light) {
            document.body.classList.add("light");
        } else {
            document.body.classList.remove("light");
        }
    }, [light])

    // esc close side bar
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
      }, []);

    // github login
    // JWT token
    useEffect(() => {
        apiCall('GET', 'http://localhost:5000/logged', null, null, "").then(data => {
            if (data) {
                setUser(data);
                setLoggedIn(true);
            }
        });
    }, []);
    const handleLogin = () => {
        window.location.href = "http://localhost:5000/auth/github";
    };

    return (
        <div>
            <header className="header-row">
                <nav className="nav-bar">
                    <NavLink to='/' end>Home</NavLink>
                    <NavLink to='/about'>About</NavLink>
                    {loggedIn && <img className="header-avatar" src={user.avatar} alt="header-avatar"/>}
                    {!loggedIn && <button className='header-btn' onClick={() => handleLogin()}>{<FaGithub/>}</button>}
                    <button className='header-btn' onClick={() => setLight(!light)}> {light ? <FaMoon/> : <FaSun/>} </button>
                </nav>
            </header>
            <main>{children}</main>
        </div>
    )
}