import React from 'react';
import Head from "next/head";

const DriverPage = props => {
    return (
        <div className="page md:pb-15 pb-12">
            <Head>
                <title>{props.headTitle || props.title ? `${props.headTitle || props.title} - ` : ''}{process.env.NEXT_PUBLIC_APP_TITLE}</title>
            </Head>
            {props.title && (<h1 className={`page__title text-2xl text-type mb-8 font-medium mt-0 ${props.titleClassName || ''}`}>{props.title}</h1>)}
            <div className="page__content">
                {props.children}
            </div>
        </div>
    )
}

export default DriverPage;