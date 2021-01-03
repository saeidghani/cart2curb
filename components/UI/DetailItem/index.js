import React from 'react';

const DetailItem = ({title, value, icon, ...props}) => {
    return (
        <div className="flex flex-col justify-center">
            <span
                className={`text-${props.labelColor || 'paragraph'} ${icon ? "ml-6" : ''} text-xs font-medium mb-1`}
            >
                {title}
            </span>
            <span className={`${icon ? 'flex space-x-2' : ''}`}>
                {icon && icon}
                <span
                    className={`text-${props.valueColor || 'type'} text-xs font-medium ${props.capitalize ? 'capitalize' : ''}`}>
                    {value}
                </span>
            </span>
        </div>
    )
}

export default DetailItem;