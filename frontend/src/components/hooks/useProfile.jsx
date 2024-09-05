// src/hooks/useProfile.js
import { useState, useEffect } from 'react';

const useProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching user data
        setTimeout(() => {
            setProfile({
                name: 'John Doe',
                email: 'john.doe@example.com',
                phone: '123-456-7890',
            });
            setLoading(false);
        }, 1000);
    }, []);

    return { profile, loading };
};

export default useProfile;
