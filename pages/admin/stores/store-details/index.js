import React from 'react';
import {Tabs} from 'antd';

import Page from "../../../../components/Page";
import Details from "../../../../components/Admin/Details";
import Product from "../../../../components/Admin/Product";
import Category from "../../../../components/Admin/Category";
import routes from "../../../../constants/routes";
import AdminAuth from '../../../../components/Admin/AdminAuth';
import {useRouter} from "next/router";

const {TabPane} = Tabs;

const StoreDetails = props => {
    const router = useRouter();
    const {pathname} = router;
    const {tab, storeId} = router.query;

    return (
        <AdminAuth>
            <Page title={false} headTitle={'Store'} breadcrumb={[{title: 'Store'}]}>
                <Tabs
                    defaultActiveKey={tab || 'details'}
                    activeKey={tab || 'details'}
                    onChange={(key) => router.push({pathname, query: {tab: key, storeId}})}
                >
                    <TabPane key='details' tab='Details'>
                        <Details/>
                    </TabPane>
                    <TabPane key='product' tab='Product'>
                        <Product/>
                    </TabPane>
                    <TabPane key='category' tab='Category'>
                        <Category/>
                    </TabPane>
                </Tabs>
            </Page>
        </AdminAuth>
    )
}

/*export async function getServerSideProps({ req, res, query }) {
    let cookies = cookie.parse(req.headers.cookie || '');
    let token = cookies.token

    let profile = {};
    let defaultTab = 'products';

    if (!token) {
        res.writeHead(307, { Location: routes.admin.auth.login });
        res.end();
        return {
            props: {
                profile,
                defaultTab
            }
        };
    }

    if(cookies.type !== 'vendor') {
        res.writeHead(307, { Location: userTypes[cookies.type].profile });
        res.end();
        return {
            props: {
                profile,
                defaultTab
            }
        };
    }

    const store = getStore();
    try {
        const response = await store.dispatch.vendorProfile.getProfile({
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if(response) {
            profile = response;
        }
        defaultTab = ['products', 'categories'].includes(query.tab) ? query.tab : 'products';

        return {
            props: {
                profile,
                defaultTab
            }
        };

    } catch(e) {
        console.log(e);
        return {
            props: {
                profile,
                defaultTab
            }
        }
    }


}*/

export default StoreDetails;