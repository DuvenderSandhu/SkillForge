// src/components/Form/WorkshopForm.js
import React from 'react';
import { Form, Input, Button, DatePicker, TimePicker, Spin } from 'antd';
import { useState } from 'react';
import moment from 'moment';
import Alert from '../Alert';

const WorkshopForm = ({ onCreate, onCancel }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleFinish = async (values) => {
        setLoading(true);
        setAlert(null);

        // Convert Date and Time to ISO string if needed
        const formattedValues = {
            ...values,
            date: values.date.format('YYYY-MM-DD'),
            duration: values.duration.format('HH:mm'),
        };

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log('Workshop created:', formattedValues);
            setAlert({ type: 'success', message: 'Workshop created successfully!' });
            onCreate(formattedValues);
            form.resetFields();
        } catch (error) {
            setAlert({ type: 'error', message: 'Failed to create workshop. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                className="p-4 space-y-4"
                initialValues={{ date: moment(), duration: moment().startOf('day').add(1, 'hour') }}
            >
                <Form.Item
                    name="title"
                    label="Title"
                    rules={[{ required: true, message: 'Title is required' }]}
                >
                    <Input placeholder="Enter workshop title" className="rounded-md border-gray-300" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Description is required' }]}
                >
                    <Input.TextArea rows={4} placeholder="Enter workshop description" className="rounded-md border-gray-300" />
                </Form.Item>

                <Form.Item
                    name="date"
                    label="Date"
                    rules={[{ required: true, message: 'Date is required' }]}
                >
                    <DatePicker
                        className="w-full rounded-md border-gray-300"
                        format="YYYY-MM-DD"
                        placeholder="Select date"
                    />
                </Form.Item>

                <Form.Item
                    name="duration"
                    label="Duration"
                    rules={[{ required: true, message: 'Duration is required' }]}
                >
                    <TimePicker
                        className="w-full rounded-md border-gray-300"
                        format="HH:mm"
                        placeholder="Select duration"
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading} className="bg-blue-500 hover:bg-blue-600">
                        {loading ? <Spin /> : 'Create Workshop'}
                    </Button>
                </Form.Item>

                <Form.Item>
                    <Button onClick={onCancel} block className="bg-red-500 hover:bg-red-600 text-white">
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default WorkshopForm;
