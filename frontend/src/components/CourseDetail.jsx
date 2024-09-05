import React, { useState, useEffect } from 'react';
import { Spin, List, Button } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import fetchCourseData from '../api.js'; // API utility for fetching data
import InstructorIcon from '../assets/instructor.svg'; // SVG for Instructor
import ModulesIcon from '../assets/modules.svg'; // SVG for Modules
import InfoIcon from '../assets/InfoIcon.svg'; // SVG for Additional Info
import { useSelector } from 'react-redux';
import Alert from './Alert.jsx';


const CourseDetail = () => {
  const [alert, setAlert] = useState({type:undefined,message:undefined});
  const [enroll, setEnroll] = useState(false);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user= useSelector(state=>state.user)
  const [isAuthenticated, setIsAuthenticated] = useState(false); // User authentication state
  const { courseID } = useParams(); // Extract courseID from URL params
  const navigate = useNavigate(); // To handle navigation
  const checkUserAuthentication = () => {
    // Replace this with actual authentication check
   if(user.token){
    setIsAuthenticated(true)
      // navigate('/user/profile')
   }
   else{
      navigate('/user/login')
   }
  };
  useEffect(() => {
    const getCourseDetails = async () => {
      try {
        const data = await fetchCourseData(courseID); // API call to fetch course data
        setCourse(data);

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Simulate user authentication check
    

    getCourseDetails();
  }, [courseID]);
  
  const handleEnrollNow = async () => {
    checkUserAuthentication();

      try {
        
          fetch(`${import.meta.env.VITE_HOST}/api/courses/enroll/${courseID}`, {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${user.token}`,
                  'Content-Type': 'application/json'
              }
          })
          .then(response => response.json())
          .then(data => {
              if(!data.error){
                setAlert({type:"success", message:data.message})
              }
              else{
                data.error=="User already enrolled in the course"?setEnroll(true):"";
            setAlert({type:"error", message:data.error||"Something Went Wrong"})
              }
          })
          .catch(error => {
            setAlert({type:"error", message:data.error||"Something Went Wrong"})
              
          });
      
      } catch (error) {
        setError('Failed to enroll in the course.');
      }
   
  };

  if (loading) return <Spin size="large" tip="Loading course details..." />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;
  if (!course) return <Alert message="No Data" description="No course data available" type="info" showIcon />;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-r from-blue-100 to-blue-50 shadow-2xl rounded-xl border border-gray-200">
      {alert.type?<Alert type={alert.type}  message={alert.message} />:""}
      <h2 className="text-4xl font-extrabold text-gray-900 mb-6">{course.title}</h2>
      <p className="text-lg text-gray-700 mb-8">{course.description}</p>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-4">
          <img src={InstructorIcon} alt="Instructor" className="w-8 h-8 mr-3" />
          <h3 className="text-2xl font-semibold text-gray-800">Instructor</h3>
        </div>
        <p className="text-xl text-gray-900 font-medium">{course.instructor}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-4">
          <img src={ModulesIcon} alt="Modules" className="w-8 h-8 mr-3" />
          <h3 className="text-2xl font-semibold text-gray-800">Modules</h3>
        </div>
        <List
          dataSource={course.modules}
          renderItem={module => (
            <List.Item className="mb-4">
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{module.title}</h4>
                <p className="text-gray-600">{module.content}</p>
              </div>
            </List.Item>
          )}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <img src={InfoIcon} alt="Additional Information" className="w-8 h-8 mr-3" />
          <h3 className="text-2xl font-semibold text-gray-800">Additional Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <p className="text-gray-800 font-medium">Status: <span className="font-semibold">{course.status}</span></p>
          <p className="text-gray-800 font-medium">Enrollment Count: <span className="font-semibold">{course.enrollmentCount}</span></p>
          <p className="text-gray-800 font-medium">Created At: <span className="font-semibold">{new Date(course.createdAt).toLocaleDateString()}</span></p>
          <p className="text-gray-800 font-medium">Updated At: <span className="font-semibold">{new Date(course.updatedAt).toLocaleDateString()}</span></p>
        </div>
      </div>

      <div className="text-center mt-8">
        <Button
          type="primary"
          size="large"
          className="bg-blue-600 text-white hover:bg-blue-700"
          onClick={handleEnrollNow}
          disabled={enroll}
        >
          {enroll?"Already Enrolled":"Enroll"}
        </Button>
      </div>
    </div>
  );
};

export default CourseDetail;
