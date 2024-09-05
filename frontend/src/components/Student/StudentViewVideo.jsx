import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Card, List, Typography, Skeleton, Tag, Button, Tooltip, message, Empty } from 'antd';
import { PlayCircleOutlined, EyeOutlined, LikeOutlined, CommentOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const StudentViewVideo = () => {
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.user);
    const videoRef = useRef(null);
    const { courseID } = useParams();

    useEffect(() => {
        try {
            fetch(`${import.meta.env.VITE_HOST}/api/videos/${courseID}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    const videosData = Array.isArray(data.data) ? data.data : [];
                    setVideos(videosData);
                    setSelectedVideo(videosData[0] || null);
                } else {
                    message.error('Failed to load videos.');
                }
            })
            .catch(error => {
                console.log(error);
                message.error('An error occurred while fetching videos.');
            })
            .finally(() => setLoading(false));
        } catch (error) {
            console.log(error);
            message.error('An unexpected error occurred.');
        }
    }, [courseID, user.token]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
        }
    }, [selectedVideo]);

    const handleVideoSelection = (video) => {
        setSelectedVideo(video);
    };

    return (
        <div className="flex flex-col sm:flex-row p-4 sm:p-8 bg-gray-50 min-h-screen">
            <div className="w-full sm:w-2/3 order-2 sm:order-1 p-4">
                <Card
                    loading={loading}
                    className="shadow-lg rounded-lg"
                    cover={
                        selectedVideo ? (
                            <video
                                key={selectedVideo.id}
                                ref={videoRef}
                                controls
                                className="w-full h-64 sm:h-96 rounded-t-lg"
                            >
                                <source src={selectedVideo.videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            !loading && <Empty description="No Video Selected" />
                        )
                    }
                >
                    {selectedVideo ? (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <Title level={3} className="mb-0">
                                    {selectedVideo.title}
                                </Title>
                                <div className="flex space-x-2">
                                    <Tooltip title="Views">
                                        <Button icon={<EyeOutlined />} type="text">{selectedVideo.views}</Button>
                                    </Tooltip>
                                    <Tooltip title="Likes">
                                        <Button icon={<LikeOutlined />} type="text">{selectedVideo.likes}</Button>
                                    </Tooltip>
                                    <Tooltip title="Comments">
                                        <Button icon={<CommentOutlined />} type="text">{selectedVideo.comments.length}</Button>
                                    </Tooltip>
                                </div>
                            </div>
                            <Paragraph>
                                {selectedVideo.description}
                            </Paragraph>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {selectedVideo.tags.map((tag, index) => (
                                    <Tag key={index} color="blue">{tag}</Tag>
                                ))}
                            </div>
                        </>
                    ) : (
                        <Skeleton active />
                    )}
                </Card>
            </div>
            <div className="w-full sm:w-1/3 order-1 sm:order-2 mb-4 sm:mb-0">
                <Card title="Video List" className="shadow-lg rounded-lg overflow-hidden">
                    {videos.length > 0 ? (
                        <List
                            itemLayout="horizontal"
                            dataSource={videos}
                            renderItem={(video) => (
                                <List.Item
                                    onClick={() => handleVideoSelection(video)}
                                    className={`cursor-pointer hover:bg-gray-100 ${selectedVideo?.id === video.id ? 'bg-gray-200' : ''} rounded-lg p-2 transition-all`}
                                >
                                    <List.Item.Meta
                                        avatar={<PlayCircleOutlined className="text-2xl text-blue-500" />}
                                        title={<Typography.Text strong>{video.title}</Typography.Text>}
                                        description={<Typography.Text type="secondary">{video.description}</Typography.Text>}
                                    />
                                </List.Item>
                            )}
                        />
                    ) : (
                        <Empty description="No Videos Found Yet" />
                    )}
                </Card>
            </div>
        </div>
    );
};

export default StudentViewVideo;
