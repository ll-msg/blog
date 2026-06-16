import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Collapse, Empty, Space, Typography } from 'antd';
import { useCategories } from './CategoryContext';
import { pageClass } from '../styles';

const { Text } = Typography;

export default function CategorySideBar({ article, onNavigate }) {
  const { categories } = useCategories();
  const navigate = useNavigate();
  const [activeKeys, setActiveKeys] = useState([]);

  useEffect(() => {
    if (!article || categories.length === 0) return;

    for (const category of categories) {
      if (category.articles.some((entry) => entry.id === article)) {
        setActiveKeys((prev) => (prev.includes(String(category.id)) ? prev : [...prev, String(category.id)]));
        break;
      }
    }
  }, [article, categories]);

  if (categories.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No categories yet" />;
  }

  return (
    <Collapse
      ghost
      activeKey={activeKeys}
      onChange={(keys) => setActiveKeys(Array.isArray(keys) ? keys : [keys])}
      items={categories.map((category) => ({
        key: String(category.id),
        label: <Text strong>{category.name}</Text>,
        children: (
          <Space orientation="vertical" size={8} className={pageClass}>
            {category.articles.map((entry) => {
              const active = entry.id === article;
              return (
                <a
                  key={entry.id}
                  href={`#/article/${entry.id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    navigate(`/article/${entry.id}`);
                    onNavigate?.();
                  }}
                  className={`${active ? 'font-bold text-[#4df0ff]' : 'font-normal text-[#9fd8e6]'} no-underline transition-colors hover:text-[#4df0ff]`}
                >
                  {entry.title}
                </a>
              );
            })}
          </Space>
        ),
      }))}
    />
  );
}
