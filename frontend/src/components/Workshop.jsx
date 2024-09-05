import React, { useState, useEffect } from 'react';
import { Card, Avatar, Tag, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import useGetCourses from './hooks/useGetCourse'; // Ensure this is the correct path
import moment from 'moment';

const Workshop = () => {
    const { courses: workshops, loading, error } = useGetCourses("workshops");
    const [filteredWorkshops, setFilteredWorkshops] = useState([]);

    useEffect(() => {
        if (Array.isArray(workshops)) {
            setFilteredWorkshops(workshops);
        } else {
            setFilteredWorkshops([]); // Handle the case where workshops is not an array
        }
    }, [workshops]);

    if (loading) return <p className="text-center text-lg">Loading...</p>;
    if (error) return <p className="text-center text-lg text-red-600">Error: {error.message}</p>;

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="container mx-auto px-4">
                <h1 className="text-5xl font-bold text-center text-gray-900 mb-12">Upcoming Workshops</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredWorkshops.length === 0 ? (
                        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">No Workshops Available</h1>
                    ) : (
                        filteredWorkshops.map((workshop, index) => (
                            <Card
                                key={index}
                                hoverable
                                className="p-6 rounded-lg shadow-lg bg-white transition-transform transform hover:scale-105"
                                style={{ borderRadius: '16px', border: '1px solid #e5e7eb' }}
                            >
                                <div className="flex items-center mb-6">
                                    <Avatar size={60} className="mr-4 bg-blue-500 text-white">
                                        <UserOutlined />
                                    </Avatar>
                                    <div>
                                        <h3 className="text-2xl font-semibold text-gray-900">{workshop.title}</h3>
                                        <p className="text-gray-600">{workshop.instructor}</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-4">{workshop.description}</p>

                                {/* Date and Duration */}
                                <div className="flex flex-wrap mb-4 space-x-2">
                                    <Tag color="blue" className="text-white">
                                        {moment(workshop.date).format('MMMM Do YYYY, h:mm A')}
                                    </Tag>
                                    <Tag color="purple" className="text-white">
                                        Duration: {workshop.duration} mins
                                    </Tag>
                                </div>

                                {/* Status */}
                                <div className="mb-4">
                                    <Tag color={workshop.status === 'scheduled' ? 'green' : 'red'} className="text-white">
                                        {workshop.status.charAt(0).toUpperCase() + workshop.status.slice(1)}
                                    </Tag>
                                </div>

                                {/* Participants */}
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 flex items-center">
                                        <UserOutlined className="mr-2" /> {workshop.participants.length} Participants
                                    </span>
                                    <Button
                                        type="primary"
                                        style={{ backgroundColor: "#ED9455", borderColor: "#ED9455" }}
                                        className="transition-transform transform hover:scale-105"
                                    >
                                        Join Now
                                    </Button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Workshop;
