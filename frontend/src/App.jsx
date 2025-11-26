import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx'
import Directory from './components/Directory.jsx';
import ArticleForm from './components/ArticleForm.jsx';
import Article from './components/Article.jsx';
import Update from './components/Update.jsx';
import Search from './components/Search.jsx';
import About from './pages/About.jsx';


export default function App(){
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/content/:dirId" element={<Directory/>}/>
        <Route path="/content/create" element={<ArticleForm mode="create"/>}/>
        <Route path="article/:articleId/update" element={<Update/>}/>
        <Route path="article/:articleId" element={<Article/>}/>
        <Route path="/search" element={<Search />} />
      </Routes>
    </Layout>
  );
}
