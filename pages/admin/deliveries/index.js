import React, {useState, useEffect} from 'react';
import {Select, Button, Card} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import {
    UserOutlined,
    LinkOutlined,
    HourglassOutlined,
    EnvironmentOutlined,
    FolderOpenOutlined,
    DollarCircleOutlined,
    HistoryOutlined
} from '@ant-design/icons';

import Page from "../../../components/Page";
import DetailItem from "../../../components/UI/DetailItem";
import routes from "../../../constants/routes";
import Loader from "../../../components/UI/Loader";
import AdminAuth from "../../../components/Admin/AdminAuth";
import api from "../../../http/Api";
import {convertAddress} from '../../../helpers';

const setOptions = token => ({
    headers: {
        Authorization: `Bearer ${token}`
    }
});

const Deliveries = props => {
    const dispatch = useDispatch();
    const deliveries = useSelector(state => state?.adminDelivery?.deliveries);
    const loadingDelivery = useSelector(state => state?.loading?.effects?.adminDelivery?.getDeliveries);
    const isLoggedIn = useSelector(state => state?.adminAuth?.isLoggedIn);
    const token = useSelector(state => state?.adminAuth?.token);

    const [drivers, setDrivers] = useState([]);
    const [selectedDrivers, setSelectedDrivers] = useState({});
    const [selectedStatus, setSelectedStatus] = useState();
    const [selectedDateOrder, setSelectedDateOrder] = useState();
    const [pendingDeliveries, setPendingDeliveries] = useState([]);

    useEffect(() => {
        if (isLoggedIn) {
            (async () => {
                const query = {};
                if (selectedStatus) query.status = selectedStatus;
                if (selectedDateOrder) query.sort = selectedDateOrder;
                await dispatch?.adminDelivery?.getDeliveries(query);
                const res = await api?.admin?.user?.getDrivers({}, setOptions(token));
                setDrivers(res?.data?.data || []);
            })();
        };
    }, [isLoggedIn]);

    useEffect(() => {
        let interval;
        if (isLoggedIn) {
            (async () => {
                const query = {};
                if (selectedStatus) query.status = selectedStatus;
                if (selectedDateOrder) query.sort = selectedDateOrder;
                interval = setInterval(async () => {
                    await dispatch?.adminDelivery?.getDeliveries(query);
                }, 60000);
                const res = await api?.admin?.user?.getDrivers({}, setOptions(token));
                setDrivers(res?.data?.data || []);
            })();
        };
        return () => clearInterval(interval);
    }, [isLoggedIn, selectedStatus, selectedDateOrder]);

    useEffect(() => {
        deliveries?.data?.forEach(delivery => {
            if (delivery?.driver?._id) {
                setSelectedDrivers({...selectedDrivers, [delivery?._id]: delivery?.driver?._id});
            }
        });
    }, [deliveries]);

    const {Option} = Select;

    if (loadingDelivery) return (
        <div className="flex items-center justify-center py-10">
            <Loader/>
        </div>
    );

    const breadcrumb = [
        {
            title: 'Deliveries',
            href: routes.admin.deliveries.index,
        }
    ];

    const handleAssign = async (status, deliveryId) => {
        const driverId = selectedDrivers[deliveryId];
        const body = {
            driverId
        }
        if (status !== 'pending' && !pendingDeliveries?.includes(deliveryId)) {
            try {
                const res = await dispatch?.adminDelivery?.editDelivery({deliveryId, body, token})
                if (res?.data?.success) {
                    setPendingDeliveries(prevState => [...prevState, deliveryId]);
                }
            } catch (err) {
            }
        }
    }

    const handleFilterByStatus = async (status) => {
        setSelectedStatus(status);
        const query = {};
        if (selectedDateOrder) query.sort = selectedDateOrder;
        if (status) query.status = status;
        await dispatch?.adminDelivery?.getDeliveries(query);
    };

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

    const handleSortByOrder = async (dateOrder) => {
        setSelectedDateOrder(dateOrder);
        const query = {};
        if (selectedStatus) query.status = selectedStatus;
        query.sort = dateOrder;
        await dispatch?.adminDelivery?.getDeliveries(query);
    }

    const SortAndFilter = () => (
        <div className="flex mb-4">
            <div className="mr-4 w-4/12">
                <div className="mb-2">Filter By Status</div>
                <Select
                    allowClear
                    placeholder='Filter By Status'
                    className="w-full"
                    value={selectedStatus}
                    onChange={statusVal => handleFilterByStatus(statusVal)}
                    onClear={() => handleFilterByStatus('')}
                >
                    {statuses?.map(status => <Option value={status?.value}>{status?.name}</Option>)}
                </Select>
            </div>

            <div className="w-4/12">
                <div className="mb-2">Sort By Date</div>
                <Select
                    allowClear
                    placeholder='Sort By Date'
                    className="w-full"
                    value={selectedDateOrder}
                    onChange={dateOrderVal => handleSortByOrder(dateOrderVal)}
                    onClear={() => handleSortByOrder('')}
                >
                    {dateOptions?.map(date => <Option value={date?.value}>{date?.name}</Option>)}
                </Select>
            </div>
        </div>
    );

    const BasicInfo = ({customer, deliveryTime, destination, order}) => (
        <div className="border-r-2 col-span-3 border-solid border-gray pr-14">
            <div className="flex items-center justify-between mb-10">
                <DetailItem labelColor='overline' title='User'
                            value={`${customer?.firstName} ${customer?.lastName}`}
                            icon={<UserOutlined className="text-lg text-secondarey"/>}/>
                <DetailItem labelColor='overline' title='Order' value={order}
                            icon={<LinkOutlined className="text-lg text-secondarey"/>}/>
                <DetailItem labelColor='overline' title='Scheduled Delivery Time'
                            value={`${moment(deliveryTime?.from).format('YYYY-MM-DD')} | ${moment(deliveryTime?.from).format('hh:mm')} - ${moment(deliveryTime?.to).format('hh:mm')}`}
                            icon={<HourglassOutlined className="text-lg text-secondarey"/>}/>
            </div>
            <DetailItem labelColor='overline' title='Destination'
                        value={convertAddress(destination)}
                        icon={<EnvironmentOutlined className="text-lg text-secondarey"/>}/>
        </div>
    )

    const AssignDelivery = ({status, deliveryId}) => (
        <div className="col-span-2">
            <div className="flex items-end justify-end">
                <div className="w-4/6 px-5">
                    <div className="mb-4">Driver</div>
                    <Select
                        className="w-full mr-4"
                        placeholder='Select Driver'
                        value={selectedDrivers[deliveryId]}
                        onChange={(driverId) => {
                            if (status !== 'pending' && !pendingDeliveries?.includes(deliveryId)) {
                                setSelectedDrivers({...selectedDrivers, [deliveryId]: driverId});
                            }
                        }}
                    >
                        {drivers?.map(driver =>
                            <Option value={driver?._id}>{driver?.name}</Option>
                        )}
                    </Select>
                </div>
                <div className="w-1/4 text-right">
                    <Button
                        type="primary"
                        className={`px-8 ${(status === 'pending' || pendingDeliveries?.includes(deliveryId)) ? 'opacity-50' : ''}`}
                        onClick={() => handleAssign(status, deliveryId)}
                    >
                        {(status === 'pending' || pendingDeliveries?.includes(deliveryId)) ? 'Pending' : 'Assign'}
                    </Button>
                    {(status === 'pending' || pendingDeliveries?.includes(deliveryId)) && <Button type="link" className='px-8 mt-2' onClick={async () => {
                        await dispatch.adminDelivery.cancelAssign({deliveryId, body: {}, token});
                        const query = {};
                        if (selectedStatus) query.status = selectedStatus;
                        if (selectedDateOrder) query.sort = selectedDateOrder;
                        await dispatch?.adminDelivery?.getDeliveries(query);
                        const newDeliveries = pendingDeliveries.filter(d => d !== deliveryId);
                        setPendingDeliveries(newDeliveries);
                        const newSelectedDrivers = {...selectedDrivers};
                        delete newSelectedDrivers[deliveryId];
                        setSelectedDrivers(newSelectedDrivers);
                    }}>
                        Cancel
                    </Button>}
                </div>
            </div>
        </div>
    );

    const AcceptedDeliveryInfo = ({status, driver, deliveryCost, updatedAt}) => (
        <div className="col-span-2 flex flex-col justify-between">
            <div className="flex justify-between mb-10">
                <DetailItem labelColor='overline' title='Driver' value={driver?.name}
                            icon={<FolderOpenOutlined className="text-lg text-secondarey"/>}/>
                <DetailItem labelColor='overline' title='Drivered Time' value={moment(updatedAt).format('hh:mm')}
                            icon={<HistoryOutlined className="text-lg text-secondarey"/>}/>
                <DetailItem labelColor='overline' title='Fee' value={`$ ${deliveryCost}`}
                            icon={<DollarCircleOutlined className="text-lg text-secondarey"/>}/>
            </div>
            <div className="flex justify-end items-end">
                {status === 'delivered' ?
                    <span className="text-white py-1 px-2 mt-10" style={{backgroundColor: '#14C67B'}}>Completed</span> :
                    <span className="text-white py-1 px-2 mt-10" style={{backgroundColor: '#ECA234'}}>In progress</span>
                }
            </div>
        </div>
    );

    return (
        <AdminAuth>
            <Page title={false} headTitle={'Deliveries'} breadcrumb={breadcrumb}>
                <SortAndFilter/>
                {deliveries?.data?.map(delivery => (
                    <Card className="mb-4 shadow pr-10">
                        <div className="grid gap-5 grid-cols-5 items-center">
                            <BasicInfo {...delivery} />
                            {['notAssigned', 'pending'].includes(delivery?.status) ?
                                <AssignDelivery status={delivery?.status} deliveryId={delivery?._id}/> :
                                <AcceptedDeliveryInfo {...delivery}/>
                            }
                        </div>
                    </Card>
                ))}
            </Page>
        </AdminAuth>
    )
}

export default Deliveries;
//
