import React, {useState, useEffect, Fragment} from 'react';
import {Card, Button} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import Link from 'next/link';
import {
  UserOutlined
} from '@ant-design/icons';

import Page from '../../../../components/Page';
import DetailItem from '../../../../components/UI/DetailItem';
import routes from '../../../../constants/routes';
import Loader from '../../../../components/UI/Loader';
import AdminAuth from '../../../../components/Admin/AdminAuth';
import Avatar from '../../../../components/UI/Avatar';

const PendingDrivers = props => {
  const dispatch = useDispatch();
  const loadingPendingDrivers = useSelector(state => state?.loading?.effects?.adminDelivery?.getPendingDrivers);
  const isLoggedIn = useSelector(state => state?.adminAuth?.isLoggedIn);
  const token = useSelector(state => state?.adminAuth?.token);
  const [pendingDrivers, setPendingDrivers] = useState([]);

  useEffect(() => {
    if (isLoggedIn) {
      (async () => {
        const res = await dispatch?.adminUser?.getPendingDrivers();
        console.log(res);
        setPendingDrivers(res?.data?.data);
      })();
    }
    ;
  }, [isLoggedIn]);

  if (loadingPendingDrivers) return (
    <div className="flex items-center justify-center py-10">
      <Loader />
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
  ]

  const handleApprove = (driverId) => {
    const body = {isApproved: true};
    dispatch?.adminUser?.addPendingDriver({driverId, body, token});
  };

  const handleReject = (driverId) => {
    const body = {isApproved: false};
    dispatch?.adminUser?.addPendingDriver({driverId, body, token});
  };


  return (
    <AdminAuth>
      <Page title={false} headTitle={'Pending Vendors'} breadcrumb={breadcrumb}>
        {(pendingDrivers || [])?.map((driver) =>
          <Card className="mb-4 shadow pr-10">
            <div className="grid grid-cols-4 gap-y-4 mb-4">
              <Avatar src={driver?.image} justImage />
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
            <div className="grid grid-cols-2 mt-8">
              <div className="flex flex-col">
                <div className="mb-3">Proof of Insurance</div>
                <img src={driver?.proofOfInsurance[0]} alt="" />
              </div>
              <div className="flex flex-col">
                <div className="">Driving Lisence</div>
                <img src={driver?.license} alt="" />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-5">
              <Button className="text-primary px-4" type="link" onClick={() => handleReject(driver?._id)}>Reject</Button>
              <Link href={{pathname: routes.admin.drivers.edit(driver?._id)}}>
                <Button
                className="text-primary bg-transparent border border-solid border-primary px-8">Edit</Button>
              </Link>
              <Button className="text-white bg-primary px-4" onClick={() => handleApprove(driver?._id)}>Approve</Button>
            </div>
          </Card>
        )}
      </Page>
    </AdminAuth>
  );
};

export default PendingDrivers;
