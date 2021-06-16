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
        }
        setLoading(false);
    }
    let newPrice = price;
    const decimalPart = (price+"").split(".")[1];
    if (decimalPart.length===1) {
        newPrice = `${price}0`
    }
    return (
        <div className="flex flex-col justify-between" style={{height: 420}}>
            <div className="">
                <div style={{ position: 'relative', paddingTop: '100%'}}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}>
                        {hasError ? (
                            <div className="bg-card flex items-center justify-center text-4xl text-gray" style={{ height: '100%', objectFit: 'cover', width: '100%', borderRadius: 2 }}>
                                <PictureOutlined  />
                            </div>
                        ) : (
                            <img src={imageProduct} alt="shop name" className={'border border-solid border-gray'} style={{ height: '100%', objectFit: 'cover', width: '100%', borderRadius: 2 }} onError={changeToPlaceholder}/>
                        )}
                    </div>
                </div>
                <div className="flex items-center justify-between my-4">
                    <div className="flex flex-col">
                        <span className="text-base text-paragraph font-medium">
                            {name?.length > 30 ? `${name.substring(0, 30)}...` : name}
                        </span>
                        <span className="text-sm text-overline font-medium">{vendor}</span>
                    </div>
                    <span className="text-2xl text-type font-medium ml-1">${newPrice}</span>
                </div>
            </div>
            <div className={'flex flex-row justify-between items-center'}>
                <Link href={routes.stores.product()} as={routes.stores.product(vendorId, productId)}>
                    <Button danger icon={<EyeOutlined style={{ fontSize: 18}} />} className={'flex items-center font-bold justify-center mr-2 rounded-sm'} style={{ width: 50, height: 50}}/>
                </Link>
                <Button type={'primary'} style={{ height: 50}} className={'flex-grow flex items-center justify-center font-medium rounded-sm'} onClick={addToCartHandler} loading={loading}>Add to Cart</Button>
            </div>
        </div>
    )
}

export default StoreProductCard;
