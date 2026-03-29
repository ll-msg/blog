import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { CategoryProvider } from './components/CategoryContext.jsx';
import 'antd/dist/reset.css';
import './index.css';
import App from './App.jsx';

const blogTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#111111',
    colorSuccess: '#111111',
    colorWarning: '#111111',
    colorError: '#111111',
    colorInfo: '#111111',
    colorBgBase: '#ffffff',
    colorTextBase: '#111111',
    colorBorder: '#d9d9d9',
    colorSplit: '#e8e8e8',
    borderRadius: 14,
    fontFamily: 'Arial, "Microsoft YaHei", "微软雅黑", sans-serif',
    fontFamilyCode: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
  },
  components: {
    Layout: {
      bodyBg: '#ffffff',
      headerBg: 'rgba(255,255,255,0.95)',
      siderBg: '#ffffff',
      triggerBg: '#111111',
    },
    Card: {
      headerBg: '#ffffff',
    },
    Input: {
      activeBorderColor: '#111111',
      hoverBorderColor: '#111111',
    },
    Button: {
      primaryShadow: 'none',
      defaultShadow: 'none',
      borderColorDisabled: '#d9d9d9',
    },
    Anchor: {
      colorPrimary: '#111111',
      colorText: '#595959',
      colorSplit: '#e8e8e8',
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
