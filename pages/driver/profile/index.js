import React, {useEffect} from 'react';
import {Avatar} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import Link from "next/link";

import DriverPage from '../../../components/Driver/DriverPage';
import DriverAuth from '../../../components/Driver/DriverAuth';
import moment from "moment";
import routes from "../../../constants/routes";
import Loader from "../../../components/UI/Loader";

const Profile = () => {
    const dispatch = useDispatch();
    const token = useSelector(state => state?.driverAuth?.token);
    const profile = useSelector(state => state?.driverProfile?.profile);
    const loading = useSelector(state => state?.loading?.effects?.driverProfile?.getProfile);
    const router = useRouter();

    useEffect(() => {
        if (token) {
            dispatch?.driverProfile?.getProfile({token});
        }
    }, [token]);

    const {proofOfInsurance, name, email, phone, birthdate, license, image} = profile || {};
    const insuranceSrc = proofOfInsurance?.length > 0 ? proofOfInsurance[0] : '';
    const formattedBirthdate = birthdate ? moment(birthdate).format('DD-MM-YYYY') : '';

    return (
        <DriverAuth>
            <DriverPage>
                <div className="flex justify-between items-center mb-6">
                    <div className="text-2xl font-medium">Profile</div>
                    <div className="flex">
                        <Link href={routes.driver.profile.changePassword}>
                            <div className="font-normal text-base text-info">Change Password</div>
                        </Link>
                        <Link href={routes.driver.profile.edit}>
                            <div className="ml-7 font-normal text-base text-info">Edit</div>
                        </Link>
                    </div>
                </div>
                {loading ? <div className="flex justify-center" style={{minHeight: 500}}><Loader/></div> :
                <div className="w-full shadow-lg p-8">
                    <div className="flex items-center">
                        <Avatar shape="square" size={80} icon={<UserOutlined/>} src={image}/>
                        <div className="ml-8">
                            <div className="text-xs font-normal text-icon">
                                Name
                            </div>
                            <div className="font-medium text-2xl">
                                {name}
                            </div>
                        </div>
                    </div>
                    <div className="mt-7">
                        <div className="text-xs font-normal text-icon">
                            Email
                        </div>
                        <div className="font-normal text-sm">
                            {email}
                        </div>
                    </div>
                    <div className="mt-7">
                        <div className="text-xs font-normal text-icon">
                            Birthday
                        </div>
                        <div className="font-normal text-sm">
                            {formattedBirthdate}
                        </div>
                    </div>
                    <div className="mt-7 flex justify-between items-center">
                        <div className="text-xs font-normal text-icon">
                            Proof of Insurance
                        </div>
                        <div>
                            <Avatar shape="square" size="large" icon={<UserOutlined/>} src={insuranceSrc}/>
                        </div>
                    </div>
                    <div className="mt-7 flex justify-between items-center">
                        <div className="text-xs font-normal text-icon">
                            Driver License Picture
                        </div>
                        <div>
                            <Avatar shape="square" size="large" icon={<UserOutlined/>} src={license}/>
                        </div>
                    </div>
                </div>}
            </DriverPage>
        </DriverAuth>
    )
}
export default Profile;