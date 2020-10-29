import React from 'react';
import { Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import Link from "next/link";
import routes from "../../../constants/routes";

const StoreProductCard = ({imageURL, name, price, vendor, vendorId, productId, ...props}) => {
    return (
        <div className="flex flex-col">
            <img src={imageURL} alt="shop name" style={{ height: 288, objectFit: 'cover', width: '100%', borderRadius: 2 }}/>
            <div className="flex flex-col mt-3">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                        <span className="text-base text-paragraph font-medium">{name}</span>
                        <span className="text-sm text-overline font-medium">{vendor}</span>
                    </div>
                    <span className="text-2xl text-type font-medium">${price}</span>
                </div>
                <div className={'flex flex-row justify-between items-center'}>
                    <Link href={routes.stores.product()} as={routes.stores.product(vendorId, productId)}>
                    <Button danger icon={<EyeOutlined style={{ fontSize: 18}} />} className={'flex items-center font-bold justify-center mr-2 rounded-sm'} style={{ width: 50, height: 50}}/>
                    </Link>
                    <Button type={'primary'} style={{ height: 50}} className={'flex-grow flex items-center justify-center font-medium rounded-sm'}>Add to Cart</Button>
                </div>
            </div>
        </div>
    )
}

export default StoreProductCard;