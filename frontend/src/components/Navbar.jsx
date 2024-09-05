// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Menu, Dropdown, Avatar, Button, Drawer } from 'antd';
import { MenuOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOutUser, setUser } from '../state/UserToken';

const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            dispatch(setUser({ token }));
            setIsAuthenticated(true);
        }
        console.log(user)
    }, [dispatch]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch(logOutUser());
        setIsAuthenticated(false);
        navigate('/user/login');
    };

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const profileMenu = (
        <Menu>
            <Menu.Item key="profile">
                <Link to="/user/profile">
                    <UserOutlined /> Profile
                </Link>
            </Menu.Item>
            <Menu.Item key="logout" onClick={handleLogout}>
                <LogoutOutlined /> Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <nav className="bg-white sticky top-0 z-10 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-gray-800">
                    MyApp
                </Link>
                <div className="hidden md:flex space-x-6 items-center">
                    <Link to="/" className="text-gray-700 hover:text-[#ED9455]">
                        Home
                    </Link>
                    <Link to="/course/courses" className="text-gray-700 hover:text-[#ED9455]">
                        Courses
                    </Link>
                    <Link to="/workshop/workshop" className="text-gray-700 hover:text-[#ED9455]">
                        Workshop
                    </Link>
                    <Link to="/assignment/assignment" className="text-gray-700 hover:text-[#ED9455]">
                    Assignment
                    </Link>
                    <Link to="/quiz/quiz" className="text-gray-700 hover:text-[#ED9455]">
                    Quiz
                    </Link>
                    <Link to="/quiz/quiz" className="text-gray-700 hover:text-[#ED9455]">
                    Quiz
                    </Link>
                    <Link to="/about" className="text-gray-700 hover:text-[#ED9455]">
                        About
                    </Link>
                    <Link to="/user/profile" className="text-gray-700 hover:text-[#ED9455]">
                        Profile
                    </Link>
                    <Link to="/user/taccess" className="text-gray-700 hover:text-[#ED9455]">
                        Teacher Video
                    </Link>
                    {user.token ? (
                        <Dropdown overlay={profileMenu} trigger={['hover']}>
                            <Avatar
                                style={{ cursor: 'pointer', backgroundColor: '#ED9455' }}
                                icon={<UserOutlined />}
                                size="large"
                            />
                        </Dropdown>
                    ) : (
                        <div className="space-x-4">
                            <Link to="/user/login" onClick={onClose}>
                                <Button type="primary" style={{ backgroundColor: "#ED9455", borderColor: "#ED9455" }}>
                                    Login
                                </Button>
                            </Link>
                            <Link to="/user/register" onClick={onClose}>
                                <Button type="default" style={{ borderColor: "#FFBB70", color: "#FFBB70" }}>
                                    Register
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
                <div className="md:hidden">
                    <Button
                        type="text"
                        icon={<MenuOutlined />}
                        onClick={showDrawer}
                    />
                </div>
                <Drawer
                    title="Menu"
                    placement="right"
                    closable={false}
                    onClose={onClose}
                    visible={visible}
                >
                    <Link to="/" className="block mb-2" onClick={onClose}>
                        Home
                    </Link>
                    <Link to="/course/courses" className="block mb-2" onClick={onClose}>
                        Courses
                    </Link>
                    <Link to="/about" className="block mb-2" onClick={onClose}>
                        About
                    </Link>
                    <Link to="/user/profile" className="block mb-2" onClick={onClose}>
                        Profile
                    </Link>
                    {user.token ? (
                        <Dropdown overlay={profileMenu} trigger={['hover']}>
                            <Avatar
                                style={{ cursor: 'pointer', backgroundColor: '#ED9455' }}
                                icon={<UserOutlined />}
                                size="large"
                            />
                        </Dropdown>
                    ) : (
                        <div className="mt-4 space-x-4">
                            <Link to="/user/login" onClick={onClose}>
                                <Button type="primary" style={{ backgroundColor: "#ED9455", borderColor: "#ED9455" }}>
                                    Login
                                </Button>
                            </Link>
                            <Link to="/user/register" onClick={onClose}>
                                <Button type="default" style={{ borderColor: "#FFBB70", color: "#FFBB70" }}>
                                    Register
                                </Button>
                            </Link>
                        </div>
                    )}
                </Drawer>
            </div>
        </nav>
    );
};

export default Navbar;
