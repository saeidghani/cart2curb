import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import DriverPage from '../../../components/DriverPage';
const Profile = () =>{
    return(
        <DriverPage>
            <div className="flex justify-between mb-8">
               <div className="text-2xl font-medium">Profile</div>
               <div className="flex">
                    <a className="font-normal text-base text-info">Change Password</a>
                    <a className="ml-7 font-normal text-base text-info">Edit</a>
               </div>
            </div>
            <div className="w-full shadow-lg p-8">
                <div className="flex items-center">
                    <Avatar shape="square" size={80} icon={<UserOutlined />} />
                    <div className="ml-8">
                        <div className="text-xs font-normal text-icon">
                            Name
                        </div>
                        <div className="font-medium text-2xl">
                            Jason Mras
                        </div>
                    </div>
                </div>
                <div className="mt-7">
                    <div className="text-xs font-normal text-icon">
                        Email
                    </div>
                    <div className="font-normal text-sm">
                        jasonmraz@gmail.com
                    </div>
                </div>
                <div className="mt-7">
                    <div className="text-xs font-normal text-icon">
                        Birthday
                    </div>
                    <div className="font-normal text-sm">
                        02.02.1988
                    </div>
                </div>
                <div className="mt-7 flex justify-between">
                    <div>
                        <div className="text-xs font-normal text-icon">
                            Proof of Insurance
                        </div>
                        <div className="font-normal text-sm">
                            insurance-screenshot.png
                        </div>
                    </div>
                    <div>
                        <Avatar shape="square" size="large" icon={<UserOutlined />} />
                    </div>
                </div>
                <div className="mt-7 flex justify-between">
                    <div>
                        <div className="text-xs font-normal text-icon">
                            Driver License Picture
                        </div>
                        <div className="font-normal text-sm">
                            driver-license.png
                        </div>
                    </div>
                    <div>
                        <Avatar shape="square" size="large" icon={<UserOutlined />} />
                    </div>
                </div>
            </div>  
        </DriverPage>
    )
}
export default Profile;