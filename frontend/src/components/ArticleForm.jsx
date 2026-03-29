import { Button, Card, Flex, Input, Select, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CodeBlock from './CodeBlock';
import { apiCall, API_BASE } from './Helper';
import {
  brandClass,
  buttonClass,
  cardClass,
  compactHeroTitleClass,
  editorGridClass,
  heroCopyClass,
  inputClass,
  markdownClass,
  pageClass,
} from '../styles';

const { TextArea } = Input;
const { Paragraph, Text, Title } = Typography;

export default function ArticleForm({ mode = 'create', article = null }) {
  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.body || '');
  const [categories, setCategories] = useState(null);
  const navigate = useNavigate();

  const clearCategoryName = (name) => name?.trim().toLowerCase();
  const [categoryName, setCategoryName] = useState(clearCategoryName(article?.categoryName || ''));

  useEffect(() => {
    apiCall('GET', `${API_BASE}/categories`).then((data) => {
      if (data) setCategories(data);
    });
  }, []);

  const originalCategory = categories?.find((category) => clearCategoryName(category.name) === categoryName);

  const onSubmit = async () => {
    if (!title || !content || !categoryName) {
      alert('Please fill in all the fields');
      return;
    }

    if (mode === 'create') {
      const result = await apiCall('POST', `${API_BASE}/article/create`, {
        title,
        content,
        userId: 1,
        createdAt: new Date().toISOString(),
        categoryName: originalCategory?.name,
      });

      if (result !== null) {
        alert('Your article has been successfully uploaded!');
        navigate('/');
      }
      return;
    }

    const result = await apiCall('PUT', `${API_BASE}/article/${article.id}`, {
      title,
      content,
      categoryName: originalCategory?.name || article.categoryName,
    });

    if (result !== null) {
      alert('Your article has been successfully updated!');
      navigate(`/article/${article.id}`);
    }
  };

  return (
    <Space orientation="vertical" size={28} className={pageClass}>
      <section>
        <Text className={brandClass}>Editor</Text>
        <Title className={compactHeroTitleClass}>
          {mode === 'create' ? 'Create a new article.' : 'Revise this article.'}
        </Title>
        <Paragraph className={heroCopyClass}>
          The editor now leans on Ant Design inputs and cards so the structure stays simple while markdown remains the focus.
        </Paragraph>
      </section>

      <Card className={cardClass}>
        <Space orientation="vertical" size={18} className={pageClass}>
          <div>
            <Text className={brandClass}>Category</Text>
            <Select
              className={`${inputClass} !mt-2 !w-full`}
              placeholder="Select a category"
              value={categoryName || undefined}
              options={categories?.map((category) => ({
                label: category.name,
                value: clearCategoryName(category.name),
              })) || []}
              onChange={(value) => setCategoryName(value)}
            />
          </div>

          <div>
            <Text className={brandClass}>Title</Text>
            <Input
              className={`${inputClass} !mt-2`}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter your article title"
            />
          </div>
        </Space>
      </Card>

      <div className={editorGridClass}>
        <Card className={cardClass} title="Markdown">
          <TextArea
            autoSize={{ minRows: 18 }}
            className="[&.ant-input]:rounded-[24px]"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write your article in markdown"
          />
        </Card>

        <Card className={cardClass} title="Preview">
          <div className={markdownClass}>
            <CodeBlock content={content} />
          </div>
        </Card>
      </div>

      <Flex justify="flex-end">
        <Button type="primary" size="large" className={buttonClass} onClick={onSubmit}>
          {mode === 'create' ? 'Publish article' : 'Save changes'}
        </Button>
      </Flex>
    </Space>
  );
}
