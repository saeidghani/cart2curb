import React from 'react';
import { Row, Col } from 'antd';

import Page from '../../components/Page';
import {CreditCartIcon, ShoppingCartIcon, SmilingIcon} from "../../components/icons";

const AboutUs = props => {
    return (
        <Page title={false} breadcrumb={[{ title: 'About Us'}]}>
            <Row gutter={[24, 24]} align={'stretch'}>
                <Col xs={24} lg={16}>
                    <h1 className="text-2xl text-type font-medium mt-0 mb-4">About Us</h1>
                    <p className="text-paragraph text-base mb-12">The easiest way to shop your groceries and have them delivered to your doorstep in about 30 or 60 minutes average time depending on your location. We offer a convenient and seamless grocery shopping experience that frees you from the unavoidable chore of heading to the supermarket with all the challenges you may face there. The result? More time to enjoy doing the things you love the most with the people you love the most!</p>
                    <h2 className="text-2xl text-type font-medium mt-0 mb-4">Our Goal</h2>
                    <p className="text-paragraph text-base mb-12">Our goal is to give people like you the opportunity to get your groceries without the hassle . Our goal is to bring the supermarket right at home. The company is based in Canada.</p>
                </Col>
                <Col xs={24} lg={8}>
                    <img src={'/images/about.png'} alt={'about us image'} className={'block w-full rounded-xl'} style={{ maxHeight: 360, objectFit: 'cover'}}/>
                </Col>
            </Row>
            <Row gutter={[24, 24]} className={'pt-17'} align={'stretch'}>
                <Col xs={24} className={'flex items-center justify-center'}>
                    <h2 className="text-2xl text-type font-medium mt-0 mb-4">What do we do</h2>
                </Col>
                <Col xs={24} md={8}>
                    <div className="rounded border border-overline px-6 lg:px-10 py-9 flex flex-col item-center h-full">
                        <h4 className="text-center text-paragraph font-medium text-base">Select</h4>
                        <ShoppingCartIcon  className="mt-5.5 self-center"/>
                        <p className="text-header pt-9 font-normal text-base">Pick your favorite groceries online from anywhere at your comfort.</p>
                    </div>
                </Col>
                <Col xs={24} md={8}>
                    <div className="rounded border border-overline px-6 lg:px-10 py-9 flex flex-col item-center h-full">
                        <h4 className="text-center text-paragraph font-medium text-base">Pay</h4>
                        <CreditCartIcon  className="mt-5.5 self-center"/>
                        <p className="text-header pt-9 font-normal text-base">No parking costs and no fuel costs. Cart2Curb also has awesome deals every day.</p>
                    </div>
                </Col>
                <Col xs={24} md={8}>
                    <div className="rounded border border-overline px-6 lg:px-10 py-9 flex flex-col item-center h-full">
                        <h4 className="text-center text-paragraph font-medium text-base">Relax</h4>
                        <SmilingIcon  className="mt-5.5 self-center"/>
                        <p className="text-header pt-9 font-normal text-base">Let us do the grocery run for you, so you can enjoy your time with yourself or your family.</p>
                    </div>
                </Col>
            </Row>
        </Page>
    )
}

export default AboutUs;