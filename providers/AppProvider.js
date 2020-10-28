import React from 'react';
import { ConfigProvider } from 'antd';
import StoreProvider from "./StoreProvider";
import {AuthProvider} from "./AuthProvider";


const AppProvider = ({ children, authenticated }) => {
    return (
        <AuthProvider authenticated={authenticated}>
            <StoreProvider>
                <ConfigProvider>
                    {children}
                </ConfigProvider>
            </StoreProvider>
        </AuthProvider>
    );
}

export default AppProvider;