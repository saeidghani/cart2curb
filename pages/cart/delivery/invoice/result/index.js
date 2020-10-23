import React from 'react';
import {
    Row,
    Col,
    Divider,
} from 'antd';

import Page from '../../../../../components/Page';
import {HeaderLogoIcon} from "../../../../../components/icons";
import DetailItem from "../../../../../components/UI/DetailItem";
import Link from "next/link";
import routes from "../../../../../constants/routes";

const Invoices = props => {
    const breadcrumb = [
        {
            title: 'Cart',
            href: '/cart'
        },
        {
            title: 'Delivery',
            href: '/cart/delivery'
        },
        {
            title: 'Invoice'
        }
    ]

    return (
        <Page title={'Success'} breadcrumb={breadcrumb}>
            <Row gutter={[24, 24]}>
                <Col xs={24} md={12} lg={18}>
                    <HeaderLogoIcon/>
                </Col>

                <Col xs={24} md={12} lg={6}>
                    <DetailItem title={'Date'} value={'2020.02.20'}/>
                </Col>
                <Col xs={24} md={12} lg={6}>
                    <DetailItem title={'Company'} value={'Cart2Curb'}/>
                </Col>
                <Col xs={24} md={12} lg={6}>
                    <DetailItem title={'Phone Number'} value={'+1 234 (567) 7342'}/>
                </Col>
                <Col xs={24} md={12} lg={6}>
                    <DetailItem title={'Email Address'} value={'info@Cart2curb.com'}/>
                </Col>

                <Col xs={24} md={12} lg={6}>
                    <DetailItem title={'Order Number'} value={'#21'}/>
                </Col>

                <div className="w-full px-3">
                    <Divider className={'my-8'}/>
                </div>

                <Col xs={24}>
                    <DetailItem title={'Order Submitted'} value={'Order # was successfully submited. We have sent your order info + invoice to your email.'}/>
                </Col>

                <Col xs={24}>
                    <div className="flex flex-row text-center items-center justify-center pt-20">
                        <Link href={routes.homepage}>
                            <a className="pl-2 text-info font-medium cursor-pointer text-base underline">Go Back to Home</a>
                        </Link>
                    </div>
                </Col>

            </Row>
        </Page>
    )
}

export default Invoices;