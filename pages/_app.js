import React from 'react';

import '../styles/less/index.less';
import '../styles/scss/global.scss';
import AppProvider from "../providers/AppProvider";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }) {
    return (
        <AppProvider>
            <Layout style={{ background: 'white' }}>
                <Component {...pageProps} />
            </Layout>
        </AppProvider>
    )
}

export default MyApp
