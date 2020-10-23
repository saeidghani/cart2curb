import React from 'react';
import { Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const ShopOverview = ({imageURL, name, title, service, subType, ...props}) => {
    return (
        <div className="flex flex-col">
            <img src={imageURL} alt="shop name" style={{ maxHeight: 288, objectFit: 'cover', width: '100%', borderRadius: 2 }}/>
            <div className="flex flex-col mt-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-base text-paragraph font-medium">{name}</span>
                    <span className="text-sm text-type font-medium">{title}</span>
                </div>
                <span className="text-sm text-overline font-medium mb-2">{service}</span>
                <span className="text-xs text-overline font-medium mb-4">{subType}</span>
                <Button danger icon={<EyeOutlined style={{ fontSize: 18}} />} className={'flex items-center font-bold justify-center h-14'}>Show</Button>
            </div>
        </div>
    )
}

export default ShopOverview;