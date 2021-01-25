import React, {useState, useEffect, Fragment} from 'react';
import {Card, Button} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import Link from 'next/link';

import Page from '../../../../components/Page';
import DetailItem from '../../../../components/UI/DetailItem';
import routes from '../../../../constants/routes';
import Loader from '../../../../components/UI/Loader';
import AdminAuth from '../../../../components/Admin/AdminAuth';
import Avatar from '../../../../components/UI/Avatar';

const PendingDrivers = props => {
    const dispatch = useDispatch();
    const pendingVendors = useSelector(state => state?.adminUser?.pendingVendors?.data);
    const loadingPendingDrivers = useSelector(state => state?.loading?.effects?.adminDelivery?.getPendingDrivers);
    const isLoggedIn = useSelector(state => state?.adminAuth?.isLoggedIn);
    const token = useSelector(state => state?.adminAuth?.token);
    const [updatedVendors, setUpdatedVendors] = useState([]);

    useEffect(() => {
        if (isLoggedIn) {
            dispatch?.adminUser?.getPendingVendors();
        }
        ;
    }, [isLoggedIn]);

    if (loadingPendingDrivers) return (
        <div className="flex items-center justify-center py-10">
            <Loader/>
        </div>
    );

    const breadcrumb = [
        {
            title: 'Users',
            href: routes.admin.users.index,
            query: {tab: 'vendors'}
        },
        {
            title: 'Vendors',
            href: routes.admin.users.index,
            query: {tab: 'vendors'}
        },
        {
            title: 'Pending Vendors'
        }
    ];

    const handleApprove = async (vendorId) => {
        const body = {isApproved: true};
        try {
            await dispatch?.adminUser?.addPendingVendor({vendorId, body, token});
            setUpdatedVendors(updatedVendors.concat(vendorId));
        } catch (err) {
        }
    };

    const handleReject = async (vendorId) => {
        const body = {isApproved: false};
        try {
            await dispatch?.adminUser?.addPendingVendor({vendorId, body, token});
            setUpdatedVendors(updatedVendors.concat(vendorId));
        } catch (err) {}
    };


    return (
        <AdminAuth>
            <Page title={false} headTitle={'Pending Vendors'} breadcrumb={breadcrumb}>
                {(pendingVendors || [])?.filter(v => !updatedVendors.includes(v.vendor?._id))?.map(({store, vendor}) =>
                    <Card className="mb-4 shadow pr-10">
                        <div className="grid grid-cols-4 gap-y-4 mb-4">
                            <Avatar src={vendor?.image} justImage/>
                            <DetailItem
                                labelColor='overline' title='Main Contact Name'
                                value={vendor?.contactName}
                            />
                            <DetailItem
                                labelColor='overline' title='Mobile'
                                value={vendor?.phone}
                            />
                            <DetailItem
                                labelColor='overline' title='Email'
                                value={vendor?.email}
                            />
                            <DetailItem
                                labelColor='overline' title='Comppany Name'
                                value={store?.name}
                            />
                            <DetailItem
                                labelColor='overline' title='Store Opening Hour'
                                value={moment(store?.openingHour).format('hh:mm A')}
                            />
                            <DetailItem
                                labelColor='overline' title='Store Closing Hour'
                                value={moment(store?.closingHour).format('hh:mm A')}
                            />
                            <DetailItem
                                labelColor='overline' title='Gathering Method'
                                value={store?.needDriversToGather ? 'By Card2Curb' : ''}
                            />
                        </div>
                        <DetailItem
                            labelColor='overline' title='Description'
                            value={store?.description}
                        />
                        <div className="flex justify-end space-x-3 mt-5">
                            <Button className="text-primary px-4" type="link"
                                    onClick={() => handleReject(vendor._id)}>Reject</Button>
                            <Link
                                href={{pathname: routes.admin.vendors.edit(vendor._id), query: {storeId: store?._id}}}
                            >
                                <Button
                                    className="text-primary bg-transparent border border-solid border-primary px-8"
                                >
                                    Edit
                                </Button>
                            </Link>
                            <Button
                                className="text-white bg-primary px-4"
                                onClick={() => handleApprove(vendor._id)}
                            >
                                Approve
                            </Button>
                        </div>
                    </Card>
                )}
            </Page>
        </AdminAuth>
    );
};

export default PendingDrivers;
