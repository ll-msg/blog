import { Button, Card, FloatButton, Skeleton, Space, Typography } from 'antd';
import { FaArrowRight, FaPlus } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall, API_BASE } from '../components/Helper';
import {
  buttonClass,
  cardClass,
  heroActionsClass,
  heroCopyClass,
  heroSectionClass,
  heroTitleClass,
  pageStackClass,
  sectionTitleClass,
} from '../styles';

const { Paragraph, Text, Title } = Typography;

export default function Home() {
  const navigate = useNavigate();
  const [role, setRole] = useState('guest');
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    apiCall('GET', `${API_BASE}/categories`).then((data) => {
      if (data) setCategories(data);
    });
  }, []);

  useEffect(() => {
    apiCall('GET', `${API_BASE}/logged`).then((data) => {
      if (data) {
        setRole(data.role);
      }
    });
  }, []);

  return (
    <Space orientation="vertical" size={32} className={pageStackClass}>
      <section className={`${heroSectionClass} border-b border-[#e5e5e5] pb-8`}>
        <Title className={heroTitleClass}>A small reading space for study notes.</Title>
        <Paragraph className={heroCopyClass}>
          个人学习记录站，不定时更新中
        </Paragraph>
        <div className={heroActionsClass}>
          <Button type="primary" className={buttonClass} onClick={() => navigate(categories?.[0] ? `/content/${categories[0].id}` : '/about')}>
            Start reading
          </Button>
          <Button className={buttonClass} onClick={() => navigate('/about')}>
            About this blog 
          </Button>
        </div>
      </section>

      <section className="w-full max-w-[920px]">
        <Space orientation="vertical" size={18} className={pageStackClass}>
          <div className="flex items-end justify-between gap-4 max-sm:flex-col max-sm:items-start">
            <div>
              <Title level={2} className={`${sectionTitleClass} !mt-2`}>
                Categories
              </Title>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e5e5e5] bg-white">
            {!categories && (
              <div className="space-y-4 p-6">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Card key={index} className={cardClass}>
                    <Skeleton active paragraph={{ rows: 1 }} title />
                  </Card>
                ))}
              </div>
            )}

            {categories?.map((category, index) => (
              <button
                key={category.id}
                type="button"
                onClick={() => navigate(`/content/${category.id}`)}
                className={`flex w-full items-start justify-between gap-4 px-6 py-5 text-left transition hover:bg-[#fafafa] ${index !== categories.length - 1 ? 'border-b border-[#ededed]' : ''}`}
              >
                <div className="min-w-0">
                  <Title level={4} className="!mb-2 !mt-0 tracking-[-0.02em]">
                    {category.name}
                  </Title>
                  <Paragraph className="!mb-0 max-w-[640px] !text-[15px] !leading-7 !text-[#595959]">
                    {category.description || 'A collection of posts in this topic.'}
                  </Paragraph>
                </div>
                <span className="mt-1 text-[#7a7a7a]">
                  <FaArrowRight />
                </span>
              </button>
            ))}
          </div>
        </Space>
      </section>

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
