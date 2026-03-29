import { Card, Typography } from 'antd';
import { cardClass, categoryCopyClass, categoryTitleClass } from '../styles';

const { Paragraph, Title } = Typography;

export default function CardItem({ category, handleClick }) {
  return (
    <Card hoverable className={cardClass} onClick={() => handleClick(category.id)}>
      <Typography>
        <Title level={3} className={categoryTitleClass}>
          {category.name}
        </Title>
        <Paragraph className={categoryCopyClass} type="secondary">
          {category.description || 'A collection of posts in this topic.'}
        </Paragraph>
      </Typography>
    </Card>
  );
}
