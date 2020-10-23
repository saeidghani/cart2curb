import React from 'react';
import { ConfigProvider } from 'antd';

// @todo: add all providers here
const AppProvider = ({ children }) => {
    return (
        <ConfigProvider>
            {children}
        </ConfigProvider>
    );
}

export default AppProvider;