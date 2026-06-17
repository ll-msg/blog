import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  Drawer,
  Input,
  Layout as AntLayout,
  Space,
  Typography,
} from 'antd';
import { FaGithub, FaHome, FaInfoCircle, FaBars, FaSearch, FaPlus } from 'react-icons/fa';
import { apiCall, API_BASE } from './Helper';
import {
  buttonClass,
  desktopNavClass,
  drawerClass,
  headerClass,
  headerRowClass,
  inputClass,
  layoutContainer,
  mobileMenuButtonClass,
  navLinkActiveClass,
  navLinkClass,
  pageClass,
  shellClass,
  siteTitleClass,
} from '../styles';

const { Header, Content } = AntLayout;
const { Text } = Typography;

function NavLinks({ onNavigate }) {
  return (
    <Space size={20} wrap>
      <NavLink to="/" end onClick={onNavigate}>
        {({ isActive }) => (
          <Text strong={isActive} className={`${navLinkClass} ${isActive ? navLinkActiveClass : ''}`}>
            Home
          </Text>
        )}
      </NavLink>
      <NavLink to="/about" onClick={onNavigate}>
        {({ isActive }) => (
          <Text strong={isActive} className={`${navLinkClass} ${isActive ? navLinkActiveClass : ''}`}>
            About
          </Text>
        )}
      </NavLink>
    </Space>
  );
}

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [input, setInput] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    apiCall('GET', `${API_BASE}/logged`).then((data) => {
      if (data && data.role !== 'guest') {
        setLoggedIn(true);
        setUser(data);
      }
    });
  }, []);

  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/about') {
      setInput('');
    }
  }, [location.pathname]);

  const searchValue = useMemo(() => input.trim(), [input]);

  const handleLogin = () => {
    window.location.href = `${API_BASE}/auth/github`;
  };

  const search = (value = searchValue) => {
    const next = value.trim();
    if (!next) return;
    navigate(`/search?q=${encodeURIComponent(next)}`);
    setMobileOpen(false);
  };

  return (
    <AntLayout className={shellClass}>
      <Header className={`${headerClass} !h-auto !leading-none !p-0`}>
        <div className={`${layoutContainer} py-[18px]`}>
          <div className={headerRowClass}>
            <div className="flex min-w-0 flex-1 items-center gap-6">
              <Button
                type="text"
                icon={<FaBars />}
                onClick={() => setMobileOpen(true)}
                className={`${buttonClass} ${mobileMenuButtonClass}`}
              />
              <NavLink to="/" end className={`${siteTitleClass} !text-[18px] whitespace-nowrap`}>
                ◢ YANRAN_BLOG
              </NavLink>
              <div className="hidden md:flex">
                <NavLinks />
              </div>
            </div>

            <div className={desktopNavClass}>
              <Input
                allowClear
                value={input}
                placeholder="Search articles and notes..."
                prefix={<FaSearch />}
                onChange={(event) => setInput(event.target.value)}
                onPressEnter={(event) => search(event.target.value)}
                className={`${inputClass} !w-80`}
              />
              {loggedIn ? (
                <Avatar src={user?.avatar} alt="header-avatar" />
              ) : (
                <Button icon={<FaGithub />} onClick={handleLogin} className={buttonClass}>
                  GitHub Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </Header>

      <Drawer
        placement="left"
        onClose={() => setMobileOpen(false)}
        open={mobileOpen}
        className={drawerClass}
      >
        <Space orientation="vertical" size={20} className={pageClass}>
          {loggedIn && (
            <div className="flex items-center gap-3 border border-[#4df0ff]/25 bg-[#4df0ff]/5 px-3 py-3">
              <Avatar src={user?.avatar} alt="menu-avatar" />
              <div className="min-w-0">
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#4df0ff]">// WELCOME</div>
                <div className="truncate font-mono text-[14px] text-[#eaffff]">{user?.username}</div>
              </div>
            </div>
          )}
          <Input.Search
            allowClear
            value={input}
            placeholder="Search the blog"
            onChange={(event) => setInput(event.target.value)}
            onSearch={search}
            enterButton
            className={inputClass}
          />
          <Button className={buttonClass} icon={<FaHome />} block onClick={() => { navigate('/'); setMobileOpen(false); }}>
            Home
          </Button>
          <Button className={buttonClass} icon={<FaInfoCircle />} block onClick={() => { navigate('/about'); setMobileOpen(false); }}>
            About
          </Button>
          {user?.role === 'admin' && (
            <Button className={buttonClass} icon={<FaPlus />} block onClick={() => { navigate('/content/create'); setMobileOpen(false); }}>
              Create article
            </Button>
          )}
          {!loggedIn && (
            <Button className={buttonClass} icon={<FaGithub />} block onClick={handleLogin}>
              GitHub Login
            </Button>
          )}
        </Space>
      </Drawer>

      <Content>
        <main className={`${layoutContainer} ${pageClass} py-10 pb-[72px] max-md:pt-7`}>{children}</main>
      </Content>
    </AntLayout>
  );
}
