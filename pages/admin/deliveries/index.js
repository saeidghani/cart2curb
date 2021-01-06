import React, {useEffect} from 'react';
import {Select, Button, Card} from 'antd';
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
import {useDispatch, useSelector} from "react-redux";
import Loader from "../../../components/UI/Loader";
import AdminAuth from "../../../components/Admin/AdminAuth";
import moment from "moment";

const Deliveries = props => {
    const dispatch = useDispatch();
    const deliveries = useSelector(state => state?.adminDelivery?.deliveries);
    const drivers = useSelector(state => state?.adminUser?.drivers?.data);
    const loadingDelivery = useSelector(state => state?.loading?.effects?.adminDelivery?.getDeliveries);
    const isLoggedIn = useSelector(state => state?.adminAuth?.isLoggedIn);

    useEffect(() => {
        if (isLoggedIn) {
            dispatch?.adminDelivery?.getDeliveries();
            dispatch?.adminUser?.getDrivers();
        }
    }, [isLoggedIn]);

    const {Option} = Select;

    const getDestination = (destination) => {
        return `${destination?.addressLine1}${destination?.addressLine2 ? destination?.addressLine2 : ''} ${destination?.city} ${destination?.province} ${destination?.country}`;
    }

    if (loadingDelivery) return (
        <div className="flex items-center justify-center py-10">
            <Loader/>
        </div>
    );

    const breadcrumb = [
        {
            title: 'Order',
            href: routes.admin.deliveries.index,
        }
    ];

    return (
        <AdminAuth>
            <Page title={false} headTitle={'Deliveries'} breadcrumb={breadcrumb}>
                <div className="flex mb-4">
                    <div className="mr-4 w-4/12">
                        <div className="mb-2">Filter By Status</div>
                        <Select placeholder='Filter By Status' className="w-full">
                            <Option value={'product'}>Status</Option>
                        </Select>
                    </div>

                    <div className="w-4/12">
                        <div className="mb-2">Sort by Date</div>
                        <Select placeholder='Sort by Date' className="w-full">
                            <Option value={'product'}>Date</Option>
                        </Select>
                    </div>
                </div>
                {deliveries?.data?.map(delivery => (
                    <Card className="mb-4 shadow pr-10">
                        <div className="grid gap-5 grid-cols-5 items-center">
                            <div className="border-r-2 col-span-3 border-solid border-gray pr-14">
                                <div className="flex items-center justify-between mb-10">
                                    <DetailItem labelColor='overline' title='User'
                                                value={`${delivery?.customer?.firstName} ${delivery?.customer?.lastName}`}
                                                icon={<UserOutlined className="text-lg text-secondarey"/>}/>
                                    <DetailItem labelColor='overline' title='Order' value={delivery?.order}
                                                icon={<LinkOutlined className="text-lg text-secondarey"/>}/>
                                    <DetailItem labelColor='overline' title='Scheduled Delivery Time'
                                                value={`${moment(delivery?.deliveryTime?.from).format('YYYY-MM-DD')} | ${delivery?.deliveryTime?.from}`}
                                                icon={<HourglassOutlined className="text-lg text-secondarey"/>}/>
                                </div>
                                <DetailItem labelColor='overline' title='Destination'
                                            value={getDestination(delivery?.destination)}
                                            icon={<EnvironmentOutlined className="text-lg text-secondarey"/>}/>
                            </div>
                            <div className="col-span-2">
                                <div className="flex items-end justify-end">
                                    <div className="w-4/6 px-5">
                                        <div className="mb-4">Driver</div>
                                        <Select placeholder='' className="w-full mr-4">
                                            {drivers?.map(driver =>
                                                <Option value={driver?._id}>{driver?.name}</Option>
                                            )}
                                        </Select>
                                    </div>
                                    <div className="w-1/4 text-right">
                                        <Button type="primary" className="px-8">Assign</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
                <Card className="mb-4 shadow pr-10">
                    <div className="flex justify-between">
                        <DetailItem title='User' value='Name' labelColor='overline'
                                    icon={<UserOutlined className="text-lg text-secondarey"/>}/>
                        <DetailItem title='Order' value='O12302020' labelColor='overline'
                                    icon={<LinkOutlined className="text-lg text-secondarey"/>}/>
                        <DetailItem title='Scheduled Delivery Time' value='02.05.2020 | 12:30 - 13:30'
                                    labelColor='overline'
                                    icon={<HourglassOutlined className="text-lg text-secondarey"/>}/>
                        <DetailItem title='Driver' value='Name' labelColor='overline'
                                    icon={<FolderOpenOutlined className="text-lg text-secondarey"/>}/>
                        <DetailItem title='Drivered Time' value='12;41' labelColor='overline'
                                    icon={<HistoryOutlined className="text-lg text-secondarey"/>}/>
                        <DetailItem title='Fee' value='$ 15' labelColor='overline'
                                    icon={<DollarCircleOutlined className="text-lg text-secondarey"/>}/>
                    </div>
                    <div className="flex justify-between mt-10">
                        <DetailItem title='Destination' labelColor='overline'
                                    value='Address Line 2, Address Line 2, City, State, Country, Zip Code'
                                    icon={<EnvironmentOutlined className="text-lg text-secondarey"/>}/>
                        <div className="flex">
                            <span className="text-white bg-completed py-1 px-2">completed</span>
                        </div>
                    </div>
                </Card>
                <Card className="mb-4 shadow pr-10">
                    <div className="flex justify-between">
                        <DetailItem labelColor='overline' title='User' value='Name'
                                    icon={<UserOutlined className="text-lg text-secondarey"/>}/>
                        <DetailItem labelColor='overline' title='Order' value='O12302020'
                                    icon={<LinkOutlined className="text-lg text-secondarey"/>}/>
                        <DetailItem labelColor='overline' title='Scheduled Delivery Time'
                                    value='02.05.2020 | 12:30 - 13:30'
                                    icon={<HourglassOutlined className="text-lg text-secondarey"/>}/>
                        <DetailItem labelColor='overline' title='Driver' value='Name'
                                    icon={<FolderOpenOutlined className="text-lg text-secondarey"/>}/>
                        <DetailItem labelColor='overline' title='Drivered Time' value='12;41'
                                    icon={<HistoryOutlined className="text-lg text-secondarey"/>}/>
                        <DetailItem labelColor='overline' title='Fee' value='$ 15'
                                    icon={<DollarCircleOutlined className="text-lg text-secondarey"/>}/>
                    </div>
                    <div className="flex justify-between mt-10">
                        <DetailItem labelColor='overline' title='Destination'
                                    value='Address Line 2, Address Line 2, City, State, Country, Zip Code'
                                    icon={<EnvironmentOutlined className="text-lg text-secondarey"/>}/>
                        <div className="flex">
                            <span className="text-white bg-progress py-1 px-2">in progress</span>
                        </div>
                    </div>
                </Card>
            </Page>
        </AdminAuth>
    )
}

export default Deliveries;
