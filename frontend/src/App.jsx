import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx'
import Directory from './components/Directory.jsx';
import ArticleForm from './components/ArticleForm.jsx';


export default function App(){
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/content/:dirId" element={<Directory/>}/>
        <Route path="/content/create" element={<ArticleForm/>}/>
      </Routes>
    </Layout>
  );
}
