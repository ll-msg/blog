import { apiCall, API_BASE } from "./Helper";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye } from "react-icons/fa";
import CategorySideBar from "./CategorySideBar";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import CodeBlock from "./CodeBlock";
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse';
import { RiTranslateAi } from "react-icons/ri";

function generateToc(markdown) {
    if (!markdown) return [];

    const tree = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .parse(markdown);

    const toc = [];

    visit(tree, "heading", (node) => {
        if (node.depth >= 1 && node.depth <= 3) {
            const text = node.children
                .filter((c) => c.type === "text" || c.type === "inlineCode")
                .map((c) => c.value)
                .join("");

            const id = text
                .toLowerCase()
                .replace(/[^\w]+/g, "-")
                .replace(/(^-|-$)/g, "");

            toc.push({ id, value: text });
        }
    });

    return toc;
}

export default function Article() {
    const [article, setArticle] = useState(null);
    const [role, setRole] = useState('guest');
    const [open, setOpen] = useState(false);
    const [prev, setPrev] = useState(null);
    const [next, setNext] = useState(null);
    const [activeToc, setActiveToc] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const path = window.location.pathname;
        const id = path.split("/").pop();
        apiCall('GET', `${API_BASE}/article/${id}`).then(data => {
            if (data) setArticle(data);
        })
    }, [window.location.pathname]);

    // check logged in
    useEffect(() => {
        apiCall('GET', `${API_BASE}/logged`).then(data => {
            if (data) {
                setRole(data.role);
            }
        });
    }, []);

    const startUpdate = () => {
        navigate(`update`);
    }

    const startDelete = () => {
        //TODO: customized popup
        const path = window.location.pathname;
        const id = path.split("/").pop();
        try{
            apiCall('DELETE', `${API_BASE}/article/${id}` );
            alert("You successfully deleted this article!");
            navigate('/');
        } catch(err){
            alert(err);
        }
    }

    // find previous / next article
    useEffect(() => {
        setPrev(null)
        setNext(null)
        if (!article) return;
        apiCall("GET", `${API_BASE}/${article.category_id}/directory` )
        .then(list => {
            if (!list) return;
            const idx = list.findIndex(a => a.id === article.id);
            if (idx > 0) setPrev(list[idx - 1]);
            if (idx < list.length - 1) setNext(list[idx + 1]);
        });
    }, [article]);

    // get browser language
    const getTargetLang = () => {
        const lang = (navigator.language || "en").toLowerCase();  
        return lang.split("-")[0].toUpperCase();
    }

    // translate article
    const handleTranslate = async () => {
        let targetLang = getTargetLang();
        try{
            const response = await apiCall(
                'POST', 
                `${API_BASE}/translate`, 
                {
                    text: article.body,
                    target_lang: targetLang
                }
            )
            const translated = response?.translations?.[0]?.text;
            if (!translated) {
                alert("Translation failed.");
                return;
            } else {
                setArticle(prev => ({...prev, body: translated}));
            }
        } catch(err) {
            alert(err);
        }
    }

    return (
        <div>
            <button className="fixed top-3 left-3 sm:top-4 sm:left-4 z-50 bg-bg border border-border rounded-md px-3 py-1 shadow hover:bg-bg-hover" onClick={() => setOpen(true)}>
                ☰
            </button>
            <CategorySideBar open={open} onClose={() => setOpen(false)} article={article?.id}/>
            {open && (<div className="fixed inset-0 bg-bg-soft/40 z-40"/>)}
            
            <div className="flex flex-col lg:flex-row gap-10 mx-auto px-4 sm:px-0 max-w-7xl">
                <div className="flex-1 max-w-3xl mx-auto space-y-8 mb-20">
                    <header className="border-b border-border pb-4 mt-10">
                        <div className="flex flex-col sm:flex-row justify-between gap-2 mt-3 text-sm text-darkblue-800 mb-3">
                            {prev ? <button onClick={() => navigate(`/article/${prev.id}`)} className="hover:text-white cursor-pointer">← {prev.title}</button> : <span />}
                            {next ? <button onClick={() => navigate(`/article/${next.id}`)} className="hover:text-white cursor-pointer">{next.title} →</button> : <span />}
                        </div>

                        <div className="flex flex-row">
                            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{article?.title}</h2>
                            <button className="ml-auto flex items-center gap-1 text-xs sm:text-sm border border-border px-1.5 py-1 sm:px-3 sm:py-1.5 rounded hover:bg-bg-soft transition" onClick={handleTranslate}>
                                <RiTranslateAi /> Translate
                            </button>
                        </div>

                        {role === "admin" && (
                            <div className="flex items-center gap-2 mt-5 flex-wrap">
                                <button onClick={startUpdate} className="px-3 py-1.5 text-sm font-medium border border-border rounded-md text-text-soft hover:bg-bg-soft transition"> Edit </button>
                                <button 
                                    onClick={() => {
                                        if (window.confirm("Delete this article?")) startDelete();
                                    }}
                                    className="px-3 py-1.5 text-sm font-medium border border-red-400 text-red-600 rounded-md hover:bg-red-50 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </header>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mt-2 text-sm text-darkblue-500">
                        <p>Last modified: {new Date(article?.created_at).toLocaleDateString()}</p>
                        <span className="inline-flex items-center gap-1 text-sm text-darkblue-500">{<FaEye />} {article?.views}</span>
                    </div>

                    <article className="prose prose-sm sm:prose-base prose-darkblue max-w-none min-w-0">
                        <CodeBlock content={article?.body?.replace(/\\n/g, '\n')}/>
                    </article>
                </div>
                <aside className="hidden xl:block w-fit shrink-0 sticky top-24 h-max border-l border-border pl-6">
                    <h3 className="text-text text-sm font-semibold mb-3">On this page</h3>
                    <ul className="space-y-2 text-sm">
                        {generateToc(article?.body?.replace(/\\n/g, '\n')).map(item => (
                            <li key={item.id} className="ml-3">
                                <a href={`#${item.id}`} className={activeToc === `${item.id}` ? "text-[#EBBD65] font-semibold" : "text-text hover:text-white"}
                                    onClick={() => {setActiveToc(`${item.id}`)}}>{item.value}
                                </a>
                            </li>
                        ))}
                    </ul>
                </aside>
            </div>
        </div>
    );
}