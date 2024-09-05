import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';  
import Alert from '../Alert';
import Loader from '../Loader';

const TeacherUploadVideo = () => {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [courses, setCourses] = useState([]);
    const [videoTitle, setVideoTitle] = useState('');
    const [alert, setAlert] = useState(false);
    const [loader, setLoader] = useState(false);
    const [videoDescription, setVideoDescription] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState('');
    const user= useSelector(state=>state.user)
    const navigate= useNavigate()
    
    useEffect(()=>{
        try {
            setLoader(true)
            fetch(`${import.meta.env.VITE_HOST}/api/courses/teacher`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if(data.success){
                  setCourses(data.data)
                  setLoader()
                }
                else{
                    console.log(data)
                    setAlert({type:"error", message:data.error||"Something Went Wrong During Fetching Courses"})
                    setLoader(false)

                }
            })
            .catch(error => {
              setAlert({type:"error", message:data.error||"Something Went Wrong During Fetching Courses"})
                
            });
        
        } catch (error) {
          setError('Failed to enroll in the course.');
        }
    },[user])
  
    
    const handleCourseChange = (e) => {
        setSelectedCourse(e.target.value);
    };

    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        setVideoFile(file);

    };
    

    const handleAddVideo = () => {
        if (!selectedCourse || !videoTitle || !videoFile) {
            setAlert('Please select a course and fill in all video details.');
            return;
        }

        // Your logic to handle the video file and its association with the course
        const formData = new FormData();
        console.log(selectedCourse)
        formData.append('course', selectedCourse);
        formData.append('title', videoTitle);
        formData.append('description', videoDescription);
        formData.append('file', videoFile);

        try {
            setLoader(true)
            const response = fetch(`${import.meta.env.VITE_HOST}/api/videos/create`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${user.token}`,
            },
              body: formData,
            }).then(response=>response.json()).then(function (data){
                if (response.success) {
                    setLoader(false)
                    setAlert({type:"success",message:"File Uploaded Successfully"})
                } else {
                    setLoader(false)
                    setAlert({type:"error",message:"File Uploaded Failed"})
                      
                  }
            })
            
        } catch (error) {
              setAlert({type:"error",message:"Error occurred during file upload."})
          }

        // // Clear form after submission
        // setSelectedCourse('');
        // setVideoTitle('');
        // setVideoDescription('');
        // setVideoFile(null);
        // setVideoPreview('');
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
            
            {alert?<Alert type={alert.type} message={alert.message}/>:""}
            {loader?<Loader/>:""}
            <h2 className="text-2xl font-bold mb-6">Add Video to Course</h2>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Course
                </label>
                <select
                    value={selectedCourse}
                    onChange={handleCourseChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="">-- Select a Course --</option>
                    {courses.map((course) => (
                        <option key={course._id} value={course._id}>
                            {course.title}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Title
                </label>
                <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Description
                </label>
                <textarea
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Video
                </label>
                <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
            </div>

            {videoPreview && (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Video Preview
                    </label>
                    <video controls src={videoPreview} className="w-full"></video>
                </div>
            )}

            <button
                onClick={handleAddVideo}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
                Add Video
            </button>
        </div>
    );
};

export default TeacherUploadVideo;



