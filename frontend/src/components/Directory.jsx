import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Empty, FloatButton, List, Skeleton, Space, Typography } from 'antd';
import { FaChevronRight, FaPlus } from 'react-icons/fa';
import { apiCall, API_BASE } from './Helper';
import { useCategories } from './CategoryContext';
import {
  compactHeroTitleClass,
  emptyClass,
  listClass,
  pageClass,
} from '../styles';

const { Text, Title } = Typography;

export default function Directory() {
  const navigate = useNavigate();
  const [dir, setDir] = useState(null);
  const [role, setRole] = useState('user');
  const { categories } = useCategories();
  const path = window.location.pathname;
  const categoryId = Number(path.split('/').pop());
  const categoryName = categories.find((category) => category.id === categoryId)?.name;

  useEffect(() => {
    apiCall('GET', `${API_BASE}/${categoryId}/directory`).then((data) => {
      setDir(data || []);
    });
  }, [categoryId]);

  useEffect(() => {
    apiCall('GET', `${API_BASE}/logged`).then((data) => {
      if (data) {
        setRole(data.role);
      }
    });
  }, []);

  return (
    <Space orientation="vertical" size={28} className={pageClass}>
      <section>
        <Title className={compactHeroTitleClass}>
          Articles in {categoryName ? `"${categoryName}"` : 'this category'}
        </Title>
      </section>

      {dir === null ? (
        <Space orientation="vertical" size={16} className={pageClass}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} active paragraph={{ rows: 1 }} title={false} />
          ))}
        </Space>
      ) : dir.length > 0 ? (
        <List
          className={listClass}
          dataSource={dir}
          renderItem={(item) => (
            <List.Item
              className="cursor-pointer"
              onClick={() => navigate(`/article/${item.id}`)}
              actions={[<FaChevronRight key="arrow" />]}
            >
              <List.Item.Meta
                title={<div className="m-0 text-[1.125rem] font-semibold tracking-[-0.03em] text-[#eaffff]">{item.title}</div>}
              />
            </List.Item>
          )}
        />
      ) : (
        <div className={emptyClass}>
          <Empty description="No articles found in this category yet." />
        </div>
      )}

      {role === 'admin' && (
        <FloatButton
          icon={<FaPlus />}
          type="primary"
          tooltip={<span>Create article</span>}
          onClick={() => navigate('/content/create')}
        />
      )}
    </Space>
  );
}
