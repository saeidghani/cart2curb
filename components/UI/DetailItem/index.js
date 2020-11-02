import React from 'react';

const DetailItem = ({ title, value, ...props }) => {
    return (
        <div className="flex flex-col justify-center">
            <span className={`text-${props.labelColor || 'paragraph'} text-xs font-medium mb-1`}>{title}</span>
            <span className={`text-${props.valueColor || 'type'} text-xs font-medium`}>{value}</span>
        </div>
    )
}

export default DetailItem;