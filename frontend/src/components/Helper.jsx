export async function apiCall(method, url, data=null, headers = {}, setError = null, errMsg = null, auth=true) {
    const mergedHeaders = {
        'Content-Type': 'application/json',
        ...headers
    };
    const body = {
        method,
        headers: mergedHeaders,
        credentials: 'include'
    };

    if (data) {
        body.body = JSON.stringify(data);
    }
    try {
        const res = await fetch(url, body);
        if (!res.ok) {
            let errText = await res.text();
            try {
                const error = JSON.parse(errText);
                setError?.(error.error || errMsg); 
            } catch (err) {
                setError?.(errMsg || err);
            }
            return null;
        }
        const text = await res.text();
        return text ? JSON.parse(text) : {};
    } catch (err) {
        console.error("apiCall failed:", err);
        setError?.(errMsg || err.message);
        return null;
    }
}

export const API_BASE = import.meta.env.VITE_API_URL || "https://r-blog.onrender.com";