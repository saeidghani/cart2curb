import React from 'react';
import {Tabs} from 'antd';
import {useRouter} from "next/router";

import Page from "../../../components/Page";
import Customers from "../../../components/Admin/Customers";
import Vendors from "../../../components/Admin/Vendors";
import Drivers from "../../../components/Admin/Drivers";
import AdminAuth from '../../../components/Admin/AdminAuth';

const {TabPane} = Tabs;

const Users = props => {
    const router = useRouter();
    const {pathname} = router;
    const {tab} = router.query;

    return (
        <AdminAuth>
            <Page title={false} headTitle={'Users'} breadcrumb={[{title: 'Users'}]}>
                <Tabs
                    defaultActiveKey={tab || 'customers'}
                    activeKey={tab || 'customers'}
                    onChange={(key) => router.push({pathname, query: {tab: key}})}
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