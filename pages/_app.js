import React from 'react';

import '../styles/less/index.less';
import '../styles/scss/global.scss';
import AppProvider from "../providers/AppProvider";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }) {
    const forceLayout = pageProps.hasOwnProperty('forceLayout') ? pageProps.forceLayout : false;
    return (
        <AppProvider>
            <Layout style={{ background: 'white' }} forceLayout={forceLayout}>
                <Component {...pageProps} />
            </Layout>
        </AppProvider>
    )
}

export default MyApp
