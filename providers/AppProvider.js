import React from 'react';
import { ConfigProvider } from 'antd';
import StoreProvider from "./StoreProvider";
import {AuthProvider} from "./AuthProvider";


const AppProvider = ({ children, authenticated, userType }) => {
    return (
        <AuthProvider authenticated={authenticated} type={userType}>
            <StoreProvider>
                <ConfigProvider>
                    {children}
                </ConfigProvider>
            </StoreProvider>
        </AuthProvider>
    );
}

export default AppProvider;