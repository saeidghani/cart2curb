import React from 'react';
import App from 'next/app';

import cookie from 'cookie';

import '../styles/less/index.less';
import '../styles/scss/global.scss';
import AppProvider from "../providers/AppProvider";
import Layout from "../components/Layout";
import RouterChanger from "../components/RouteChanger";

class MyApp extends App {
    render() {

        const { Component, pageProps, authenticated, userType } = this.props;
        const forceLayout = pageProps.hasOwnProperty('forceLayout') ? pageProps.forceLayout : false;
        return (
            <AppProvider authenticated={authenticated} userType={userType}>
                <RouterChanger/>
                <Layout style={{ background: 'white' }} forceLayout={forceLayout}>
                    <Component {...pageProps} />
                </Layout>
            </AppProvider>
        )
    }
}

MyApp.getInitialProps = async (appContext) => {
    let authenticated = false;
    let userType = null;
    const request = appContext.ctx.req;
    if (request) {
        request.cookies = cookie.parse(request.headers.cookie || '');
        authenticated = !!request.cookies.token;
        userType = request.cookies.type;
        console.log('token', request.cookies.token);
    }

    // Call the page's `getInitialProps` and fill `appProps.pageProps`
    const appProps = await App.getInitialProps(appContext);

    return { ...appProps, authenticated, userType };
};

export default MyApp
