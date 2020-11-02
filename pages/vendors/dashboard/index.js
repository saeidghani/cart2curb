import React from 'react';
import { Tabs } from 'antd';

import Page from "../../../components/Page";
import Products from "../../../components/Products";
import Categories from "../../../components/Categories";
import cookie from "cookie";
import routes from "../../../constants/routes";
import {getStore} from "../../../states";
import userTypes from "../../../constants/userTypes";

const { TabPane } = Tabs;

const Dashboard = props => {
    return (
        <Page title={false} breadcrumb={[{ title: 'Store' }]}>
            <Tabs defaultActiveKey={props.defaultTab}>
                <TabPane key={'products'} tab={'Products'}>
                    <Products vendor={props.profile}/>
                </TabPane>
                <TabPane key={'categories'} tab={'Categories'}>
                    <Categories vendor={props.profile}/>
                </TabPane>
            </Tabs>
        </Page>
    )
}

export async function getServerSideProps({ req, res, query }) {
    let cookies = cookie.parse(req.headers.cookie || '');
    let token = cookies.token

    let profile = {};
    let defaultTab = 'products';

    if (!token) {
        res.writeHead(307, { Location: routes.vendors.auth.login });
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


}

export default Dashboard;