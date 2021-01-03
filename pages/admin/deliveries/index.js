import React, {useEffect} from 'react';
import {Select, Divider, Button, Card} from 'antd';
import {UserOutlined} from '@ant-design/icons';

import Page from "../../../components/Page";
import DetailItem from "../../../components/UI/DetailItem";
import routes from "../../../constants/routes";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../../../components/UI/Loader";
import AdminAuth from "../../../components/Admin/AdminAuth";

const Deliveries = props => {
    const dispatch = useDispatch();
    const deliveries = useSelector(state => state?.adminDelivery?.deliveries);
    const loadingDelivery = useSelector(state => state?.loading?.effects?.adminDelivery?.getDeliveries);
    const isLoggedIn = useSelector(state => state?.adminAuth?.isLoggedIn);

    useEffect(() => {
        if (isLoggedIn) {
            dispatch?.adminDelivery?.getDeliveries();
        }
    }, [isLoggedIn]);

    const {Option} = Select;

    if (loadingDelivery) return (
        <div className="flex items-center justify-center py-10">
            <Loader/>
        </div>
    );

    return (
        <AdminAuth>
            <Page title={false} headTitle={'Deliveries'} breadcrumb={[{title: 'Deliveries'}]}>
                <div className=''>
                    <div className="">
                        <div className="">Filter By Status</div>
                        <Select placeholder='Filter By Status'>
                            <Option value={'product'}>Product</Option>
                        </Select>
                    </div>
                    <div>
                        <div className="">Filter By Date</div>
                        <Select placeholder='Sort by Date'>
                            <Option value={'product'}>Product</Option>
                        </Select>
                    </div>
                </div>
                <Card>
                    <DetailItem title='User' value='Name' icon={<UserOutlined className="text-lg text-secondarey"/>}/>
                    <DetailItem title='Order' value='O12302020'
                                icon={<UserOutlined className="text-lg text-secondarey"/>}/>
                    <DetailItem title='Scheduled Delivery Time' value='02.05.2020 | 12:30 - 13:30'
                                icon={<UserOutlined className="text-lg text-secondarey"/>}/>
                    <DetailItem title='Destination'
                                value='Address Line 2, Address Line 2, City, State, Country, Zip Code'
                                icon={<UserOutlined className="text-lg text-secondarey"/>}/>
                    <Divider type="vertical"/>
                    <div className="">Driver</div>
                    <Select placeholder=''>
                        <Option value=''>Product</Option>
                    </Select>
                    <Button type="primary">
                        Assign
                    </Button>
                </Card>
                <Card>
                    <DetailItem title='User' value='Name' icon={<UserOutlined className="text-lg text-secondarey"/>}/>
                    <DetailItem title='Order' value='O12302020'
                                icon={<UserOutlined className="text-lg text-secondarey"/>}/>
                    <DetailItem title='Scheduled Delivery Time' value='02.05.2020 | 12:30 - 13:30'
                                icon={<UserOutlined className="text-lg text-secondarey"/>}/>
                    <DetailItem title='Driver' value='Name' icon={<UserOutlined className="text-lg text-secondarey"/>}/>
                    <DetailItem title='Drivered Time' value='12;41'
                                icon={<UserOutlined className="text-lg text-secondarey"/>}/>
                    <DetailItem title='Fee' value='$ 15' icon={<UserOutlined className="text-lg text-secondarey"/>}/>
                    <DetailItem title='Destination'
                                value='Address Line 2, Address Line 2, City, State, Country, Zip Code'
                                icon={<UserOutlined className="text-lg text-secondarey"/>}/>
                    <div className="">
                        <div className="">
                            Destination
                        </div>
                        <div className="">
                            Address Line 2, Address Line 2, City, State, Country, Zip Code
                        </div>
                    </div>
                    <span className="text-white bg-completed py-1 px-2">
                    completed
                </span>
                    <span className="text-white bg-progress py-1 px-2">
                    in progress
                </span>
                </Card>
            </Page>
        </AdminAuth>
    )
}

export default Deliveries;
