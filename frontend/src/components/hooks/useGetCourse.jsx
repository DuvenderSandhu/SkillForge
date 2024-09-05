import { useState, useEffect } from 'react';

// Custom Hook: useGetCourses
const useGetCourses = (type) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchCourses = async () => {
      try {
        setLoading(true);

        // Replace with your actual API endpoint to get all courses
        const response = await fetch(`${import.meta.env.VITE_HOST}/api/${type}`, { signal });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setCourses(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();

    return () => {
      controller.abort(); // Cleanup function to abort the fetch request if needed
    };
  }, []);

  return { courses, loading, error };
};

export default useGetCourses;
