import React, {useState, useEffect} from 'react';
import {Tabs, Badge} from 'antd';
import {useRouter} from "next/router";

import Page from "../../../components/Page";
import Customers from "../../../components/Admin/Customers";
import Vendors from "../../../components/Admin/Vendors";
import Drivers from "../../../components/Admin/Drivers";
import AdminAuth from '../../../components/Admin/AdminAuth';
import {useDispatch} from "react-redux";

const {TabPane} = Tabs;

const Users = props => {
    const [pendingVendorsCount, setPendingVendorsCount] = useState(0);
    const dispatch = useDispatch();
    const router = useRouter();
    const {pathname} = router;
    const {tab} = router.query;

    useEffect(() => {
        (async () => {
            const res = await dispatch?.adminUser?.getPendingVendorsCount();
            setPendingVendorsCount(res?.data?.pending);
        })();
    }, []);

    const ExtraContent = (
        <div className="flex space-x-2">
            <span className="text-red-500">Pending Vendor Requests</span>
            <Badge count={pendingVendorsCount}></Badge>
        </div>
    );

    return (
        <AdminAuth>
            <Page title={false} headTitle={'Users'} breadcrumb={[{title: 'Users'}]}>
                <Tabs
                    defaultActiveKey={tab || 'customers'}
                    activeKey={tab || 'customers'}
                    onChange={(key) => router.push({pathname, query: {tab: key}})}
                    tabBarExtraContent={ExtraContent}
                >
                    <TabPane key='customers' tab='Customers'>
                        <Customers/>
                    </TabPane>
                    <TabPane key='vendors' tab='Vendors'>
                        <Vendors/>
                    </TabPane>
                    <TabPane key='drivers' tab='Drivers'>
                        <Drivers/>
                    </TabPane>
                </Tabs>
            </Page>
        </AdminAuth>
    )
}

export default Users;