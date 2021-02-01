import React from 'react';
import { Row, Col } from 'antd';

import Page from '../../components/Page';
import {CreditCartIcon, ShoppingCartIcon, SmilingIcon} from "../../components/icons";

const AboutUs = props => {
    return (
        <Page title={false} headTitle={'About Us'} breadcrumb={[{ title: 'About Us'}]}>
            <Row gutter={[24, 24]} align={'stretch'}>
                <Col xs={24} lg={16}>
                    <h1 className="text-2xl text-type font-medium mt-0 mb-4">About Us</h1>
                    <p className="text-paragraph text-base">Cart 2 Curb Ltd was founded by 5 local colleagues in April 2020 in response to the novel coronavirus pandemic COVID-19 that placed us into lockdown and furloughed us from previous employment. Seeing the constant growth of home delivery services even prior to COVID-19, and its explosive growth since, we realized that there was a gap in the established home delivery services for many local businesses that either couldn’t afford to pivot online or pay the exorbitant fees that the larger corporations were charging to provide home delivery. Simultaneously we came across many customers that were unhappy with the status quo of ordering items online only to receive orders that were rife with product omissions or unplanned substitutions and only being able to order from big box retailers and nationwide chain stores.</p>
                    <br/>
                    <p className="text-paragraph text-base mb-12">In order to combat these scenarios we have been constantly meeting with and adding local partner stores for you to shop from, at a fraction of the cost of the bigger guys, allowing you to stay home, save time and support local! And since these stores have worked hard to create that ideal shopping experience for you, we established LiveCart, our real-time live streaming shopping experience, in August of 2020 to bring you back into those stores while staying safe at home. We will always strive to bring the store to your door!</p>
                    <h2 className="text-2xl text-type font-medium mt-0 mb-4">Our Goal</h2>
                    <p className="text-paragraph text-base mb-12">Our goal is to give people like you the opportunity to get your groceries without the hassle . Our goal is to bring the supermarket right at home. The company is based in Canada.</p>
                </Col>
                <Col xs={24} lg={8}>
                    <img src={'/images/about.png'} alt={'about us image'} className={'block w-full rounded-xl'} style={{ maxHeight: 360, objectFit: 'cover'}}/>
                </Col>
            </Row>
            <Row gutter={[24, 24]} className={'pt-17'} align={'stretch'}>
                <Col xs={24} className={'flex items-center justify-center'}>
                    <h2 className="text-xl text-type font-medium mt-0 mb-4">What do we do</h2>
                </Col>
                <Col xs={24} md={8}>
                    <div className="rounded border border-overline px-6 lg:px-10 py-9 flex flex-col item-center h-full">
                        <h4 className="text-center text-paragraph font-medium text-base">Select</h4>
                        <ShoppingCartIcon  className="mt-5.5 self-center"/>
                        <p className="text-header pt-9 pb-4 font-normal text-base">Pick your favorite groceries online from anywhere at your comfort.</p>
                    </div>
                </Col>
                <Col xs={24} md={8}>
                    <div className="rounded border border-overline px-6 lg:px-10 py-9 flex flex-col item-center h-full">
                        <h4 className="text-center text-paragraph font-medium text-base">Pay</h4>
                        <CreditCartIcon  className="mt-5.5 self-center"/>
                        <p className="text-header pt-9 pb-4 font-normal text-base">No parking costs and no fuel costs. Cart2Curb also has awesome deals every day.</p>
                    </div>
                </Col>
                <Col xs={24} md={8}>
                    <div className="rounded border border-overline px-6 lg:px-10 py-9 flex flex-col item-center h-full">
                        <h4 className="text-center text-paragraph font-medium text-base">Relax</h4>
                        <SmilingIcon  className="mt-5.5 self-center"/>
                        <p className="text-header pt-9 pb-4 font-normal text-base">Let us do the grocery run for you, so you can enjoy your time with yourself or your family.</p>
                    </div>
                </Col>
            </Row>
        </Page>
    )
}

export default AboutUs;