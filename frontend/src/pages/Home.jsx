import { Button, Card, FloatButton, Skeleton, Space, Typography } from 'antd';
import { FaArrowRight, FaPlus } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall, API_BASE } from '../components/Helper';
import {
  brandClass,
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
      <section className={`${heroSectionClass} border-b border-[#4df0ff]/20 pb-8`}>
        <div className={brandClass}>// SYSTEM ONLINE</div>
        <Title className={heroTitleClass}>A reading space for study notes.</Title>
        <Paragraph className={`${heroCopyClass} hud-cursor`}>
          &gt; 个人学习记录站，不定时更新中
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
                ┌─ CATEGORIES
              </Title>
            </div>
          </div>

          {!categories && (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className={cardClass}>
                  <Skeleton active paragraph={{ rows: 1 }} title />
                </Card>
              ))}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {categories?.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => navigate(`/content/${category.id}`)}
                className="hud-bracket flex w-full items-start justify-between gap-4 border border-[#4df0ff]/25 bg-[#4df0ff]/5 px-5 py-4 text-left transition hover:border-[#4df0ff]/60 hover:bg-[#4df0ff]/10 hover:shadow-[0_0_18px_rgba(77,240,255,0.15)]"
              >
                <div className="min-w-0">
                  <div className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#4df0ff]">
                    ▸ {category.name}
                  </div>
                  <Paragraph className="!mb-0 !mt-2 max-w-[640px] !text-[13px] !leading-6 !text-[#9fd8e6]">
                    {category.description || 'A collection of posts in this topic.'}
                  </Paragraph>
                </div>
                <span className="mt-1 text-[#4df0ff]">
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
