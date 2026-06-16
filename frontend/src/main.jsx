import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { CategoryProvider } from './components/CategoryContext.jsx';
import 'antd/dist/reset.css';
import 'katex/dist/katex.min.css';
import './index.css';
import App from './App.jsx';

const blogTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#4df0ff',
    colorInfo: '#4df0ff',
    colorBgBase: '#05080d',
    colorTextBase: '#cdd9e0',
    colorBorder: 'rgba(77,240,255,0.25)',
    colorSplit: 'rgba(77,240,255,0.15)',
    colorLink: '#4df0ff',
    colorLinkHover: '#9bf6ff',
    borderRadius: 0,
    fontFamily: '"Share Tech Mono", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
    fontFamilyCode: '"Share Tech Mono", Consolas, "Liberation Mono", Menlo, monospace',
  },
  components: {
    Layout: {
      bodyBg: 'transparent',
      headerBg: 'rgba(5,8,13,0.92)',
      siderBg: '#05080d',
      triggerBg: '#4df0ff',
    },
    Card: {
      headerBg: 'transparent',
      colorBgContainer: 'rgba(77,240,255,0.05)',
    },
    Input: {
      activeBorderColor: '#4df0ff',
      hoverBorderColor: '#4df0ff',
      colorBgContainer: 'rgba(77,240,255,0.05)',
    },
    Button: {
      primaryShadow: 'none',
      defaultShadow: 'none',
      borderColorDisabled: 'rgba(77,240,255,0.2)',
    },
    Drawer: {
      colorBgElevated: '#05080d',
    },
    Collapse: {
      headerBg: 'transparent',
      contentBg: 'transparent',
    },
    Anchor: {
      colorPrimary: '#4df0ff',
      colorText: '#7fffe6',
      colorSplit: 'rgba(77,240,255,0.15)',
    },
  },
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider theme={blogTheme}>
      <BrowserRouter>
        <CategoryProvider>
          <App />
        </CategoryProvider>
      </BrowserRouter>
    </ConfigProvider>
  </StrictMode>
);
