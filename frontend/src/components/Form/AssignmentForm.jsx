import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, message } from 'antd';
import moment from 'moment';

const AssignmentForm = () => {
    const [form] = Form.useForm();

    const handleSubmit = (values) => {
        console.log('Submitted Values:', values);
        // Submit the form values to your API or state management
    };

    const disabledDate = (current) => {
        // Disable dates before today
        return current && current < moment().startOf('day');
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="max-w-lg mx-auto mt-10 p-6 rounded-lg shadow-lg bg-white"
        >
            <Form.Item
                name="title"
                label="Assignment Title"
                rules={[{ required: true, message: 'Please enter the assignment title' }]}
            >
                <Input placeholder="Enter the assignment title" />
            </Form.Item>

            <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please enter the assignment description' }]}
            >
                <Input.TextArea placeholder="Enter the assignment description" rows={4} />
            </Form.Item>

            <Form.Item
                name="dueDate"
                label="Due Date"
                rules={[{ required: true, message: 'Please select the due date' }]}
            >
                <DatePicker
                    format="YYYY-MM-DD"
                    disabledDate={disabledDate}
                    placeholder="Select the due date"
                />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    Submit Assignment
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AssignmentForm;
