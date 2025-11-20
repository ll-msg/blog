export default function Sidebar({open, onClose, children}){

    return (
        <aside className={`fixed top-0 left-0 h-full w-95 bg-bg shadow-xl z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="flex justify-end p-4">
                <button className="icon-btn" onClick={onClose}>×</button>
            </div>
            <div className="px-6">
                {children}
            </div>
        </aside>
    )
}