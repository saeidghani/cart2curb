import React from 'react';
import Link from "next/link";

import {useIsCurrentRoute} from "../../../hooks/currentRoute";

const NavigationItem = props => {
    const isCurrentRoute = useIsCurrentRoute(props.href)

    const getRouteClassNames = (isCurrentRoute) => {
        return isCurrentRoute ? 'text-btn' : 'text-paragraph';
    };
    const Icon = props.icon;
    return (
        <div className="flex flex-row py-6 cursor-pointer">
            <Icon className="mr-7.5" highlighted={isCurrentRoute} size={24} />

            <Link href={props.href}>
                <a className={getRouteClassNames(isCurrentRoute)}>{props.title} </a>
            </Link>
        </div>
    )
}

export default NavigationItem;