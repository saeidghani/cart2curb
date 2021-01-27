import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';

import DriverPage from '../../../components/DriverPage';
import DriverAuth from '../../../components/Driver/DriverAuth';
import {useSelector} from "react-redux";

const CurrentOrders = () => {
    const currentDeliveries = useSelector(state => state?.driverDelivery?.getCurrentDeliveries?.data);
    const router = useRouter();
    const {deliveryId} = router.query;
    const [delivery, setDelivery] = useState({});

    useEffect(() => {
        const selectedDelivery = currentDeliveries?.find(d => d?._id === deliveryId);
        setDelivery(selectedDelivery);
    }, [currentDeliveries]);

    const getAddress = (destination) => `${destination?.destinationLine1 || ''}${destination?.destinationLine2 || ''} ${destination?.city || ''} ${destination?.province || ''} ${destination?.country || ''}`;

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
                {(delivery?.products || [])?.map(p =>
                    <div className="w-full bg-muted py-3" style={{backgroundColor: 'rgba(114, 122, 139, 0.05)'}}>
                        <div className="flex space-x-2 p-4" style={{borderBottom: '1px solid #D9D9D9'}}>
                            <img src={p?.productExtraInfo?.images?.length > 0 ? p?.productExtraInfo?.images[0] : ''} alt=""
                                 width={56}/>
                            <div className="ml-3">Choice Beef Brisket Chunk</div>
                        </div>
                        <DetailInfo title={"Quantity/Weight"} description={p?.quantity || ''} borderLess/>
                        <DetailInfo title={"Substitutions"} description={p?.subtitution || ''}/>
                        <DetailInfo
                            title="Store Address"
                            description={p?.storeInfo?.address ? getAddress(p?.storeInfo?.address) : ''}
                            borderLess
                        />
                    </div>)}
            </DriverPage>
        </DriverAuth>
    )
};

export default CurrentOrders;