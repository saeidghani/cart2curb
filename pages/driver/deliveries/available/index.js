import React, {useEffect, useState} from 'react';
import {Button, Select} from 'antd';
import {EnvironmentOutlined} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import Link from "next/link";

import DriverPage from '../../../../components/DriverPage';
import DriverAuth from '../../../../components/Driver/DriverAuth';
import routes from '../../../../constants/routes';
import Loader from "../../../../components/UI/Loader";

const {Option} = Select;

const Available = () => {
    const [selectedStatus, setSelectedStatus] = useState();
    const [selectedDateOrder, setSelectedDateOrder] = useState();
    const dispatch = useDispatch();
    const token = useSelector(state => state?.driverAuth?.token);
    const delivery = useSelector(state => state?.driverDelivery?.data);
    const availableDeliveriesloading = useSelector(state => state?.loading?.effects?.driverDelivery?.getAvailableDeliveries);
    const router = useRouter();

    useEffect(() => {
        if (token) {
            dispatch?.driverDelivery?.getAvailableDeliveries();
        }
    }, [token]);

    useEffect(() => {
        console.log(delivery);
    }, [delivery]);

    const statuses = [
        {name: 'all', value: ''},
        {name: 'not assigned', value: 'notAssigned'},
        {name: 'pending', value: 'pending'},
        {name: 'accepted', value: 'accepted'},
        {name: 'delivered', value: 'delivered'},
    ];

    const dateOptions = [
        {name: 'newest', value: '-createdAt'},
        {name: 'oldest', value: '+createdAt'},
    ];

    const handleFilterByStatus = async (status) => {
        setSelectedStatus(status);
        const query = {};
        if (selectedDateOrder) query.sort = selectedDateOrder;
        if (status) query.status = status;
        await dispatch?.driverDelivery?.getAvailableDeliveries(query);
    };

    const handleSortByOrder = async (dateOrder) => {
        setSelectedDateOrder(dateOrder);
        const query = {};
        if (selectedStatus) query.status = selectedStatus;
        query.sort = dateOrder;
        await dispatch?.adminDelivery?.getDeliveries(query);
    }

    const SortAndFilter = () => (
        <div className="grid grid-cols-2 gap-x-2 mb-6">
            <div className="">
                <Select placeholder='Status' className="w-full" value={selectedStatus}
                        onChange={statusVal => handleFilterByStatus(statusVal)}>
                    {statuses?.map(status => <Option value={status?.value}>{status?.name}</Option>)}
                </Select>
            </div>
            <div className="">
                <Select placeholder='Date' className="w-full" value={selectedDateOrder}
                        onChange={dateOrderVal => handleSortByOrder(dateOrderVal)}>
                    {dateOptions?.map(date => <Option value={date?.value}>{date?.name}</Option>)}
                </Select>
            </div>
        </div>
    );

    const DeliveryCard = ({}) => (
        <div className="w-full shadow-lg p-8">
            <div className="flex">
                <div className="w-6/12">
                    <div className="text-xs font-normal text-overline">
                        Sources
                    </div>
                    <div className="font-normal text-sm">
                        Store #1
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
                        11:50
                    </div>
                </div>
                <div className="w-6/12">
                    <div className="text-xs font-normal text-overline">
                        Delivery Fee
                    </div>
                    <div className="font-normal text-sm">
                        $15
                    </div>
                </div>
            </div>
            <div className="mt-7">
                <div className="text-xs font-normal text-overline">
                    Scheduled Delivery Time
                </div>
                <div className="font-normal text-sm">
                    02.05.2020 | 12:30 - 13:30
                </div>
            </div>
            <div className="mt-7">
                <div className="text-xs font-normal text-overline">
                    Destination
                </div>
                <div className="font-normal text-sm">
                    Address Line 2, Address Line 2, City, State, Country, Zip Code
                </div>
            </div>
            <Button
                className="w-full mt-6 p-4 text-center bg-btn text-sm font-normal items-center flex justify-center text-white"
            >
                Submit
            </Button>
            <Button
                className="w-full mt-3 p-4 text-center text-sm font-normal items-center flex justify-center"
                type="link"
            >
                Reject
            </Button>
        </div>
    );

    const DeliveryNav = ({}) => (
        <div className="grid grid-cols-2 shadow-lg absolute" style={{top: 700, width: 380}}>
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

    return (
        <DriverAuth>
            <DriverPage title="Available Deliveries">
                {availableDeliveriesloading ? <div className="flex justify-center"><Loader/></div> : <>
                    <DeliveryNav/>
                    <SortAndFilter/>
                    <DeliveryCard/>
                </>}
            </DriverPage>
        </DriverAuth>
    )
};

export default Available;