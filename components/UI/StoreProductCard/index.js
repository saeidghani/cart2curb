import React, {useEffect, useState} from 'react';
import {Button, message} from 'antd';
import {EyeOutlined, PictureOutlined} from '@ant-design/icons';
import Link from "next/link";
import routes from "../../../constants/routes";
import {useDispatch, useSelector} from "react-redux";

const StoreProductCard = ({imageURL, name, price, vendor, vendorId, productId, ...props}) => {
    const [hasError, setHasError] = useState(false);
    const [imageProduct, setImageProduct] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        setImageProduct(imageURL);
    }, [imageURL])

    const changeToPlaceholder = (source) => {
        setHasError(true);
        return true;
    }

    const addToCartHandler = async () => {
        const body = {
            productId,
            quantity: 1,
        }
        setLoading(true)

        const res = await dispatch.cart.addToCart(body)
        if(res) {
            message.success('Product added to your cart');
        } else {
            message.error('An Error was occurred');
        }
        setLoading(false);
    }

    return (
        <div className="flex flex-col">

            {hasError ? (
                <div className="bg-card flex items-center justify-center text-4xl text-gray" style={{ maxHeight: 288, minHeight: 288, objectFit: 'cover', width: '100%', borderRadius: 2 }}>
                    <PictureOutlined  />
                </div>
            ) : (
                <img src={imageProduct} alt="shop name" style={{ height: 288, objectFit: 'cover', width: '100%', borderRadius: 2 }} onError={changeToPlaceholder}/>
            )}
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
                    <Button type={'primary'} style={{ height: 50}} className={'flex-grow flex items-center justify-center font-medium rounded-sm'} onClick={addToCartHandler} loading={loading}>Add to Cart</Button>
                </div>
            </div>
        </div>
    )
}

export default StoreProductCard;