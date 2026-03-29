import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Skeleton } from 'antd';
import { apiCall, API_BASE } from './Helper';
import ArticleForm from './ArticleForm';

export default function Update() {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    apiCall('GET', `${API_BASE}/article/${articleId}`).then((data) => setArticle(data));
  }, [articleId]);

  if (!article) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  return <ArticleForm mode="update" article={article} />;
}
