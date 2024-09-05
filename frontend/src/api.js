async function  fetchCourseData(courseID){
    try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/api/courses/course/${courseID}`);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something Went Wrong');
            }
            return data

            
        } catch (error) {
            return {response:'notok',error};
        }
}

export default fetchCourseData