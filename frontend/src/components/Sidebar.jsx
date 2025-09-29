import avatar from '../assets/avatar.jpg';
import { NavLink} from 'react-router-dom';

export default function Sidebar({open, onClose}){
    return (
        <aside className={`sidebar ${open ? 'is-open' : ''}`} aria-hidden={!open}>
            <div className='sidebar-header'>
                <button className="icon-btn" onClick={onClose}>×</button>
            </div>
            <div className="personal-info">
                <img className="avatar" src={avatar} alt="sidebar-avatar"/>
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/" end onClick={onClose}>Home</NavLink>
                <NavLink to="/about" onClick={onClose}>About</NavLink>
            </nav>
        </aside>
    )
}