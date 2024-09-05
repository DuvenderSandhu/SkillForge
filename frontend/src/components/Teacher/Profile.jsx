import React, { useState, useEffect } from 'react';
import { Card, Avatar,Tooltip, List, Button, Modal, Form, Input, Select, Spin, Checkbox, DatePicker } from 'antd';
import { EditOutlined, BookOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';
import 'tailwindcss/tailwind.css';
import Alert from '../Alert';

const { Option } = Select;

const TeacherProfile = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [newBio, setNewBio] = useState('');
    const loggedInUser = useSelector(state => state.user);
    const [userData, setUserData] = useState({});
    const [modules, setModules] = useState([{ title: '', content: '', type: 'text' }]);
    const [pricingType, setPricingType] = useState('free');
    const [isActive, setIsActive] = useState(true);
    const [duration, setDuration] = useState('');
    const [date, setDate] = useState(null);
    const [questions, setQuestions] = useState([{ question: '', isMCQ: false, options: ['', '', '', ''] }]);
    const navigate = useNavigate();
    const [alert,setAlert]=useState({type:"",message:""})

    useEffect(() => {
        if (loggedInUser.token) {
            fetchData();
            console.log("Hi")
        } else {
            navigate('/user/login');
        }
    }, [loggedInUser.token]);

    const fetchData = () => {
        fetch(`${import.meta.env.VITE_HOST}/api/user/user/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${loggedInUser.token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)

            setUserData(data.data);
            setIsLoading(false);
        

        })
        .catch(error => {
            console.error('Error:', error);
            setIsLoading(false);
        });
    };

    const showModal = (type) => {
        setModalType(type);
        setIsModalVisible(true);
        resetModalState();
    };

    const resetModalState = () => {
        setModules([{ title: '', content: '', type: 'text' }]);
        setPricingType('free');
        setIsActive(true);
        setDuration('');
        setDate(null);
        setQuestions([{ question: '', isMCQ: false, options: ['', '', '', ''] }]);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setModalType(null);
    };

    const handleCreate = (values) => {
        setIsLoading(true);
        const endpointMap = {
            course: 'courses',
            workshop: 'workshops',
            assignment: 'assignments',
            quiz: 'quizzes',
        };

        const payload = {
            ...values,
            modules,
            pricing: pricingType,
            isActive,
            duration,
            date,
            questions
        };

        fetch(`${import.meta.env.VITE_HOST}/api/${endpointMap[modalType]}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${loggedInUser.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
           
            setIsLoading(false);
            if(!data.error){
                console.log(`${modalType} created:`, data);
                setAlert({type:"success",message:`${modalType} created`})
            }
            else{
                console.error(`Error creating ${modalType}:`, error);
                setAlert({type:"error",message:`Error While Creating ${modalType} :`})
            }
            console.log(alert)
        })
        .catch(error => {
            
            setIsLoading(false);
            
        });

        setIsModalVisible(false);
        setModalType(null);
    };

    const handleBioEdit = () => {
        setIsEditingBio(true);
        setNewBio(userData.bio);
    };

    const handleBioSave = () => {
        setIsLoading(true);
        fetch(`${import.meta.env.VITE_HOST}/api/user/user/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${loggedInUser.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bio: newBio })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setUserData(data);
            setIsEditingBio(false);
            setIsLoading(false);
        })
        .catch(error => {
            console.error('Error updating bio:', error);
            setIsLoading(false);
        });
    };

    const handleBioCancel = () => {
        setIsEditingBio(false);
    };

    const addModule = () => {
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

    const handleDateChange = (date) => {
        setDate(date);
    };

    const addQuestion = () => {
        setQuestions([...questions, { question: '', isMCQ: false, options: ['', '', '', ''] }]);
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options[optionIndex] = value;
        setQuestions(updatedQuestions);
    };

    const renderQuestionFields = () => {
        return questions.map((question, index) => (
            <div key={index} className="mb-4 p-4 bg-white shadow-lg rounded-lg border border-gray-300">
                <Form.Item
                    label={`Question ${index + 1}`}
                    rules={[{ required: true, message: 'Please input the question!' }]}
                >
                    <Input
                        value={question.question}
                        onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                        className="border rounded-md"
                    />
                </Form.Item>
                <Form.Item label="Is this an MCQ?">
                    <Checkbox
                        checked={question.isMCQ}
                        onChange={(e) => handleQuestionChange(index, 'isMCQ', e.target.checked)}
                    />
                </Form.Item>
                {question.isMCQ && question.options.map((option, optionIndex) => (
                    <Form.Item
                        key={optionIndex}
                        label={`Option ${optionIndex + 1}`}
                        rules={[{ required: true, message: 'Please input the option!' }]}
                    >
                        <Input
                            value={option}
                            onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                            className="border rounded-md"
                        />
                    </Form.Item>
                ))}
            </div>
        ));
    };

    const renderModuleFields = () => {
        return modules.map((module, index) => (
            <div key={index} className="mb-4 p-4 bg-white shadow-lg rounded-lg border border-gray-300">
                <Form.Item
                    label={`Module ${index + 1} Title`}
                    rules={[{ required: true, message: 'Please input the module title!' }]}
                >
                    <Input
                        value={module.title}
                        onChange={(e) => handleModuleChange(index, 'title', e.target.value)}
                        className="border rounded-md"
                    />
                </Form.Item>
                <Form.Item
                    label="Content"
                    rules={[{ required: true, message: 'Please input the module content!' }]}
                >
                    <Input.TextArea
                        value={module.content}
                        onChange={(e) => handleModuleChange(index, 'content', e.target.value)}
                        className="border rounded-md"
                    />
                </Form.Item>
                <Form.Item
                    label="Type"
                    rules={[{ required: true, message: 'Please select the module type!' }]}
                >
                    <Select
                        value={module.type}
                        onChange={(value) => handleModuleChange(index, 'type', value)}
                        className="border rounded-md"
                    >
                        <Option value="video">Video</Option>
                        <Option value="text">Text</Option>
                        <Option value="quiz">Quiz</Option>
                    </Select>
                </Form.Item>
            </div>
        ));
    };

    const renderModalContent = () => {
        const commonFormProps = {
            onFinish: handleCreate,
            className: 'p-6 bg-gray-50 rounded-lg shadow-lg'
        };

        switch (modalType) {
            case 'course':
                return (
                    <Form {...commonFormProps}>
                        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                            <Input className="border rounded-md" />
                        </Form.Item>
                        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                            <Input.TextArea className="border rounded-md" />
                        </Form.Item>
                        <Form.Item name="pricing" label="Pricing" rules={[{ required: true }]}>
                            <Select
                                value={pricingType}
                                onChange={handlePricingTypeChange}
                                className="border rounded-md"
                            >
                                <Option value="free">Free</Option>
                                <Option value="paid">Paid</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="isActive" label="Active">
                            <Checkbox
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="border rounded-md"
                            />
                        </Form.Item>
                        <Form.Item name="duration" label="Duration (hours)" rules={[{ required: true }]}>
                            <Input
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="border rounded-md"
                            />
                        </Form.Item>
                        <Form.Item name="date" label="Start Date">
                            <DatePicker
                                value={date ? moment(date) : null}
                                onChange={handleDateChange}
                                className="border rounded-md"
                            />
                        </Form.Item>
                        <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={addModule}
                            className="my-4 w-full border border-gray-300"
                        >
                            Add Module
                        </Button>
                        {renderModuleFields()}
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="bg-blue-500 text-white w-full">
                                Create Course
                            </Button>
                        </Form.Item>
                    </Form>
                );
            case 'workshop':
                return (
                    <Form {...commonFormProps}>
                        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                            <Input className="border rounded-md" />
                        </Form.Item>
                        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                            <Input.TextArea className="border rounded-md" />
                        </Form.Item>
                        <Form.Item name="pricing" label="Pricing" rules={[{ required: true }]}>
                            <Select
                                value={pricingType}
                                onChange={handlePricingTypeChange}
                                className="border rounded-md"
                            >
                                <Option value="free">Free</Option>
                                <Option value="paid">Paid</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="isActive" label="Active">
                            <Checkbox
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="border rounded-md"
                            />
                        </Form.Item>
                        <Form.Item name="duration" label="Duration (hours)" rules={[{ required: true }]}>
                            <Input
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="border rounded-md"
                            />
                        </Form.Item>
                        <Form.Item name="date" label="Start Date">
                            <DatePicker
                                value={date ? moment(date) : null}
                                onChange={handleDateChange}
                                className="border rounded-md"
                            />
                        </Form.Item>
                        <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={addModule}
                            className="my-4 w-full border border-gray-300"
                        >
                            Add Module
                        </Button>
                        {renderModuleFields()}
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="bg-blue-500 text-white w-full">
                                Create Workshop
                            </Button>
                        </Form.Item>
                    </Form>
                );
                case 'assignment':
                    return (
                        <Form {...commonFormProps}>
                            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                                <Input className="border rounded-md" />
                            </Form.Item>
                            <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                                <Input.TextArea className="border rounded-md" />
                            </Form.Item>
                            <Form.Item name="dueDate" label="Due Date" rules={[{ required: true }]}>
                                <DatePicker
                                    value={date ? moment(date) : null}
                                    onChange={handleDateChange}
                                    className="border rounded-md"
                                />
                            </Form.Item>
                            <Form.Item name="isActive" label="Active">
                                <Checkbox
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className="border rounded-md"
                                />
                            </Form.Item>
                            <Button
                                type="dashed"
                                icon={<PlusOutlined />}
                                onClick={addModule}
                                className="my-4 w-full border border-gray-300"
                            >
                                Add Module
                            </Button>
                            {renderModuleFields()}
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="bg-blue-500 text-white w-full">
                                    Create Assignment
                                </Button>
                            </Form.Item>
                        </Form>
                    );
                case 'quiz':
                    return (
                        <Form {...commonFormProps}>
                            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                                <Input className="border rounded-md" />
                            </Form.Item>
                            <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                                <Input.TextArea className="border rounded-md" />
                            </Form.Item>
                            <Form.Item name="isActive" label="Active">
                                <Checkbox
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className="border rounded-md"
                                />
                            </Form.Item>
                            <Button
                                type="dashed"
                                icon={<PlusOutlined />}
                                onClick={addQuestion}
                                className="my-4 w-full border border-gray-300"
                            >
                                Add Question
                            </Button>
                            {renderQuestionFields()}
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="bg-blue-500 text-white w-full">
                                    Create Quiz
                                </Button>
                            </Form.Item>
                        </Form>
                    );
                default:
                    return null;
            }
        };
    
        return (
            <div className="p-6">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                    </div>
                ) : (
                    <>
                    <Alert type={alert.type} message={alert.message}/>
                    <Card
                        title={userData.username}
                        extra={
                            <Tooltip title="Edit Bio">
                                <Button shape="circle" icon={<EditOutlined />} onClick={handleBioEdit} />
                            </Tooltip>
                        }
                    >
                        <p>{isEditingBio ? (
                            <>
                                <Input.TextArea
                                    value={newBio}
                                    onChange={(e) => setNewBio(e.target.value)}
                                    className="mb-2"
                                />
                                <Button type="primary" onClick={handleBioSave} className="mr-2">
                                    Save
                                </Button>
                                <Button onClick={handleBioCancel}>
                                    Cancel
                                </Button>
                            </>
                        ) : userData.bio || "No bio available"}</p>
                    </Card>
                    </>

                )}
                <List
                    grid={{ gutter: 16, column: 4 }}
                    dataSource={[
                        { type: 'course', icon: <BookOutlined />, text: 'Create Course' },
                        { type: 'workshop', icon: <BookOutlined />, text: 'Create Workshop' },
                        { type: 'assignment', icon: <BookOutlined />, text: 'Create Assignment' },
                        { type: 'quiz', icon: <BookOutlined />, text: 'Create Quiz' },
                    ]}
                    renderItem={item => (
                        <List.Item>
                            <Card
                                hoverable
                                onClick={() => showModal(item.type)}
                                actions={[<PlusOutlined key="add" />]}
                            >
                                <Card.Meta
                                    avatar={<Avatar icon={item.icon} />}
                                    title={item.text}
                                />
                            </Card>
                        </List.Item>
                    )}
                />
                <Modal
                    visible={isModalVisible}
                    title={`Create ${modalType}`}
                    onCancel={handleCancel}
                    footer={null}
                >
                    {renderModalContent()}
                </Modal>
            </div>
        );
    };
    
    export default TeacherProfile;
    