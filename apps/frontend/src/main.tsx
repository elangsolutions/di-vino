import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/eb-garamond/400.css';
import '@fontsource/eb-garamond/700.css';
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
                    colorPrimary: '#5ea18b', // custom green in dark mode
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
