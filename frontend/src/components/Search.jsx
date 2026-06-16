import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Empty, List, Space, Typography } from 'antd';
import { apiCall, API_BASE } from './Helper';
import {
  brandClass,
  compactHeroTitleClass,
  emptyClass,
  heroCopyClass,
  listClass,
  pageClass,
} from '../styles';

const { Paragraph, Text, Title } = Typography;

function stripMarkdown(markdown) {
  return markdown
    .replace(/[#_*>\-\[\]()`]/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim();
}

function escapeRegex(input) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlight(text, keyword) {
  if (!keyword) return text;
  const regex = new RegExp(`(${escapeRegex(keyword)})`, 'gi');
  return text.replace(regex, "<mark class='bg-[#4df0ff] px-1 text-[#05080d]'>$1</mark>");
}

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [articles, setArticles] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoaded(false);
    apiCall('GET', `${API_BASE}/search?q=${encodeURIComponent(query)}`).then((data) => {
      setArticles(data || []);
      setLoaded(true);
    });
  }, [query]);

  return (
    <Space orientation="vertical" size={28} className={pageClass}>
      <section>
        <Title className={compactHeroTitleClass}>
          Results for "{query}"
        </Title>
      </section>

      {loaded && articles.length > 0 ? (
        <List
          className={listClass}
          dataSource={articles}
          renderItem={(article) => {
            const plainText = stripMarkdown(article.snippet || article.body || '');
            const highlighted = highlight(plainText, query);
            return (
              <List.Item className="cursor-pointer" onClick={() => navigate(`/article/${article.id}`)}>
                <List.Item.Meta
                  title={<div className="m-0 text-[1.125rem] font-semibold tracking-[-0.03em] text-[#eaffff]" dangerouslySetInnerHTML={{ __html: highlight(article.title, query) }} />}
                  description={<p className="mb-0 text-[#9fd8e6]" dangerouslySetInnerHTML={{ __html: highlighted }} />}
                />
              </List.Item>
            );
          }}
        />
      ) : loaded ? (
        <div className={emptyClass}>
          <Empty description="No matching posts yet." />
        </div>
      ) : (
        <Text type="secondary">Searching the blog...</Text>
      )}
    </Space>
  );
}
