// src/components/Course.js
import React, { useState } from 'react';
import { Card, Avatar, Rate, Tag, Tooltip, Button, Select, Checkbox } from 'antd';
import { VideoCameraOutlined, FileTextOutlined, QuestionCircleOutlined, UserOutlined } from '@ant-design/icons';
import useGetCourses from './hooks/useGetCourse';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const { Option } = Select;

// Dummy data to represent courses

const Course = () => {
    const { courses, loading, error } = useGetCourses("courses");
    const { videos, SetVideos} = useState([]);
    const [selectedPrice, setSelectedPrice] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [userData, setUserData] = useState([]);
    const loggedInUser= useSelector(state=>state.user)
    const getEnrolledCourses = () => {
        fetch(`${import.meta.env.VITE_HOST}/api/courses/enrolled`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${loggedInUser.token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            setUserData(data); 
        })
        .catch(error => {
            console.error('Error:', error);
            setLoading(false); // Set loading to false even on error
            SetAlert({type:"error",message:"Got Error During Retriving Your Courses"})
        });
    };
useEffect(()=>{
    setFilteredCourses(courses)
    console.log(courses)
    console.log(loggedInUser)
},[courses])    

useEffect(()=>{
    getEnrolledCourses()
},[])

    const handlePriceFilterChange = (value) => {
        setSelectedPrice(value);
        applyFilters(value, selectedCategory);
    };

    const handleCategoryFilterChange = (value) => {
        setSelectedCategory(value);
        applyFilters(selectedPrice, value);
    };

    const applyFilters = (price, category) => {
        let updatedCourses = courses;

        if (price !== "all") {
            updatedCourses = updatedCourses.filter(course => course.pricing.type === price);
        }

        if (category !== "all") {
            updatedCourses = updatedCourses.filter(course => course.category === category);
        }

        setFilteredCourses(updatedCourses);
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Available Courses</h1>
                
                {/* Filter Bar */}
                <div className="mb-8 flex justify-center space-x-4">
                    <Select
                        value={selectedPrice}
                        onChange={handlePriceFilterChange}
                        className="w-48"
                        placeholder="Filter by Price"
                    >
                        <Option value="all">All</Option>
                        <Option value="free">Free</Option>
                        <Option value="one-time">One-Time Payment</Option>
                        <Option value="subscription">Subscription</Option>
                    </Select>
                    
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCourses.length===0?<h1 className="text-4xl font-bold text-center text-gray-800 mb-8 m-auto">Courses Not Found</h1>:""}
                    {filteredCourses.map((course, index) => (
                        <Card
                            key={index}
                            hoverable
                            className="p-6 rounded-lg shadow-lg bg-white"
                            cover={
                                <img
                                    alt={course.title}
                                    src={`https://ideogram.ai/assets/image/lossless/response/SK58qykcQ8uSAsRHLUjm_A`}
                                    className="rounded-t-lg"
                                />
                            }
                        >
                            <div className="flex items-center mb-4">
                                <Avatar src={course.instructor.avatar} size={50} className="mr-4" />
                                <div>
                                    <h3 className="text-xl font-semibold">{course.title}</h3>
                                    <p className="text-gray-600">{course.instructor.name}</p>
                                </div>
                            </div>
                            <p className="text-gray-700 mb-4">{course.description}</p>

                            {/* Modules Section */}
                            <div className="mb-4">
                                <h4 className="text-lg font-semibold mb-2">Modules</h4>
                                <div className="space-y-2">
                                    {course.modules.map((module, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center space-x-2 bg-yellow-50 p-3 rounded-lg shadow-sm"
                                        >
                                            {module.type === "video" && (
                                                <VideoCameraOutlined className="text-yellow-500" />
                                            )}
                                            {module.type === "text" && (
                                                <FileTextOutlined className="text-yellow-500" />
                                            )}
                                            {module.type === "quiz" && (
                                                <QuestionCircleOutlined className="text-yellow-500" />
                                            )}
                                            <Tooltip title={module.content}>
                                                <span className="text-gray-800 font-medium">
                                                    {module.title}
                                                </span>
                                            </Tooltip>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pricing Section */}
                            <div className="mb-4">
                                <Tag color={course.pricing.type === "free" ? "green" : "blue"}>
                                    {course.pricing.type === "free"
                                        ? "Free"
                                        : `$${course.pricing.amount}`}
                                </Tag>
                            </div>

                            {/* Ratings Section */}
                            <div className="flex items-center justify-between mb-4">
                                <Rate
                                    disabled
                                    defaultValue={
                                        course.ratings.reduce((acc, rating) => acc + rating.rating, 0) /
                                        course.ratings.length
                                    }
                                />
                                <span className="text-gray-600">
                                    ({course.ratings.length} reviews)
                                </span>
                            </div>

                            {/* Enrollment Count */}
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">
                                    <UserOutlined /> {course.enrollmentCount} Enrolled
                                </span>
                                {console.log(userData)}
                                {console.log(course._id)}

                                {userData.length?userData.includes(course._id)? <Button
                                type="primary"
                            >
                                <Link to={`/user/access/${course._id}`}>Study Area</Link>
                            </Button>:
                                <Button
                                    type="primary"
                                    style={{ backgroundColor: "#ED9455", borderColor: "#ED9455" }}
                                >
                                    <Link to={`/course/${course._id}`}>Enroll Now</Link>
                                </Button>:<Button
                                    type="primary"
                                    style={{ backgroundColor: "#ED9455", borderColor: "#ED9455" }}
                                >
                                    <Link to={`/course/${course._id}`}>Enroll Now</Link>
                                </Button>
                                }
                               
                                
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Course;
