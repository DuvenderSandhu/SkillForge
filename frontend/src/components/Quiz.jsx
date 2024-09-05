import React, { useState, useEffect } from 'react';
import { Card, Avatar, Rate, Tag, Tooltip, Button, Select, Spin, Alert } from 'antd';
import { VideoCameraOutlined, FileTextOutlined, QuestionCircleOutlined, UserOutlined } from '@ant-design/icons';
import useGetCourses from './hooks/useGetCourse';

const { Option } = Select;

const Quiz = () => {
    const { courses = [], loading, error } = useGetCourses("quizzes");
    const [selectedPrice, setSelectedPrice] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [filteredCourses, setFilteredCourses] = useState([]);

    useEffect(() => {
        applyFilters(selectedPrice, selectedCategory);
    }, [courses, selectedPrice, selectedCategory]);

    const handlePriceFilterChange = (value) => {
        setSelectedPrice(value);
    };

    const handleCategoryFilterChange = (value) => {
        setSelectedCategory(value);
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

    if (loading) {
        return <Spin size="large" className="flex justify-center items-center min-h-screen" />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <Alert message="Error" description="There was an error fetching the quizzes." type="error" showIcon />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Available Quiz</h1>
                
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
                    {filteredCourses.length === 0 && (
                        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 m-auto">Quiz Not Found</h1>
                    )}
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
                                <Button
                                    type="primary"
                                    style={{ backgroundColor: "#ED9455", borderColor: "#ED9455" }}
                                >
                                    Enroll Now
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Quiz;
