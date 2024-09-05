// src/components/Register.js
import React, { useState } from 'react';
import { Form, Input, Button, Card, Spin } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import Alert from './Alert';
import { useNavigate ,Link} from 'react-router-dom';

const Register = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(false); // Loading state
    const navigate= useNavigate()
    const onFinish = async (values) => {
        setLoading(true); // Start loading
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/api/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            setAlerts([...alerts, { type: 'success', message: 'Registration successful! You can now login.' }]);
            navigate('/user/login')
        } catch (error) {
            setAlerts([...alerts, { type: 'error', message: error.message }]);
        } finally {
            setLoading(false); // End loading
        }
    };

    const onFinishFailed = (errorInfo) => {
        setAlerts([...alerts, { type: 'error', message: 'Registration failed. Please check your input.' }]);
    };

    const handleCloseAlert = (index) => {
        setAlerts(alerts.filter((_, i) => i !== index));
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-primary to-secondary1">
            <div className="w-full max-w-md mx-4 relative">
            <div className="mt-4">
                    {alerts.map((alert, index) => (
                        <Alert
                            type={alert.type}
                            message={alert.message}
                        />
                    ))}
                </div>
                <Card className="p-6 rounded-lg shadow-xl bg-white relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <img src="/path-to-your-logo.svg" alt="Logo" className="w-24" />
                    </div>
                    <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">Register</h2>
                    <Spin spinning={loading}> {/* Loading spinner */}
                        <Form
                            name="register"
                            layout="vertical"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                        >
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: 'Please input your username!' }]}
                            >
                                <Input
                                    prefix={<UserOutlined className="text-secondary2" />}
                                    placeholder="Username"
                                    className="rounded-full py-2 px-4"
                                />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                rules={[{ required: true, message: 'Please input your email!' }]}
                            >
                                <Input
                                    prefix={<MailOutlined className="text-secondary2" />}
                                    placeholder="Email Address"
                                    className="rounded-full py-2 px-4"
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="text-secondary2" />}
                                    placeholder="Password"
                                    className="rounded-full py-2 px-4"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="w-full rounded-full py-2"
                                    style={{ backgroundColor: '#ED9455', borderColor: '#ED9455' }}
                                    disabled={loading} // Disable button during loading
                                >
                                    Register
                                </Button>
                            </Form.Item>

                            <div className="text-center mt-4">
                                <p className="text-gray-600">
                                    Already have an account? <Link to="/user/login" className="text-secondary1 font-semibold">Login</Link>
                                </p>
                            </div>
                        </Form>
                    </Spin>
                </Card>
                
            </div>
        </div>
    );
};

export default Register;
