import React, {useState} from 'react';
import {Button} from 'antd';
import {SoundTwoTone, SoundOutlined, EnvironmentOutlined, CloseOutlined} from '@ant-design/icons';
import Timer from 'react-compound-timer';
import Link from "next/link";

import DriverPage from '../../../../components/DriverPage';
import routes from '../../../../constants/routes';
import Loader from "../../../../components/UI/Loader";
import {useSelector} from "react-redux";

const Current = () => {
    const [hasNoDeliveries, setHasNoDeliveries] = useState(false);
    const availableDeliveriesloading = useSelector(state => state?.loading?.effects?.driverDelivery?.getAvailableDeliveries);

    const EmptyDelivery = ({}) => (
        <div className="flex flex-col">
            <div className="flex justify-center mt-10 space-x-2 text-6xl transform -rotate-45"
                 style={{color: '#8C8C8C'}}>
                <SoundOutlined className=""/>
                <CloseOutlined className="text-3xl pt-5"/>
            </div>
            <p className="text-paragraph mt-8 mb-10 px-10 text-center">You dont have any open
                deliveries now!</p>
        </div>
    );

    const DeliveryCard = ({}) => (
        <>
            <div className="text-center"><SoundTwoTone className="text-6xl transform -rotate-45"/></div>
            <div className="text-xs font-normal mt-9 text-paragraph">
                Delivery Countdown
            </div>
            <div className="text-6xl font-medium text-center">
                <Timer
                    initialTime={119000}
                    direction="backward"
                    //onStart={() => handleSendAgain()}
                    //onResume={() => handleSendAgain()}
                    //onReset={() => handleSendAgain()}
                >
                    {({reset, resume, start, getTimerState}) => (
                        <div className="text-center">
                            <span>0<Timer.Hours/>:</span>
                            <span>0<Timer.Minutes/>:</span>
                            <span><Timer.Seconds/></span>
                            <div>{getTimerState() === 'STOPPED' && <span>a</span>}</div>
                        </div>
                    )}
                </Timer>
            </div>
            <div className="flex mt-7">
                <div className="w-6/12">
                    <div className="text-xs font-normal text-overline">
                        Sources
                    </div>
                    <div className="font-normal text-sm">
                        Store #1
                    </div>
                </div>
                <div className="w-6/12 flex items-center">
                    <EnvironmentOutlined className="text-secondarey text-2xl mx-2"/>
                    <div className="text-secondarey text-xs font-normal">Show on Map</div>
                </div>
            </div>
            <div className="flex mt-7">
                <div className="w-6/12">
                    <div className="text-xs font-normal text-overline">
                        Start Time
                    </div>
                    <div className="font-normal text-sm">
                        11:50
                    </div>
                </div>
                <div className="w-6/12">
                    <div className="text-xs font-normal text-overline">
                        Delivery Fee
                    </div>
                    <div className="font-normal text-sm">
                        $15
                    </div>
                </div>
            </div>
            <div className="mt-7">
                <div className="text-xs font-normal text-overline">
                    Scheduled Delivery Time
                </div>
                <div className="font-normal text-sm">
                    02.05.2020 | 12:30 - 13:30
                </div>
            </div>
            <div className="mt-7">
                <div className="text-xs font-normal text-overline">
                    Destination
                </div>
                <div className="font-normal text-sm">
                    Address Line 2, Address Line 2, City, State, Country, Zip Code
                </div>
            </div>
            <Link href={routes.driver.customerOrders}>
                <Button
                    className="w-full mt-16 p-4 text-center border border-current border-solid text-sm font-normal items-center flex justify-center">
                    See Customer Orders
                </Button>
            </Link>
            <Button
                className="w-full mt-12 p-4 text-center bg-btn text-sm font-normal items-center flex justify-center text-white">
                Complete
            </Button>
            <Link href={routes.driver.deliveries.available}>
                <Button
                    className="w-full mt-3 p-4 text-center text-sm font-normal items-center flex justify-center"
                    type="link"
                >
                    Back
                </Button>
            </Link>
        </>
    );

    return (
        <DriverPage title="Current Deliveries">
            <div className="w-full shadow-lg p-8">
                {hasNoDeliveries ? <EmptyDelivery/> : availableDeliveriesloading ?
                    <div className="flex justify-center"><Loader/></div> : <DeliveryCard/>}
            </div>
        </DriverPage>
    );
}
export default Current;