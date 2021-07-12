import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from 'next/router';

import DriverPage from '../../../components/Driver/DriverPage';
import DriverAuth from '../../../components/Driver/DriverAuth';
import {convertAddress} from '../../../helpers';

const CurrentOrders = () => {
    const dispatch = useDispatch();
    const customerOrders = useSelector(state => state?.driverDelivery?.customerOrders);
    const router = useRouter();
    const {deliveryId} = router.query;
    const token = useSelector(state => state?.driverAuth?.token);
    const [totalGathered, setTotalGathered] = useState({});

    useEffect(() => {
        if (token) {
            dispatch?.driverDelivery?.getCustomerOrders({deliveryId, token});
        }
    }, [token]);

    useEffect(() => {
        let newCurrentQuantities = {};
        customerOrders?.forEach(order => {
            order?.products?.forEach(p => {
                newCurrentQuantities = {...newCurrentQuantities, [p._id]: 1};
            });
        });
        setTotalGathered(newCurrentQuantities);
    }, [customerOrders]);

    const handleIncreaseGathered = (productId) => {
        setTotalGathered({...totalGathered, [productId]: totalGathered[productId] + 1})
        dispatch?.driverDelivery?.addDeliveryGathered({
            deliveryId,
            body: [{_id: productId, gathered: totalGathered[productId] + 1}],
            token
        })
    }

    const handleDecreaseGathered = (productId) => {
        if (totalGathered[productId] > 1) {
            setTotalGathered({...totalGathered, [productId]: totalGathered[productId] - 1})
            dispatch?.driverDelivery?.addDeliveryGathered({
                deliveryId,
                body: [{_id: productId, gathered: totalGathered[productId] - 1}],
                token
            })
        }
    }

    const DetailInfo = ({title, description, borderLess}) => (
        <div className={`flex space-x-4 items-center w-full ${borderLess ? 'px-4 pt-4' : 'p-4'}`}
             style={borderLess ? {} : {borderBottom: '1px solid #D9D9D9'}}>
            <div className="text-muted w-32">{title}</div>
            <div className="">{description}</div>
        </div>
    );

    const ProductDetails = ({product}) => (
        <>
            <div key={product?._id} className="flex flex-col pb-4"
                 style={{backgroundColor: 'rgba(114, 122, 139, 0.05)'}}>
                <div className="flex items-center space-x-2 p-4"
                     style={{borderBottom: '1px solid #D9D9D9'}}>
                    {product?.images?.length > 0 &&
                    <img
                        src={product?.images[0]}
                        alt="" width={56}/>
                    }
                    <div className="ml-3">{product?.name || '-'}</div>
                </div>
                <div className="flex items-center w-full">
                    <DetailInfo
                        title={"Quantity/Weight"}
                        description={product?.quantity || '-'}
                        borderLess
                    />
                    <div className="flex items-center space-x-4 pt-4 pr-4">
                        <div
                            className="w-6 h-4 bg-white relative cursor-pointer"
                            onClick={() => {
                                if (totalGathered[product?._id] > 0) {
                                    handleDecreaseGathered(product?._id)
                                }
                            }}
                        >
                        <span className="text-lg absolute top-0 left-0"
                              style={{paddingTop: 8, paddingLeft: 7}}>
                        <svg width="10" height="2" viewBox="0 0 10 2" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M0.40625 0.480469H9.59375C9.66667 0.480469 9.70312 0.516927 9.70312 0.589844V1.41016C9.70312 1.48307 9.66667 1.51953 9.59375 1.51953H0.40625C0.333333 1.51953 0.296875 1.48307 0.296875 1.41016V0.589844C0.296875 0.516927 0.333333 0.480469 0.40625 0.480469Z"
                            fill="black"/>
                        </svg>
                        </span>
                        </div>
                        <div className="">{totalGathered[product?._id]}</div>
                        <div
                            className="w-6 h-4 bg-white relative cursor-pointer"
                            onClick={() => {
                                if (product?.quantity > totalGathered[product?._id]) {
                                    handleIncreaseGathered(product?._id);
                                }
                            }}
                        >
                        <span className="text-lg absolute top-0 left-0"
                              style={{paddingTop: 4, paddingLeft: 7}}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M4.58984 0.078125H5.41016C5.48307 0.078125 5.51953 0.114583 5.51953 0.1875V9.8125C5.51953 9.88542 5.48307 9.92188 5.41016 9.92188H4.58984C4.51693 9.92188 4.48047 9.88542 4.48047 9.8125V0.1875C4.48047 0.114583 4.51693 0.078125 4.58984 0.078125Z"
                            fill="black"/>
                        <path
                            d="M0.40625 4.48047H9.59375C9.66667 4.48047 9.70312 4.51693 9.70312 4.58984V5.41016C9.70312 5.48307 9.66667 5.51953 9.59375 5.51953H0.40625C0.333333 5.51953 0.296875 5.48307 0.296875 5.41016V4.58984C0.296875 4.51693 0.333333 4.48047 0.40625 4.48047Z"
                            fill="black"/>
                        </svg>
                        </span>
                        </div>
                    </div>
                </div>
                <DetailInfo title={"Substitutions"} description={product.subtitution || '-'} borderLess/>
            </div>
        </>
    );
    return (
        <DriverAuth>
            <DriverPage title="Customer Orders">
                <div className="w-full py-3 flex flex-col space-y-4">
                    {customerOrders?.map(order => (
                        <>
                            <DetailInfo
                                title="Store Address"
                                description={order?.store?.address ? convertAddress(order?.store?.address) : '-'}
                                borderLess
                            />
                            {order?.products?.map(product =>
                                <ProductDetails product={product}/>
                            )}
                        </>
                    ))}
                </div>
            </DriverPage>
        </DriverAuth>
    )
};

export default CurrentOrders;
/*
order?.products?.map(product =>
    <>
        <ProductDetails product={product}/>
    </>
)*/
