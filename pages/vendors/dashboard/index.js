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
            <Tabs defaultActiveKey={'products'}>
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

export async function getServerSideProps({ req, res }) {
    let cookies = cookie.parse(req.headers.cookie || '');
    let token = cookies.token

    let profile = {};

    if (!token) {
        res.writeHead(307, { Location: routes.vendors.auth.login });
        res.end();
        return {
            props: {
                profile
            }
        };
    }

    if(cookies.type !== 'vendor') {
        res.writeHead(307, { Location: userTypes[cookies.type].profile });
        res.end();
        return {
            props: {
                profile
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

        return {
            props: {
                profile
            }
        };

    } catch(e) {
        console.log(e);
        return {
            props: {
                profile
            }
        }
    }


}

export default Dashboard;