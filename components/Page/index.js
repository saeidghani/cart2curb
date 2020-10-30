import React from 'react';
import {Breadcrumb} from "antd";
import Link from 'next/link';

const Page = props => {
    return (
        <div className="page md:pb-15 pb-12">
            <Breadcrumb separator=">" className={'pt-8 pb-15 text-xs text-paragraph'}>
                {props.hasHome && (
                    <Breadcrumb.Item>
                        <Link href={'/'}>
                            Home
                        </Link>
                    </Breadcrumb.Item>
                )}
                {props.breadcrumb && props.breadcrumb.map(item => {
                    return item.href ? (
                        <Breadcrumb.Item key={item.title + '-breadcrumb'} className={'text-paragraph'}>
                            <Link href={item.href}>
                                {item.title}
                            </Link>
                        </Breadcrumb.Item>
                    ) : (
                        <Breadcrumb.Item key={item.title + '-breadcrumb'} className={'text-paragraph'}>{item.title}</Breadcrumb.Item>
                    );
                })}
            </Breadcrumb>
            {props.title && (<h1 className="page__title text-2xl text-label mb-8 font-medium mt-0">{props.title}</h1>)}
            <div className="page__content">
                {props.children}
            </div>
        </div>
    )
}

export default Page;