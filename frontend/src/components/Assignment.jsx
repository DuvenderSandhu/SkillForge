import React, { useState, useEffect } from 'react';
import { Card, Avatar, Tag, Tooltip, Button, Select, message, Modal, Form, Input, Upload } from 'antd';
import { ClockCircleOutlined, UserOutlined, CheckCircleOutlined, CloseCircleOutlined, UploadOutlined } from '@ant-design/icons';
import useGetCourses from './hooks/useGetCourse';
import moment from 'moment';
import { useSelector } from 'react-redux';

const { Option } = Select;

const Assignment = () => {
    const { courses: assignments, loading, error } = useGetCourses("assignments");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [filteredAssignments, setFilteredAssignments] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentAssignment, setCurrentAssignment] = useState(null);
    const [form] = Form.useForm();
    const user = useSelector(state=>state.user)

    useEffect(() => {
        if (error) {
            message.error('Failed to load assignments.');
            return;
        }

        if (!loading) {
            const sortedAssignments = [...assignments].sort((a, b) => {
                return moment(a.dueDate).isAfter(b.dueDate) ? -1 : 1;
            });
    
            setFilteredAssignments(sortedAssignments);
        }
    }, [assignments, loading, error]);

    const handleCategoryFilterChange = (value) => {
        setSelectedCategory(value);
        applyFilters(value);
    };

    const applyFilters = (category) => {
        let updatedAssignments = assignments;

        if (category !== "all") {
            updatedAssignments = updatedAssignments.filter(assignment => assignment.category === category);
        }

        // Re-apply sorting after filtering
        const sortedAssignments = [...updatedAssignments].sort((a, b) => {
            return moment(a.dueDate).isBefore(b.dueDate) ? -1 : 1;
        });

        setFilteredAssignments(sortedAssignments);
    };

    const showModal = (assignment) => {
        setCurrentAssignment(assignment);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleSubmit = (values) => {
        if (!currentAssignment) {
            message.error('No assignment selected.');
            return;
        }
    
        const file = values.fileUrl?.fileList[0]?.originFileObj;
        if (!file) {
            message.error('No file selected.');
            return;
        }
    
        const formData = new FormData();
        formData.append('file', file);
        formData.append('submittedAt', moment().format('YYYY-MM-DD HH:mm:ss'));
        formData.append('assignmentID', currentAssignment._id);
        formData.append('feedback', values.feedback || '');
    
        fetch(`${import.meta.env.VITE_HOST}/api/assignments/submit/${currentAssignment._id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.token}`, // Authorization header remains
            },
            body: formData, // Send FormData directly
        })
        .then(response => response.json())
        .then(data => {
            message.success('Assignment submitted successfully!');
            handleCancel();
        })
        .catch(error => {
            message.error('Failed to submit assignment.');
            console.error('Error:', error);
        });
    };
    

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Available Assignments</h1>
                
                <div className="mb-8 flex justify-center space-x-4">
                    <Select
                        value={selectedCategory}
                        onChange={handleCategoryFilterChange}
                        className="w-48"
                        placeholder="Filter by Category"
                    >
                        <Option value="all">All</Option>
                        <Option value="Web Development">Web Development</Option>
                        <Option value="Backend Development">Backend Development</Option>
                        <Option value="Data Science">Data Science</Option>
                    </Select>
                </div>

                {loading ? (
                    <div className="text-center text-gray-600">Loading assignments...</div>
                ) : filteredAssignments.length === 0 ? (
                    <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">No Assignments Found</h1>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredAssignments.map((assignment, index) => (
                            <Card
                                key={index}
                                hoverable
                                className="p-6 rounded-lg shadow-lg bg-white"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-semibold">{assignment.title}</h3>
                                    <Tag color={assignment.status === 'active' ? 'green' : 'red'}>
                                        {assignment.status === 'active' ? (
                                            <CheckCircleOutlined />
                                        ) : (
                                            <CloseCircleOutlined />
                                        )}{" "}
                                        {assignment.status.toUpperCase()}
                                    </Tag>
                                </div>

                                <p className="text-gray-700 mb-4">{assignment.description}</p>

                                <div className="mb-4">
                                    <Tooltip title={`Due Date: ${moment(assignment.dueDate).format('MMMM Do YYYY, h:mm:ss a')}`}>
                                        <Tag
                                            color={moment(assignment.dueDate).diff(moment(), 'days') < 3 ? 'volcano' : 'blue'}
                                            icon={<ClockCircleOutlined />}
                                            className="text-lg"
                                        >
                                            Due {moment(assignment.dueDate).fromNow()}
                                        </Tag>
                                    </Tooltip>
                                </div>

                                <div className="mb-4 flex items-center">
                                    <Avatar
                                        size="large"
                                        icon={<UserOutlined />}
                                        src={assignment.instructor?.avatar}
                                        className="mr-4"
                                    />
                                    <div>
                                        <p className="text-gray-600">Instructor:</p>
                                        <p className="text-gray-800 font-medium">{assignment.instructor?.name}</p>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button 
                                        type="primary" 
                                        className="bg-blue-500 border-blue-500"
                                        onClick={() => showModal(assignment)}
                                        disabled={moment(assignment.dueDate).isBefore(moment())} // Disable if past due date
                                    >
                                        Submit Assignment ({assignment.submissions.length})
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                <Modal
                    title={`Submit Assignment - ${currentAssignment?.title}`}
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            name="fileUrl"
                            label="Upload File"
                            rules={[{ required: true, message: 'Please upload your assignment!' }]}
                        >
                            <Upload
                                accept=".pdf" // Restrict file type to PDF
                                showUploadList={true}
                            >
                                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item name="feedback" label="Feedback (Optional)">
                            <Input.TextArea rows={4} placeholder="Add any feedback for your submission..." />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default Assignment;
