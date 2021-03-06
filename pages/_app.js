import React from 'react';
import App from 'next/app';

import cookie from 'cookie';

// import '../styles/less/index2.less';
import AppProvider from "../providers/AppProvider";
import Layout from "../components/Layout";
import RouterChanger from "../components/RouteChanger";
import {getStore} from "../states";
import Head from "next/head";
import NProgress from "../components/NProgress/index";
import MessageHandler from "../components/MessageHandler";
import '../styles/less/index2.less';

class MyApp extends App {
    render() {

        const { Component, pageProps, authenticated, userType, avatar } = this.props;
        const forceLayout = pageProps.hasOwnProperty('forceLayout') ? pageProps.forceLayout : false;
        return (
            <div id="top">
            <AppProvider authenticated={authenticated} userType={userType}>
                <Head>
                    <link rel="stylesheet" type="text/css" charSet="UTF-8"
                          href="/styles/main.css"/>
                </Head>
                <RouterChanger/>
                <MessageHandler/>
                <NProgress/>
                <Layout style={{ background: 'white' }} forceLayout={forceLayout} avatar={avatar}>
                    <Component {...pageProps} />
                </Layout>
            </AppProvider>
            </div>
        )
    }
}

MyApp.getInitialProps = async (appContext) => {
    const store = getStore();
    let authenticated = false;
    let userType = null;
    let avatar = '';
    const request = appContext.ctx.req;
    if (request) {
        request.cookies = cookie.parse(request.headers.cookie || '');
        authenticated = !!request.cookies.token;
        userType = request.cookies.type;

        if(authenticated) {
            let config = {
                headers: {
                    Authorization: `Bearer ${request.cookies.token}`
                }
            }
            if(userType === 'customer') {
                const res = await store.dispatch.profile.getProfile(config);
                if(res) {
                    avatar = res.image;
                }
            } else if(userType === 'vendor') {
                const res = await store.dispatch.vendorProfile.getProfile(config);
                if(res) {
                    avatar = res.image;
                }
            }
        }
    }

    // Call the page's `getInitialProps` and fill `appProps.pageProps`
    const appProps = await App.getInitialProps(appContext);

    return { ...appProps, authenticated, userType, avatar };
};

export default MyApp
