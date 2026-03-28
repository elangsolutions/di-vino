import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './index.css';
import App from './App.tsx';
import client from './apolloClient.ts';
import { ApolloProvider } from '@apollo/client';
import { ConfigProvider, theme as antdTheme, App as AntdApp } from 'antd';
import { NotificationProvider } from './context/NotificationContext';

const Root = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkMode
                    ? antdTheme.darkAlgorithm
                    : antdTheme.defaultAlgorithm,
                token: {
                    colorPrimary: '#5ea18b',
                    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif",
                    fontSize: 14,
                    fontWeightStrong: 600,
                    lineHeight: 1.6,
                    lineHeightHeading1: 1.2,
                    lineHeightHeading2: 1.35,
                    borderRadius: 8,
                },
            }}
        >
            <AntdApp>
                <NotificationProvider>
                    <ApolloProvider client={client}>
                        <App />
                    </ApolloProvider>
                </NotificationProvider>
            </AntdApp>
        </ConfigProvider>
    );
};

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Root />
    </StrictMode>
);
