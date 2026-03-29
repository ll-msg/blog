import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Anchor,
  Button,
  Card,
  Drawer,
  Empty,
  Popconfirm,
  Skeleton,
  Space,
  Typography,
} from 'antd';
import { FaTrash, FaEdit, FaEye, FaBars } from 'react-icons/fa';
import { MdTranslate } from 'react-icons/md';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import CodeBlock from './CodeBlock';
import CategorySideBar from './CategorySideBar';
import { apiCall, API_BASE } from './Helper';
import {
  articleAsideClass,
  articleBodyClass,
  articleLayoutClass,
  brandClass,
  buttonClass,
  cardClass,
  drawerClass,
  markdownClass,
  pageClass,
  sidebarTitleClass,
} from '../styles';

const { Text, Title } = Typography;

function generateToc(markdown) {
  if (!markdown) return [];

  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown);
  const toc = [];

  visit(tree, 'heading', (node) => {
    if (node.depth >= 1 && node.depth <= 3) {
      const text = node.children
        .filter((child) => child.type === 'text' || child.type === 'inlineCode')
        .map((child) => child.value)
        .join('');

      const id = text
        .toLowerCase()
        .replace(/[^\w]+/g, '-')
        .replace(/(^-|-$)/g, '');

      toc.push({ key: id, href: `#${id}`, title: text });
    }
  });

  return toc;
}

export default function Article() {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [role, setRole] = useState('guest');
  const [open, setOpen] = useState(false);
  const [prev, setPrev] = useState(null);
  const [next, setNext] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiCall('GET', `${API_BASE}/article/${articleId}`).then((data) => {
      if (data) setArticle(data);
    });
  }, [articleId]);

  useEffect(() => {
    apiCall('GET', `${API_BASE}/logged`).then((data) => {
      if (data) {
        setRole(data.role);
      }
    });
  }, []);

  useEffect(() => {
    setPrev(null);
    setNext(null);
    if (!article) return;

    apiCall('GET', `${API_BASE}/${article.category_id}/directory`).then((list) => {
      if (!list) return;
      const index = list.findIndex((item) => item.id === article.id);
      if (index > 0) setPrev(list[index - 1]);
      if (index < list.length - 1) setNext(list[index + 1]);
    });
  }, [article]);

  const getTargetLang = () => {
    const lang = (navigator.language || 'en').toLowerCase();
    return lang.split('-')[0].toUpperCase();
  };

  const handleTranslate = async () => {
    if (!article?.body) return;
    const targetLang = getTargetLang();
    const response = await apiCall('POST', `${API_BASE}/translate`, {
      text: article.body,
      target_lang: targetLang,
    });

    const translated = response?.translated_text;
    if (!translated) {
      alert('Translation failed.');
      return;
    }

    setArticle((prevArticle) => ({ ...prevArticle, body: translated }));
  };

  const startDelete = async () => {
    const result = await apiCall('DELETE', `${API_BASE}/article/${articleId}`);
    if (result !== null) {
      alert('You successfully deleted this article!');
      navigate('/');
    }
  };

  const markdown = article?.body?.replace(/\\n/g, '\n') || '';
  const tocItems = generateToc(markdown);

  if (!article) {
    return <Skeleton active paragraph={{ rows: 12 }} />;
  }

  return (
    <Space orientation="vertical" size={24} className={pageClass}>
      <Button icon={<FaBars />} onClick={() => setOpen(true)} className={`${buttonClass} !w-fit`}>
        Browse posts
      </Button>

      <Drawer
        title="Archive"
        placement="left"
        onClose={() => setOpen(false)}
        open={open}
        className={drawerClass}
      >
        <CategorySideBar article={article.id} onNavigate={() => setOpen(false)} />
      </Drawer>

      <div className={articleLayoutClass}>
        <div className="min-w-0">
          <Card className={cardClass}>
            <Space orientation="vertical" size={18} className={pageClass}>
              <Space wrap className="!flex !w-full !justify-between">
                <Space wrap>
                  {prev && (
                    <Button type="link" className="!px-0" onClick={() => navigate(`/article/${prev.id}`)}>
                      ← {prev.title}
                    </Button>
                  )}
                </Space>
                <Space wrap>
                  {next && (
                    <Button type="link" className="!px-0" onClick={() => navigate(`/article/${next.id}`)}>
                      {next.title} →
                    </Button>
                  )}
                </Space>
              </Space>

              <div>
                <Text className={brandClass}>Article</Text>
                <Title className="!mb-3 !mt-2 tracking-[-0.03em]">{article.title}</Title>
                <Space wrap size={[12, 8]}>
                  <Text type="secondary">Last modified: {new Date(article.created_at).toLocaleDateString()}</Text>
                  <Text type="secondary"><FaEye className="mr-1.5 inline-block" />{article.views}</Text>
                </Space>
              </div>

              <Space wrap>
                <Button className={buttonClass} icon={<MdTranslate />} onClick={handleTranslate}>
                  Translate
                </Button>
                {role === 'admin' && (
                  <Button className={buttonClass} icon={<FaEdit />} onClick={() => navigate('update')}>
                    Edit
                  </Button>
                )}
                {role === 'admin' && (
                  <Popconfirm title="Delete this article?" onConfirm={startDelete} okText="Delete" cancelText="Cancel">
                    <Button className={buttonClass} danger icon={<FaTrash />}>
                      Delete
                    </Button>
                  </Popconfirm>
                )}
              </Space>

              <div className={`${articleBodyClass} ${markdownClass}`}>
                <CodeBlock content={markdown} />
              </div>
            </Space>
          </Card>
        </div>

        <aside className={articleAsideClass}>
          <Card className={cardClass}>
            <Typography>
              <Title level={5} className={sidebarTitleClass}>On this page</Title>
            </Typography>
            {tocItems.length > 0 ? (
              <Anchor items={tocItems} affix={false} />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No headings yet" />
            )}
          </Card>
        </aside>
      </div>
    </Space>
  );
}
