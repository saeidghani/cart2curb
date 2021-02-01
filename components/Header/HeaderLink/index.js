import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const HeaderLink = (props) => {
    const { asPath } = useRouter()

    const isActive = asPath === props.href || asPath === props.as;

    const anchorClassName = isActive  ? 'text-red-500 border-b-2 border-solid border-red-500' : 'text-header'

    return (
        <Link className={'header__link'} {...props}>
            <a className={`${anchorClassName} hover:text-red-500 cursor-pointer font-medium ${props.hasPadding && 'lg:ml-15.5 md:ml-10 sm:ml-8 ml-4'}`}>{props.children}</a>
        </Link>
    )
}

export default HeaderLink;