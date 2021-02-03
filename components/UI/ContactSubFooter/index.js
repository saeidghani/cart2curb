import React from 'react';
import { Row, Col } from 'antd';

import {LocationIcon, MailIcon, PhoneIcon} from '../../icons';

const ContactSubFooter = () => {
    return (
        <div className="pt-11 pb-10 bg-third w-full">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-start layout__section">
                <div className="flex flex-col mb-8 lg:mb-0 lg:flex-grow">
                    <div className="flex flex-row items-center">
                        <MailIcon className="mr-2" color={'white'} />
                        <h5 className="text-white font-medium text-base mt-0 mb-0">Email</h5>
                    </div>
                    <span className="text-header pt-3 text-base">Sales@cart2curb.com</span>
                </div>
                <div className="flex flex-col lg:flex-grow">
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