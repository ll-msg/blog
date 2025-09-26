import { useNavigate } from 'react-router-dom';

export default function Directory() {
    const navigate = useNavigate();
    
    const tableContent = [
        { id: 1, name: "What is Next.js?"},
        { id: 2, name: "What is this one?"}
    ]

    const handleClick = (tableId) => {
        navigate(`article/${tableId}`)
    }
    return (
        <div className="tableContent">
            <ul>
                {tableContent.map(t => <li key={t.id} onClick={() => handleClick(t.id)}>{t.name}</li>)}
            </ul>
        </div>
    )
}