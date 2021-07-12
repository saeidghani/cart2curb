import React, {useEffect, useState} from 'react';
import {Button} from 'antd';
import {SoundTwoTone, SoundOutlined, EnvironmentOutlined, CloseOutlined} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import Timer from 'react-compound-timer';
import Link from "next/link";
import moment from "moment";

import DriverAuth from '../../../../components/Driver/DriverAuth';
import DriverPage from '../../../../components/Driver/DriverPage';
import routes from '../../../../constants/routes';
import Loader from "../../../../components/UI/Loader";
import {convertAddress} from '../../../../helpers';

const Current = () => {
    const dispatch = useDispatch();
    const [clickedDeliveries, setClickedDeliveries] = useState([]);
    const currentDeliveriesLoading = useSelector(state => state?.loading?.effects?.driverDelivery?.getCurrentDeliveries);
    const token = useSelector(state => state?.driverAuth?.token);
    const deliveries = useSelector(state => state?.driverDelivery?.currentDeliveries?.data);

    useEffect(() => {
        if (token) {
            dispatch?.driverDelivery?.getCurrentDeliveries();
        }
    }, [token]);

    const handleComplete = async (deliveryId) => {
        const body = {
            complete: true
        };
        try {
            await dispatch?.driverDelivery?.editDeliveryComplete({deliveryId, body, token});
            setClickedDeliveries(prevDeliveries => [...prevDeliveries, deliveryId]);
        } catch (err) {
        }
        ;
    };

    const EmptyDelivery = ({}) => (
        <div style={{minHeight: 400}}>
            <div className="w-full shadow-lg p-8 mt-8">
                <div className="flex flex-col">
                    <div className="flex justify-center mt-10 space-x-2 text-6xl transform -rotate-45"
                         style={{color: '#8C8C8C'}}>
                        <SoundOutlined className=""/>
                        <CloseOutlined className="text-3xl pt-5"/>
                    </div>
                    <p className="text-paragraph mt-8 mb-10 px-10 text-center">You dont have any open
                        deliveries now!</p>
                </div>
            </div>
        </div>
    );

    const DeliveryCard = ({_id: deliveryId, acceptedDateByDriver, deliveryTime, deliveryFee, customerAddress, sources}) => (
        <div className="w-full shadow-lg p-8">
            <div className="text-center"><SoundTwoTone className="text-6xl transform -rotate-45"/></div>
            <div className="text-xs font-normal mt-9 text-paragraph">
                Delivery Countdown
            </div>
            <div className="text-xs font-normal mt-2 text-btn">
                Missed Delivery Time
            </div>
            <div className="text-6xl font-medium text-center">
                <Timer
                    initialTime={Math.abs(moment().diff(moment(deliveryTime)))}
                    direction={moment().diff(moment(deliveryTime)) > 0 ? "forward" : "backward"}
                >
                    {() => (
                        <div className={moment().diff(moment(deliveryTime)) > 0 ? 'text-center text-btn' : "text-center"}>
                            <span><Timer.Hours formatValue={value => value > 9 ? value : `0${value}`}/>:</span>
                            <span><Timer.Minutes formatValue={value => value > 9 ? value : `0${value}`}/>:</span>
                            <span><Timer.Seconds formatValue={value => value > 9 ? value : `0${value}`}/></span>
                        </div>
                    )}
                </Timer>
            </div>
            <div className="flex mt-7">
                <div className="w-6/12">
                    <div className="text-xs font-normal text-overline">
                        Stores
                    </div>
                    <div className="flex flex-col">
                        {sources?.length > 0 ? sources.map((s, index) => <div key={index} className="font-normal text-sm">
                            {s?.name}
                        </div>) : '-'}
                    </div>
                </div>
                <div className="w-6/12 flex items-center">
                    <EnvironmentOutlined className="text-secondarey text-2xl mx-2"/>
                    <div className="text-secondarey text-xs font-normal">Show on Map</div>
                </div>
            </div>
            <div className="flex mt-7">
                <div className="w-6/12">
                    <div className="text-xs font-normal text-overline">
                        Start Time
                    </div>
                    <div className="font-normal text-sm">
                        {moment(acceptedDateByDriver).format('hh:mm')}
                    </div>
                </div>
                <div className="w-6/12">
                    <div className="text-xs font-normal text-overline">
                        Delivery Fee
                    </div>
                    <div className="font-normal text-sm">
                        {deliveryFee ? `$${deliveryFee}` : '-'}
                    </div>
                </div>
            </div>
            <div className="mt-7">
                <div className="text-xs font-normal text-overline">
                    Scheduled Delivery Time
                </div>
                <div className="font-normal text-sm">
                    {`${moment(deliveryTime).format('YYYY-MM-DD')} | ${moment(deliveryTime).format('hh:mm')}`}
                </div>
            </div>
            <div className="mt-7">
                <div className="text-xs font-normal text-overline">
                    Destination
                </div>
                <div className="font-normal text-sm">
                    {convertAddress(customerAddress)}
                </div>
            </div>
            <Link href={routes.driver.customerOrders.view(deliveryId)}>
                <Button
                    className="w-full mt-16 p-4 text-center border border-current border-solid text-sm font-normal items-center flex justify-center">
                    View Customer Order
                </Button>
            </Link>
            <Button
                className="w-full mt-12 p-4 text-center bg-btn text-sm font-normal items-center flex justify-center text-white"
                onClick={() => handleComplete(deliveryId)}
            >
                Complete
            </Button>
            <Link href={routes.driver.deliveries.available}>
                <Button
                    className="w-full mt-3 p-4 text-center text-sm font-normal items-center flex justify-center"
                    type="link"
                >
                    Back
                </Button>
            </Link>
        </div>
    );

    const DeliveryNav = () => (
        <div className="grid grid-cols-2 shadow-lg mb-10 w-full h-full cursor-pointer">
            <Link href={routes.driver.deliveries.available}>
                <div className="text-secondarey text-center p-4 bg-white">
                    Available Deliveries
                </div>
            </Link>
            <Link href={routes.driver.deliveries.current}>
                <div className="text-secondarey text-center p-4" style={{backgroundColor: '#E6F7FF'}}>Current Delivery
                </div>
            </Link>
        </div>
    );

    if (currentDeliveriesLoading) return <div className="flex justify-center" style={{minHeight: 500}}><Loader/></div>;

    return (
        <DriverAuth>
            <DriverPage title="Current Deliveries" titleClassName="px-4" pageClassName="pb-4">
                <div className="min-h-full flex flex-col items-center px-4">
                    {deliveries?.filter(d => !clickedDeliveries.includes(d?._id))?.length > 0 ? <>
                        {deliveries?.filter(d => !clickedDeliveries.includes(d?._id))?.map(delivery =>
                            <DeliveryCard key={delivery?._id} {...delivery}/>)}
                    </> : currentDeliveriesLoading ? <span></span> : <EmptyDelivery/>}
                </div>
                <div className="flex justify-center" style={{position: 'sticky', bottom: 0, width: '100vw', height: 54}}>
                    <DeliveryNav/>
                </div>
            </DriverPage>
        </DriverAuth>
    );
};

Current.getInitialProps = async () => {
    return {forceLayout: true};
}

export default Current;
