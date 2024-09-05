// src/components/Form/CourseForm.js
import React, { useState } from 'react';
import { Form, Input, Button, Select, InputNumber, Modal, Spin, Space, Row, Col, Typography, Divider } from 'antd';
import Alert from '../Alert';

const { Title, Text } = Typography;

const CourseForm = ({ isVisible, onClose, onCreate }) => {
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [form] = Form.useForm();
    const [modules, setModules] = useState([{ title: '', content: '', type: 'text' }]);
    const [pricingType, setPricingType] = useState('free');

    const handleFinish = async (values) => {
        setLoading(true);
        setAlert(null);

        // Add modules to form values
        const fullValues = { ...values, modules };

        try {
            const response = await fetch('/api/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(fullValues),
            });

            if (response.ok) {
                const course = await response.json();
                setAlert({ type: 'success', message: 'Course created successfully!' });
                onCreate(course);
                form.resetFields();
                setModules([{ title: '', content: '', type: 'text' }]); // Reset modules
            } else {
                const errorData = await response.json();
                setAlert({ type: 'error', message: errorData.message || 'Failed to create course.' });
            }
        } catch (error) {
            setAlert({ type: 'error', message: 'An error occurred. Please try again later.' });
        } finally {
            setLoading(false);
        }
    };

    const handleAddModule = () => {
        setModules([...modules, { title: '', content: '', type: 'text' }]);
    };

    const handleModuleChange = (index, field, value) => {
        const updatedModules = [...modules];
        updatedModules[index][field] = value;
        setModules(updatedModules);
    };

    const handlePricingTypeChange = (value) => {
        setPricingType(value);
    };

    return (
        <Modal
            title="Create New Course"
            visible={isVisible}
            onCancel={onClose}
            footer={null}
            className="course-form-modal"
        >
            {loading ? (
                <div className="text-center">
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
                    <Form form={form} layout="vertical" onFinish={handleFinish} className="p-4">
                        <Title level={4} className="mb-4">Course Details</Title>
                        <Form.Item name="title" label="Course Title" rules={[{ required: true }]}>
                            <Input placeholder="Enter course title" className="rounded-md border-gray-300" />
                        </Form.Item>
                        <Form.Item name="description" label="Course Description" rules={[{ required: true }]}>
                            <Input.TextArea rows={4} placeholder="Enter course description" className="rounded-md border-gray-300" />
                        </Form.Item>

                        <Divider />

                        <Title level={4} className="mb-4">Modules</Title>
                        {modules.map((module, index) => (
                            <div key={index} className="p-4 mb-4 border rounded-md shadow-sm bg-white">
                                <Form.Item label="Title">
                                    <Input
                                        value={module.title}
                                        onChange={(e) => handleModuleChange(index, 'title', e.target.value)}
                                        placeholder="Module title"
                                        className="rounded-md border-gray-300"
                                    />
                                </Form.Item>
                                <Form.Item label="Content">
                                    <Input.TextArea
                                        rows={3}
                                        value={module.content}
                                        onChange={(e) => handleModuleChange(index, 'content', e.target.value)}
                                        placeholder="Module content"
                                        className="rounded-md border-gray-300"
                                    />
                                </Form.Item>
                                <Form.Item label="Type">
                                    <Select
                                        value={module.type}
                                        onChange={(value) => handleModuleChange(index, 'type', value)}
                                        className="w-full"
                                    >
                                        <Select.Option value="text">Text</Select.Option>
                                        <Select.Option value="video">Video</Select.Option>
                                        <Select.Option value="quiz">Quiz</Select.Option>
                                    </Select>
                                </Form.Item>
                            </div>
                        ))}
                        <Button type="dashed" onClick={handleAddModule} block className="mb-4">
                            Add Module
                        </Button>

                        <Divider />

                        <Title level={4} className="mb-4">Pricing</Title>
                        <Form.Item name="pricing" label="Pricing Type" rules={[{ required: true }]}>
                            <Select onChange={handlePricingTypeChange} className="w-full">
                                <Select.Option value="free">Free</Select.Option>
                                <Select.Option value="one-time">One-time Payment</Select.Option>
                                <Select.Option value="subscription">Subscription</Select.Option>
                            </Select>
                        </Form.Item>
                        {pricingType !== 'free' && (
                            <Form.Item name="amount" label="Amount">
                                <InputNumber
                                    min={0}
                                    placeholder="Enter amount"
                                    style={{ width: '100%' }}
                                    className="rounded-md border-gray-300"
                                />
                            </Form.Item>
                        )}
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block className="bg-blue-500 hover:bg-blue-600">
                                Create Course
                            </Button>
                        </Form.Item>
                    </Form>
                </>
            )}
        </Modal>
    );
};

export default CourseForm;
