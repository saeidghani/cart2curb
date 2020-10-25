import React from 'react';
import { Tabs } from 'antd';

import Page from "../../../components/Page";
import Products from "../../../components/Products";
import Categories from "../../../components/Categories";

const { TabPane } = Tabs;

const Dashboard = props => {
    return (
        <Page title={false} breadcrumb={[{ title: 'Store' }]}>
            <Tabs defaultActiveKey={'products'}>
                <TabPane key={'products'} tab={'Products'}>
                    <Products/>
                </TabPane>
                <TabPane key={'categories'} tab={'Categories'}>
                    <Categories/>
                </TabPane>
            </Tabs>
        </Page>
    )
}

export default Dashboard;