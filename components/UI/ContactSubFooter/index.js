import React from 'react';
import { Row, Col } from 'antd';

import {LocationIcon, MailIcon, PhoneIcon} from '../../icons';

const ContactSubFooter = () => {
    return (
        <div className="pt-11 pb-10 bg-third w-full">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between layout__section">
                <div className="flex flex-col mb-8 lg:mb-0">
                    <div className="flex flex-row items-center">
                        <LocationIcon className="mr-2" color={'white'} />
                        <h5 className="text-white font-medium text-base mt-0 mb-0">Address</h5>
                    </div>
                    <span className="text-header pt-3 text-base">3334 Brew Creek Rd, Pender Harbour, British Columbia, Canada, V0N 2H0</span>
                </div>
                <div className="flex flex-col mb-8 lg:mb-0">
                    <div className="flex flex-row items-center">
                        <MailIcon className="mr-2" color={'white'} />
                        <h5 className="text-white font-medium text-base mt-0 mb-0">Email</h5>
                    </div>
                    <span className="text-header pt-3 text-base">Info@Cart2Crub</span>
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-row items-center">
                        <PhoneIcon className="mr-2" color={'white'} />
                        <h5 className="text-white font-medium text-base mt-0 mb-0">Phone Number</h5>
                    </div>
                    <span className="text-header pt-3 text-base">548 883 2278</span>
                </div>
            </div>
        </div>
    );
};

export default ContactSubFooter;