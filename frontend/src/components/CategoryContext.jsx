import { createContext, useContext, useEffect, useState } from "react";
import { apiCall, API_BASE } from "./Helper";

const CategoryContext = createContext();

export function CategoryProvider({ children }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        async function loadAll() {
            // get categories
            const cats = await apiCall("GET", `${API_BASE}/categories`, null, null, "Cannot get categories");
            if (!cats) return;
            // get all directories
            const directories = await Promise.all(
                cats.map(async(c) => {
                    const dir = await apiCall("GET", `${API_BASE}/${c.id}/directory`, null, null, "Cannot get directories");
                    return {...c, articles: dir || []}
                })
            )
            setCategories(directories);
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
