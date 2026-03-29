import { Button, Card, Space, Typography } from 'antd';
import { FaGithub } from 'react-icons/fa';
import { IoMailSharp } from 'react-icons/io5';
import {
  brandClass,
  buttonClass,
  cardClass,
  compactHeroTitleClass,
  heroCopyClass,
  pageClass,
} from '../styles';

const { Link, Paragraph, Text, Title } = Typography;

export default function About() {
  return (
    <Space orientation="vertical" size={28} className={`${pageClass} max-w-[820px]`}>
      <section>
        <Title className={compactHeroTitleClass}>
          A personal study notebook
        </Title>
        <Paragraph className={heroCopyClass}>
          Hello, I&apos;m Yanran Wang. This blog started as a React practice project and grew into a place for some study notes.
        </Paragraph>
      </section>

      <Card className={cardClass}>
        <Space orientation="vertical" size={12}>
          <Title level={3} className="!m-0 !tracking-[-0.03em]">
            Who lives here
          </Title>
          <Paragraph className="!mb-0 !leading-[1.8] !text-[#262626]">
            Artificial unintelligence, game enthusiasm, and a lot of fast-learning energy.
          </Paragraph>
          <Paragraph className="!mb-0 !leading-[1.8] !text-[#262626]">
            Currently studying at{' '}
            <Link href="https://www.unsw.edu.au/" target="_blank">
              UNSW
            </Link>.
          </Paragraph>
        </Space>
      </Card>

      <Card className={cardClass}>
        <Space orientation="vertical" size={16}>
          <div>
            <Text className={brandClass}>Contact</Text>
            <Title level={3} className="!mb-0 !mt-2 !tracking-[-0.03em]">
              Say hello
            </Title>
          </div>
          <Space wrap>
            <Button className={buttonClass} icon={<FaGithub />} href="https://github.com/ll-msg" target="_blank">
              GitHub
            </Button>
            <Button className={buttonClass} icon={<IoMailSharp />} href="mailto:wyr20031104@gmail.com">
              Email
            </Button>
          </Space>
          <Text type="secondary">GitHub: ll-msg · Email: wyr20031104@gmail.com</Text>
        </Space>
      </Card>
    </Space>
  );
}
