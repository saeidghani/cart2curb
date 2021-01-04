import React from 'react';
import { Tabs } from 'antd';
import cookie from "cookie";

import Page from "../../../components/Page";
import Customers from "../../../components/Admin/Customers";
import Vendors from "../../../components/Admin/Vendors";
import Drivers from "../../../components/Admin/Drivers";
import routes from "../../../constants/routes";
import userTypes from "../../../constants/userTypes";
import {getStore} from "../../../states";

const { TabPane } = Tabs;

const Users = props => {
    return (
        <Page title={false} headTitle={'Store'}  breadcrumb={[{ title: 'Store' }]}>
            <Tabs defaultActiveKey={props.defaultTab}>
                <TabPane key='customers' tab='Customers'>
                    <Customers vendor={props.profile}/>
                </TabPane>
                <TabPane key='vendors' tab='Vendors'>
                    <Vendors vendor={props.profile}/>
                </TabPane>
                <TabPane key='drivers' tab='Drivers'>
                    <Drivers vendor={props.profile}/>
                </TabPane>
            </Tabs>
        </Page>
    )
}

export default Users;