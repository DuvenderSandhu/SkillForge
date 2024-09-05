import React, { useState, useEffect } from 'react';
import { CloseOutlined } from '@ant-design/icons';

const Alert = ({ type, message }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 5000);

        return () => clearTimeout(timer); // Clean up the timer
    }, []);

    if (!visible) return null;

    const alertStyles = {
        base: 'flex items-center justify-between p-4 mb-4 rounded-md shadow-md',
        success: 'bg-green-100 border border-green-400 text-green-700',
        error: 'bg-red-100 border border-red-400 text-red-700',
    };

    return (
        <div className={`${alertStyles.base} ${type === 'success' ? alertStyles.success : alertStyles.error} sticky top-20 z-10 `}>
            <span>{message}</span>
            <button onClick={() => setVisible(false)} className="focus:outline-none">
                <CloseOutlined className="text-lg cursor-pointer" />
            </button>
        </div>
    );
};

export default Alert;
