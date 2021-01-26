import React from 'react';
import {Button} from 'antd';
import { SoundTwoTone, EnvironmentOutlined } from '@ant-design/icons';
import DriverPage from '../../../../components/DriverPage';
const Profile = () =>{
    return(
        <DriverPage title="Current Deliveries">
            <div className="w-full shadow-lg p-8">
                <div className="text-center"><SoundTwoTone  className="text-6xl transform -rotate-45"/></div>
                <div className="text-xs font-normal mt-9 text-paragraph">
                    Delivery Countdown
                </div>
                <div className="text-6xl font-medium text-center">
                    01:35:09
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
                        02.05.2020   |   12:30 - 13:30
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
                <Button className="w-full mt-16 p-4 text-center border border-current border-solid text-sm font-normal items-center flex justify-center">See Customer Orders</Button>
                <Button className="w-full mt-12 p-4 text-center bg-btn text-sm font-normal items-center flex justify-center text-white">Complete</Button>
            </div>
        </DriverPage>
    )
}
export default Profile;