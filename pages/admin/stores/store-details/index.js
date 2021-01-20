import React, {useEffect} from 'react';
import {Tabs} from 'antd';

import Page from "../../../../components/Page";
import Details from "../../../../components/Admin/Stores/Details";
import Product from "../../../../components/Admin/Stores/Product";
import Service from "../../../../components/Admin/Stores/Service";
import Category from "../../../../components/Admin/Stores/Category";
import AdminAuth from '../../../../components/Admin/AdminAuth';
import {useRouter} from "next/router";
import routes from "../../../../constants/routes";

const {TabPane} = Tabs;

const StoreDetails = props => {
    const router = useRouter();
    const {pathname} = router;
    const {tab='details', storeId, storeType} = router.query;

    const capitalize = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const breadcrumb = [
        {
            title: 'Stores',
            href: routes.admin.stores.index,
        },
        {
            title: `${capitalize(tab)}`,
            href: routes.admin.stores.storeDetails,
            query: {tab, storeId, storeType}
        },
    ];

    return (
        <AdminAuth>
            <Page title={false} headTitle={'Store'} breadcrumb={breadcrumb}>
                <Tabs
                    defaultActiveKey={tab}
                    activeKey={tab}
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