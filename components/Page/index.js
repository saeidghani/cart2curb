import React from 'react';
import {Breadcrumb} from "antd";
import Link from 'next/link';
import Head from "next/head";

const Page = props => {
    return (
        <div className="page md:pb-15 pb-12">
            <Head>
                <title>{props.headTitle || props.title ? `${props.headTitle || props.title} - ` : ''}{process.env.NEXT_PUBLIC_APP_TITLE}</title>
            </Head>
            <Breadcrumb separator=">" className={`pt-8 pb-15 text-xs text-${props.breadcrumbColor || 'paragraph'}`}>
                {props.hasHome && (
                    <Breadcrumb.Item>
                        <Link href={'/'}>
                            Home
                        </Link>
                    </Breadcrumb.Item>
                )}
                {props.breadcrumb && props.breadcrumb.map(item => {
                    return item.href ? (
                        <Breadcrumb.Item key={item.title + '-breadcrumb'} className={`text-${props.breadcrumbColor || 'paragraph'}\``}>
                            <Link href={{pathname: item?.href, query: item?.query || ''}}>
                                {item.title}
                            </Link>
                        </Breadcrumb.Item>
                    ) : (
                        <Breadcrumb.Item key={item.title + '-breadcrumb'} className={`text-${props.breadcrumbColor || 'paragraph'}\``}>{item.title}</Breadcrumb.Item>
                    );
                })}
            </Breadcrumb>
            {props.title && (<h1 className="page__title text-2xl text-type mb-8 font-medium mt-0">{props.title}</h1>)}
            <div className="page__content">
                {props.children}
            </div>
        </div>
    )
}

export default Page;