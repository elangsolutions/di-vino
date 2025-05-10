// pages/LoginPage.tsx
import { Button, Form, Input, Typography } from "antd";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (values: any) => {
        // Simulate a token from server
        console.log(values)
        const mockToken = "mock-jwt-token";
        login(mockToken);
        navigate("/admin");
    };

    return (
        <div style={{ maxWidth: 400, margin: "auto", padding: 40 }}>
            <Title level={3}>Admin Login</Title>
            <Form layout="vertical" onFinish={handleLogin}>
                <Form.Item name="username" label="Username" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" type="primary" block>
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default LoginPage;
