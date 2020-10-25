import React from 'react';
import { Row, Col } from 'antd';

import {LocationIcon, MailIcon, PhoneIcon} from '../../icons';

const ContactSubFooter = () => {
    return (
        <div className="pt-11 pb-10 bg-third w-full">
            <Row gutter={[24, 36]} className={'layout__section'}>
                <Col lg={12} md={24} xs={24}>
                    <div className="flex flex-col">
                        <div className="flex flex-row items-center">
                            <LocationIcon className="mr-2" color={'white'} />
                            <h5 className="text-white font-medium text-base mt-0 mb-0">Address</h5>
                        </div>
                        <span className="text-header pt-3 text-base">3334 Brew Creek Rd, Pender Harbour, British Columbia, Canada, V0N 2H0</span>
                    </div>
                </Col>
                <Col md={12} xs={24} lg={6}>
                    <div className="flex flex-col">
                        <div className="flex flex-row items-center">
                            <MailIcon className="mr-2" color={'white'} />
                            <h5 className="text-white font-medium text-base mt-0 mb-0">Email</h5>
                        </div>
                        <span className="text-header pt-3 text-base">Info@Cart2Crub</span>
                    </div>
                </Col>
                <Col md={12} xs={24} lg={6}>
                    <div className="flex flex-col">
                        <div className="flex flex-row items-center">
                            <PhoneIcon className="mr-2" color={'white'} />
                            <h5 className="text-white font-medium text-base mt-0 mb-0">Phone Number</h5>
                        </div>
                        <span className="text-header pt-3 text-base">548 883 2278</span>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ContactSubFooter;