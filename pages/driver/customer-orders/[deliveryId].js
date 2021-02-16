import React, {useEffect} from 'react';
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

    useEffect(() => {
        if (token) {
            dispatch?.driverDelivery?.getCustomerOrders({deliveryId, token});
        }
    }, [token]);

    const DetailInfo = ({title, description, borderLess}) => (
        <div className={`grid grid-cols-5 gap-x-1 ${borderLess ? 'px-4 pt-4' : 'p-4'}`}
             style={borderLess ? {} : {borderBottom: '1px solid #D9D9D9'}}>
            <div className="text-muted col-span-2">{title}</div>
            <div className="col-start-3 col-span-3">{description}</div>
        </div>
    );

    return (
        <DriverAuth>
            <DriverPage title="Customer Orders">
                <div className="w-full bg-muted py-3" style={{backgroundColor: 'rgba(114, 122, 139, 0.05)'}}>
                    {(customerOrders?.products || [])?.map(product =>
                        <div className="flex flex-col">
                            <div className="flex items-center space-x-2 p-4"
                                 style={{borderBottom: '1px solid #D9D9D9'}}>
                                <img src={product?.productExtraInfo?.images?.length > 0 ? product?.productExtraInfo?.images[0] : ''}
                                     alt="" width={56}/>
                                <div className="ml-3">{product?.productExtraInfo?.name || '-'}</div>
                            </div>
                            <DetailInfo title={"Quantity/Weight"} description={product.quantity || '-'}
                                        borderLess/>
                            <DetailInfo title={"Substitutions"} description={product.subtitution || '-'}/>
                            <DetailInfo
                                title="Store Address"
                                description={product?.storeInfo?.address ? convertAddress(product?.storeInfo?.address) : '-'}
                                borderLess
                            />
                        </div>
                    )}
                </div>
            </DriverPage>
        </DriverAuth>
    )
};

export default CurrentOrders;