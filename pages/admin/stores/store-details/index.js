import React from 'react';
import {Tabs} from 'antd';

import Page from "../../../../components/Page";
import Details from "../../../../components/Admin/Details";
import Product from "../../../../components/Admin/Product";
import Service from "../../../../components/Admin/Service";
import Category from "../../../../components/Admin/Category";
import AdminAuth from '../../../../components/Admin/AdminAuth';
import {useRouter} from "next/router";

const {TabPane} = Tabs;

const StoreDetails = props => {
    const router = useRouter();
    const {pathname} = router;
    const {tab, storeId, storeType} = router.query;

    return (
        <AdminAuth>
            <Page title={false} headTitle={'Store'} breadcrumb={[{title: 'Store'}]}>
                <Tabs
                    defaultActiveKey={tab || 'details'}
                    activeKey={tab || 'details'}
                    onChange={(key) => router.push({pathname, query: {tab: key, storeId, storeType}})}
                >
                    <TabPane key='details' tab='Details'>
                        <Details/>
                    </TabPane>
                    {storeType === 'product' ?
                        <TabPane key='product' tab='Product'>
                            <Product/>
                        </TabPane> :
                        <TabPane key='service' tab='Service'>
                            <Service/>
                        </TabPane>
                    }
                    <TabPane key='category' tab='Category'>
                        <Category/>
                    </TabPane>
                </Tabs>
            </Page>
        </AdminAuth>
    )
}

export default StoreDetails;