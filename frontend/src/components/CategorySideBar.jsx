import Sidebar from "./Sidebar";
import { useCategories } from "./CategoryContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { AiOutlineRight } from "react-icons/ai";

export default function CategorySideBar({open, onClose, article}){
    const { categories } = useCategories();
    const navigate = useNavigate();
    const curAid = article;
    const [openCategoryIds, setOpenCategoryIds] = useState([]);

    // highlight current article
    useEffect(() => {
        if (!curAid || categories.length === 0) return;

        for (const cat of categories) {
            if (cat.articles.some(a => a.id === curAid)) {
                setOpenCategoryIds(prev => prev.includes(cat.id) ? prev : [...prev, cat.id])
                break;
            }
        }
    }, [curAid, categories]);

    return(
        <Sidebar open={open} onClose={onClose}>
            <div className="space-y-5">
                {categories.map(c => {
                    const isOpen = openCategoryIds.includes(c.id);
                    return (
                        <div key={c.id} className="space-y-2">
                            <button
                                onClick={() => setOpenCategoryIds(prev => prev.includes(c.id) ? prev.filter(id => id !== c.id) : [...prev, c.id])}
                                className="w-full text-left text-sm font-semibold text-text-soft border-b border-border pb-1 hover:text-white transition"
                            >   
                                <span className="flex items-center whitespace-nowrap overflow-hidden text-ellipsis text-sm">
                                    {c.name}
                                    <AiOutlineRight
                                        className={`ml-auto transform transition-transform duration-300 ${
                                            isOpen ? "rotate-90" : ""
                                        }`}
                                        size={15}
                                    />
                                </span>
                                
                            </button>

                            {isOpen && (
                                <div className="ml-2 flex flex-col space-y-1.5">
                                    {c.articles.map(a => {
                                        const active = a.id === curAid;
                                        return (
                                            <button key={a.id} 
                                                className={`text-left text-sm rounded px-2 py-1 transition-all ${active ? "bg-darkblue-500/40 text-white font-medium" : "text-text hover:text-white hover:bg-darkblue-500/20"}`}
                                                onClick={() => {onClose(); navigate(`/article/${a.id}`);
                                            }}>
                                                {a.title}
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </Sidebar>
    )
}