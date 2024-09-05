import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, Avatar, List, Tag, Button, Progress, Modal, Form, Input, Upload, Spin } from 'antd';
import { EditOutlined, BookOutlined, TrophyOutlined, SettingOutlined, UploadOutlined } from '@ant-design/icons';
import Alert from './Alert';
import { setUser as setUserAction } from '../state/UserToken';

const Profile = () => {
    const loggedInUser = useSelector(state => state.user);
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true); // Add a loading state
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingPicture, setIsEditingPicture] = useState(false);
    const [alert, SetAlert] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();

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
            setUserData(data.data);
            console.log(data.data.username)
            setLoading(false); // Set loading to false after data is fetched
        })
        .catch(error => {
            console.error('Error:', error);
            setLoading(false); // Set loading to false even on error
        });
    };



    useEffect(() => {
        if (loggedInUser.token) {
            fetchData();
            // getEnrolledCourses()
        } else {
            navigate('/user/login');
        }
    }, []);

    const handleEditBio = (values) => {
        // Make API call to update bio here
        setUserData({ ...userData, bio: values.bio });
        setIsEditing(false);
    };

    const handleEditProfilePicture = ({ file }) => {
        // Make API call to update profile picture here
        // Simulate successful upload and update state
        setUserData({ ...userData, profilePicture: URL.createObjectURL(file.originFileObj) });
        setIsEditingPicture(false);
    };

    return (
        <div className="container mx-auto p-4">
            {loading ? (
                <div className="text-center mt-20">
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    {alert.type?<Alert type={alert.type} message={alert.message}/>:""}
                    {/* Hero Section */}
                    <div className="relative bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 rounded-lg shadow-lg mb-8 p-8 text-center text-white">
                        <Avatar
                            src={userData.profilePicture||""}
                            size={120}
                            className="border-4 border-white"
                            style={{ boxShadow: '0 0 20px rgba(0,0,0,0.3)' }}
                        />
                        <h1 className="text-4xl font-bold mt-4">{userData.username}</h1>
                        <p className="text-lg mt-2">{userData.email}</p>
                        <p className="mt-4 italic">{userData.bio}</p>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => setIsEditingPicture(true)}
                            style={{ marginTop: '10px', backgroundColor: "#00BFFF", borderColor: "#00BFFF" }}
                        >
                            Edit Profile Picture
                        </Button>
                    </div>

                    {/* Profile Details Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Enrolled Courses Section */}
                        <Card
                            title="Enrolled Courses"
                            bordered={false}
                            hoverable
                            className="shadow-lg"
                            extra={<BookOutlined style={{ color: '#00BFFF' }} />}
                        >
                            <List
                                dataSource={userData.enrolledCourses}
                                renderItem={course => (
                                    <List.Item>
                                        <Progress
                                            type="circle"
                                            percent={50} // Placeholder for progress
                                            width={50}
                                            status="active"
                                            format={percent => `${percent}%`}
                                            style={{ marginRight: '8px' }}
                                        />
                                        {course}
                                    </List.Item>
                                )}
                            />
                        </Card>

                        {/* Completed Courses Section */}
                        <Card
                            title="Completed Courses"
                            bordered={false}
                            hoverable
                            className="shadow-lg"
                            extra={<BookOutlined style={{ color: '#FFD700' }} />}
                        >
                            <List
                                dataSource={userData.completedCourses}
                                renderItem={course => (
                                    <List.Item>
                                        <TrophyOutlined style={{ marginRight: '8px', color: '#FFD700' }} />
                                        {course}
                                    </List.Item>
                                )}
                            />
                        </Card>

                        {/* Certifications Section */}
                        <Card
                            title="Certifications"
                            bordered={false}
                            hoverable
                            className="shadow-lg"
                            extra={<TrophyOutlined style={{ color: '#FFBB70' }} />}
                        >
                            <List
                                dataSource={userData.certifications}
                                renderItem={certification => (
                                    <List.Item>
                                        <BookOutlined style={{ marginRight: '8px', color: '#FFBB70' }} />
                                        {certification}
                                    </List.Item>
                                )}
                            />
                        </Card>

                        {/* Skills Section */}
                        <Card
                            title="Skills"
                            bordered={false}
                            hoverable
                            className="shadow-lg"
                            extra={<SettingOutlined style={{ color: '#00BFFF' }} />}
                        >
                            {userData?.skills?.length ? userData.skills.map(skill => (
                                <Tag color="blue" key={skill} className="text-lg">
                                    {skill}
                                </Tag>
                            )) : ""}
                        </Card>
                    </div>

                    {/* Edit Profile Button */}
                    <div className="text-center mt-8">
                        <Button
                            type="primary"
                            size="large"
                            icon={<EditOutlined />}
                            style={{ backgroundColor: "#00BFFF", borderColor: "#00BFFF" }}
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Profile
                        </Button>
                    </div>

                    {/* Modal for Editing Bio */}
                    <Modal
                        title="Edit Bio"
                        visible={isEditing}
                        onCancel={() => setIsEditing(false)}
                        footer={null}
                    >
                        <Form
                            layout="vertical"
                            onFinish={handleEditBio}
                        >
                            <Form.Item
                                label="Bio"
                                name="bio"
                                initialValue={userData.bio}
                                rules={[{ required: true, message: 'Please enter your bio!' }]}
                            >
                                <Input.TextArea rows={4} />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" block>
                                    Save
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>

                    {/* Modal for Editing Profile Picture */}
                    <Modal
                        title="Edit Profile Picture"
                        visible={isEditingPicture}
                        onCancel={() => setIsEditingPicture(false)}
                        footer={null}
                    >
                        <Upload
                            name="profilePicture"
                            showUploadList={false}
                            customRequest={handleEditProfilePicture}
                            accept="image/*"
                        >
                            <Button icon={<UploadOutlined />} block>
                                Upload New Picture
                            </Button>
                        </Upload>
                    </Modal>
                </>
            )}
        </div>
    );
};

export default Profile;
