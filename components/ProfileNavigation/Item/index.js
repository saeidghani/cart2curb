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
        <Link href={props.href}>
            <div className="flex flex-row py-6 cursor-pointer hover:text-primary">
                <Icon className="mr-7.5" highlighted={isCurrentRoute} size={24} />
                <a className={`${getRouteClassNames(isCurrentRoute)} text-base`}>{props.title} </a>
            </div>
        </Link>
    )
}

export default NavigationItem;