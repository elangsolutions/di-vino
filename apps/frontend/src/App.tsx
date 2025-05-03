import './App.css'
import LandingPage from "./pages/LandingPage";
import {ConfigProvider, Layout, Row, Switch, theme as antdTheme, Typography} from "antd";
import {FC, useEffect, useState} from "react";

const {Title} = Typography;
const {Header} = Layout;

const App: FC = () => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);
    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
            }}
        >
            <Layout>
                <Header style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignContent: 'center',
                    background: 'inherit'
                }}>
                    <Row align={'middle'}>
                        <Title level={3} style={{margin: 15}}>Di Vino</Title>
                        <Switch
                            checked={isDarkMode}
                            onChange={setIsDarkMode}
                            checkedChildren="🌙"
                            unCheckedChildren="☀️"
                        />
                    </Row>
                </Header>
                <LandingPage/>
            </Layout>
        </ConfigProvider>
    )
}

export default App
