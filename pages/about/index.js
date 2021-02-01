import React from 'react';
import { Row, Col } from 'antd';

import './styles.less';
import Page from '../../components/Page';
import {CreditCartIcon, ShoppingCartIcon, SmilingIcon} from "../../components/icons";

const AboutUs = props => {
    return (
        <Page title={false} headTitle={'About Us'} breadcrumb={[{ title: 'About Us'}]}>
            <Row gutter={[24, 24]} align={'stretch'}>
                <Col xs={24} lg={14} className={'order-last lg:order-first'}>
                    <div className={'lg:pr-16'}>
                        <h1 className="about-us__title text-2xl text-type font-semibold mt-4 lg:mt-12">About Us</h1>
                        <p className="text-paragraph text-base mb-12">
                            Cart 2 Curb Ltd was founded by 5 local colleagues in April 2020 in response to the novel
                            coronavirus pandemic COVID-19 that placed us into lockdown and furloughed us from previous
                            jobs. Seeing the constant growth of home delivery services even prior to COVID-19, and its
                            explosive growth since, we realized that there was a gap in the established home delivery
                            services for many local businesses that either couldn’t afford to pivot online or pay the
                            exorbitant fees that the larger corporations were charging to provide home delivery.<br />
                            <br />
                            Simultaneously we came across many customers that were unhappy with the status quo of
                            ordering items online only to receive orders that were rife with product omissions or
                            unplanned substitutions and only being able to order from big box retailers and
                            nationwide chain stores.<br />
                            <br />
                            In order to combat these scenarios we have been constantly meeting with and adding
                            local partner stores for you to shop from, at a fraction of the cost of the bigger
                            guys, allowing you to stay home, save time and support local!<br />
                            <br />
                            Since these stores have worked hard to create that ideal shopping experience for
                            you, we established LiveCart, our real-time live streaming shopping experience,
                            in August of 2020 to bring you back into those stores while staying safe at
                            home. We will always strive to bring the store to your door!
                        </p>
                        <h2 className="about-us__title text-2xl text-type font-semibold mt-0 mb-4">Our Goal</h2>
                        <p className="text-paragraph text-base mb-12">
                            We aim to be the leader in connecting you to the local stores you love! Supporting local
                            businesses keeps money in our communities and employs our friends and neighbours so making
                            it more accessible for you to provide that support is what we are all about. We’re going to
                            go the distance to make sure we can&nbsp;<strong><em>bring the store to your
                            door!</em></strong>
                        </p>
                    </div>
                </Col>
                <Col xs={24} lg={10} className={'order-first lg:order-last'}>
                    <img src={'/images/about.png'} alt={'about us image'} className={'about-us__image block'}/>
                </Col>
            </Row>
            <Row gutter={[30, 30]} className={'pt-17'} align={'stretch'}>
                <Col xs={24} className={'flex items-center justify-center mb-5'}>
                    <h2 className="about-us__title about-us__title--centered mt-0" />
                </Col>
                <Col xs={24} md={8} className={'flex flex-col items-stretch justify-center'}>
                    <div className="flex rounded-lg flex-col justify-center items-center text-p text-paragraph">
                        <img src={'/images/about-1.jpg'} alt className={'w-full h-auto'}/>
                    </div>
                </Col>
                <Col xs={24} md={8} className={'flex flex-col items-stretch justify-center'}>
                    <div className="flex rounded-lg flex-col justify-center items-center text-p text-paragraph">
                        <img src={'/images/about-2.jpg'} alt className={'w-full h-auto'}/>
                    </div>
                </Col>
                <Col xs={24} md={8} className={'flex flex-col items-stretch justify-center'}>
                    <div className="flex rounded-lg flex-col justify-center items-center text-p text-paragraph">
                        <img src={'/images/about-3.jpg'} alt className={'w-full h-auto'}/>
                    </div>
                </Col>
            </Row>
        </Page>
    )
}

export default AboutUs;