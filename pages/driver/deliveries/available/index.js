import React, {useEffect, useState} from 'react';
import {Button, Select} from 'antd';
import {CloseOutlined, EnvironmentOutlined, SoundOutlined} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import Link from "next/link";
import moment from "moment";

import DriverPage from '../../../../components/Driver/DriverPage';
import DriverAuth from '../../../../components/Driver/DriverAuth';
import routes from '../../../../constants/routes';
import Loader from "../../../../components/UI/Loader";
import {convertAddress} from '../../../../helpers';

const {Option} = Select;

const Available = () => {
    const [selectedStatus, setSelectedStatus] = useState();
    const [selectedDateOrder, setSelectedDateOrder] = useState();
    const [clickedDeliveries, setClickedDeliveries] = useState([]);
    const dispatch = useDispatch();
    const token = useSelector(state => state?.driverAuth?.token);
    const deliveries = useSelector(state => state?.driverDelivery?.availableDeliveries?.data);
    const availableDeliveriesLoading = useSelector(state => state?.loading?.effects?.driverDelivery?.getAvailableDeliveries);

    useEffect(() => {
        if (token) {
            dispatch?.driverDelivery?.getAvailableDeliveries();
        }
    }, [token]);

    useEffect(() => {
    }, [deliveries]);

    const dateOptions = [
        {name: 'newest', value: '-createdAt'},
        {name: 'oldest', value: '+createdAt'},
    ];

    const handleSortByOrder = async (dateOrder) => {
        setSelectedDateOrder(dateOrder);
        const query = {};
        if (selectedStatus) query.status = selectedStatus;
        query.sort = dateOrder;
        await dispatch?.driverDelivery?.getAvailableDeliveries(query);
    }

    const handleSubmit = async (deliveryId) => {
        const body = {
            accept: true
        };
        try {
            await dispatch?.driverDelivery?.editDeliveryAvailable({deliveryId, body, token});
            setClickedDeliveries(prevDeliveries => [...prevDeliveries, deliveryId]);
        } catch (err) {};
    };

    const handleReject = async (deliveryId) => {
        const body = {
            accept: false
        };
        try {
            await dispatch?.driverDelivery?.editDeliveryAvailable({deliveryId, body, token});
            setClickedDeliveries(prevDeliveries => [...prevDeliveries, deliveryId]);
        } catch (err) {};
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
                    <p className="text-paragraph mt-8 mb-10 px-10 text-center">You dont have any Available
                        deliveries now!</p>
                </div>
            </div>
        </div>
    );

    const DeliveryNav = () => (
        <div className="grid grid-cols-2 shadow-lg" style={{position: 'sticky', bottom: 30, width: '100vw'}}>
            <Link href={routes.driver.deliveries.available}>
                <div className="text-secondarey text-center p-4" style={{backgroundColor: '#E6F7FF'}}>Available
                    Deliveries
                </div>
            </Link>
            <Link href={routes.driver.deliveries.current}>
                <div className="text-secondarey text-center p-4 bg-white">Current Delivery</div>
            </Link>
        </div>
    );

    const SortByDate = () => (
        <div className="grid grid-cols-2 gap-x-2 mb-2 w-full">
            <div className="">
                <Select placeholder='Date' className="w-full" value={selectedDateOrder}
                        onChange={dateOrderVal => handleSortByOrder(dateOrderVal)}>
                    {dateOptions?.map(date => <Option value={date?.value}>{date?.name}</Option>)}
                </Select>
            </div>
        </div>
    );

    const DeliveryCard = ({deliveryId, destination, sources, deliveryTime, deliveryFee, acceptedDateByDriver}) => (
        <div className="w-full shadow-lg p-8">
            <div className="flex">
                <div className="w-6/12">
                    <div className="text-xs font-normal text-overline">
                        Sources
                    </div>
                    <div className="flex flex-col">
                        {sources?.length > 0 ? sources.map(s => <div className="font-normal text-sm">
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
                {acceptedDateByDriver && <div className="w-6/12">
                    <div className="text-xs font-normal text-overline">
                        Start Time
                    </div>
                    <div className="font-normal text-sm">
                        {moment(acceptedDateByDriver).format('hh:mm')}
                    </div>
                </div>}
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
                    {`${moment(deliveryTime?.from).format('YYYY-MM-DD')} | ${moment(deliveryTime?.from).format('hh:mm')} - ${moment(deliveryTime?.to).format('hh:mm')}`}
                </div>
            </div>
            <div className="mt-7">
                <div className="text-xs font-normal text-overline">
                    Destination
                </div>
                <div className="font-normal text-sm">
                    {convertAddress(destination)}
                </div>
            </div>
            <Button
                className="w-full mt-6 p-4 text-center bg-btn text-sm font-normal items-center flex justify-center text-white"
                onClick={() => handleSubmit(deliveryId)}
            >
                Submit
            </Button>
            <Button
                className="w-full mt-3 p-4 text-center text-sm font-normal items-center flex justify-center"
                type="link"
                onClick={() => handleReject(deliveryId)}
            >
                Reject
            </Button>
        </div>
    );

    if (availableDeliveriesLoading) return <div className="flex justify-center" style={{minHeight: 500}}><Loader/></div>;

    return (
        <DriverAuth>
            <DriverPage title="Available Deliveries" titleClassName="px-4">
                <div className="min-h-full flex flex-col space-y-4 items-center px-4">
                    {deliveries?.filter(d => !clickedDeliveries?.includes(d?._id))?.length > 0 ?
                        <>
                            <SortByDate/>
                            {deliveries?.filter(d => !clickedDeliveries?.includes(d?._id))?.map(d =>
                                <DeliveryCard
                                    deliveryId={d?._id}
                                    destination={d?.destination}
                                    sources={d?.sources}
                                    deliveryTime={d?.deliveryTime}
                                    deliveryFee={d?.deliveryFee}
                                />)}
                        </> : availableDeliveriesLoading ? <span></span> : <EmptyDelivery/>}
                </div>
                <div className="flex justify-center">
                    <DeliveryNav/>
                </div>
            </DriverPage>
        </DriverAuth>
    )
};

Available.getInitialProps = async () => {
    return { forceLayout: true }
}

export default Available;