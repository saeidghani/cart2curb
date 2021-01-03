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

export default Users;