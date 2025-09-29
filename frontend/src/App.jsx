import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx'
import Directory from './components/Directory.jsx';
import ArticleForm from './components/ArticleForm.jsx';
import Article from './components/Article.jsx';
import Update from './components/Update.jsx';


export default function App(){
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/content/:dirId" element={<Directory/>}/>
        <Route path="/content/create" element={<ArticleForm mode="create"/>}/>
        <Route path="/content/:dirId/article/:articleId/update" element={<Update/>}/>
        <Route path="/content/:dirId/article/:articleId" element={<Article/>}/>
      </Routes>
    </Layout>
  );
}
