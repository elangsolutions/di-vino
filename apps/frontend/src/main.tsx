import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/eb-garamond/400.css'; // normal
import '@fontsource/eb-garamond/700.css'; // bold
import './index.css';
import App from './App.tsx';
import client from './apolloClient.ts';
import { ApolloProvider } from '@apollo/client';
import { ConfigProvider, theme as antdTheme, App as AntdApp } from 'antd';
import { NotificationProvider } from './context/NotificationContext';

const Root = () => {
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') {
            setIsDarkMode(true);
        } else {
            setIsDarkMode(false);
        }
    }, []);

    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkMode
                    ? antdTheme.darkAlgorithm
                    : antdTheme.defaultAlgorithm,
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
