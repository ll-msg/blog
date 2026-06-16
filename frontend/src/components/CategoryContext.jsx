import { createContext, useContext, useEffect, useState } from "react";
import { apiCall, API_BASE } from "./Helper";

const CategoryContext = createContext();

export function CategoryProvider({ children }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        async function loadAll() {
            // get categories with directories
            const cats = await apiCall("GET", `${API_BASE}/categories/directories`, null, null, "Cannot get categories");
            if (!cats) return;
            setCategories(cats);
        }
        loadAll();
    }, []);

    return (
        <CategoryContext.Provider value={{ categories }}>
            {children}
        </CategoryContext.Provider>
    );
}

export function useCategories() {
    return useContext(CategoryContext);
}
