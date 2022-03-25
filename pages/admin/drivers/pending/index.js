import React, {useState, useEffect} from 'react';
import {Card, Button} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import Link from 'next/link';

import Page from '../../../../components/Page';
import DetailItem from '../../../../components/UI/DetailItem';
import routes from '../../../../constants/routes';
import Loader from '../../../../components/UI/Loader';
import AdminAuth from '../../../../components/Admin/AdminAuth';
import Avatar from '../../../../components/UI/Avatar';
import {useRouter} from "next/router";

const PendingDrivers = props => {
    const dispatch = useDispatch();
    const loadingPendingDrivers = useSelector(state => state?.loading?.effects?.adminDelivery?.getPendingDrivers);
    const isLoggedIn = useSelector(state => state?.adminAuth?.isLoggedIn);
    const token = useSelector(state => state?.adminAuth?.token);
    const [pendingDrivers, setPendingDrivers] = useState([]);
    const [updatedDrivers, setUpdatedDrivers] = useState([]);
    const router = useRouter();

    useEffect(() => {
        if (isLoggedIn) {
            (async () => {
                const res = await dispatch?.adminUser?.getPendingDrivers();
                setPendingDrivers(res?.data?.data);
            })();
        }
        ;
    }, [isLoggedIn]);

    useEffect(() => {
        const emptyPendingDrivers = (pendingDrivers || [])?.filter(d => !updatedDrivers.includes(d?._id))?.length === 0;
        const hasUpdated = updatedDrivers?.length > 0;
        if (hasUpdated && emptyPendingDrivers) {
            router.push({pathname: routes.admin.users.index, query: {tab: 'drivers'}});
        }
    }, [pendingDrivers, updatedDrivers]);

    if (loadingPendingDrivers) return (
        <div className="flex items-center justify-center py-10">
            <Loader/>
        </div>
    );

    const breadcrumb = [
        {
            title: 'Users',
            href: routes.admin.users.index,
            query: {tab: 'drivers'}
        },
        {
            title: 'Drivers',
            href: routes.admin.users.index,
            query: {tab: 'drivers'}
        },
    ];

    const handleApprove = (driverId) => {
        const body = {isApproved: true};
        dispatch?.adminUser?.addPendingDriver({driverId, body, token});
        setUpdatedDrivers(updatedDrivers.concat(driverId));
    };

    const handleReject = (driverId) => {
        const body = {isApproved: false};
        dispatch?.adminUser?.addPendingDriver({driverId, body, token});
        setUpdatedDrivers(updatedDrivers.concat(driverId));
    };


    return (
        <AdminAuth>
            <Page title={false} headTitle={'Pending Vendors'} breadcrumb={breadcrumb}>
                {(pendingDrivers || [])?.filter(d => !updatedDrivers.includes(d?._id))?.map((driver) =>
                    <Card className="mb-4 shadow pr-10">
                        <div className="grid grid-cols-4 gap-y-4 mb-4">
                            <Avatar src={driver?.image} justImage/>
                            <DetailItem
                                labelColor='overline' title='Name'
                                value={driver?.name}
                            />
                            <DetailItem
                                labelColor='overline' title='Email'
                                value={driver?.email}
                            />
                            <DetailItem
                                labelColor='overline' title='Mobile'
                                value={driver?.phone}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 mt-8">
                            <div className="flex flex-col justify-center">
                                <div className="mb-3">Proof of Insurance</div>
                                {driver?.proofOfInsurance?.length > 0 && <img
                                    src={driver?.proofOfInsurance[0]}
                                    style={{width: 500}}
                                    alt=""
                                />}
                            </div>
                            <div className="flex flex-col justify-center">
                                <div className="mb-3">Driving Licence</div>
                                {driver?.license && <img
                                    src={driver?.license}
                                    style={{width: 500}}
                                    alt=""
                                />}
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-5">
                            <Button className="text-primary px-4" type="link"
                                    onClick={() => handleReject(driver?._id)}>Reject</Button>
                            <Link href={{pathname: routes.admin.drivers.edit(driver?._id)}}>
                                <Button
                                    className="text-primary bg-transparent border border-solid border-primary px-8">Edit</Button>
                            </Link>
                            <Button className="text-white bg-primary px-4"
                                    onClick={() => handleApprove(driver?._id)}>Approve</Button>
                        </div>
                    </Card>
                )}
            </Page>
        </AdminAuth>
    );
};

export default PendingDrivers;
