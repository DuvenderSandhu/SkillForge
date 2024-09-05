// src/components/Loader.js
import React from 'react';
import { Spin } from 'antd';

const Loader = () => {
    return (
        <Spin spinning={true} className="m-auto" fullscreen={true} tip="Loading...">
            {/* Optionally, you can add a div or other content inside here if needed */}
        </Spin>
    );
};

export default Loader;
