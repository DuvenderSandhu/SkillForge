// src/components/Form/QuizForm.js
import React, { useState } from 'react';
import { Form, Input, Button, Select, Modal, Spin, Divider, Typography } from 'antd';
import Alert from '../Alert';

const { Title } = Typography;

const QuizForm = ({ isVisible, onClose, onCreate }) => {
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [form] = Form.useForm();
    const [questionType, setQuestionType] = useState('multiple-choice');

    const handleFinish = async (values) => {
        setLoading(true);
        setAlert(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/api/quizs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                const quiz = await response.json();
                setAlert({ type: 'success', message: 'Quiz created successfully!' });
                onCreate(quiz);
                form.resetFields();
            } else {
                const errorData = await response.json();
                setAlert({ type: 'error', message: errorData.message || 'Failed to create quiz.' });
            }
        } catch (error) {
            setAlert({ type: 'error', message: 'An error occurred. Please try again later.' });
        } finally {
            setLoading(false);
        }
    };

    const handleQuestionTypeChange = (value) => {
        setQuestionType(value);
    };

    return (
        <Modal
            title="Create New Quiz"
            visible={isVisible}
            onCancel={onClose}
            footer={null}
            className="quiz-form-modal"
        >
            {loading ? (
                <div className="text-center">
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
                    <Form form={form} layout="vertical" onFinish={handleFinish} className="p-4">
                        <Title level={4} className="mb-4">Quiz Details</Title>
                        <Form.Item name="title" label="Quiz Title" rules={[{ required: true }]}>
                            <Input placeholder="Enter quiz title" className="rounded-md border-gray-300" />
                        </Form.Item>
                        <Form.Item name="description" label="Quiz Description" rules={[{ required: true }]}>
                            <Input.TextArea rows={4} placeholder="Enter quiz description" className="rounded-md border-gray-300" />
                        </Form.Item>

                        <Divider />

                        <Title level={4} className="mb-4">Question Type</Title>
                        <Form.Item name="questionType" label="Type" rules={[{ required: true }]}>
                            <Select onChange={handleQuestionTypeChange} className="w-full">
                                <Select.Option value="multiple-choice">Multiple Choice</Select.Option>
                                <Select.Option value="true-false">True/False</Select.Option>
                                <Select.Option value="short-answer">Short Answer</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block className="bg-blue-500 hover:bg-blue-600">
                                Create Quiz
                            </Button>
                        </Form.Item>
                    </Form>
                </>
            )}
        </Modal>
    );
};

export default QuizForm;
