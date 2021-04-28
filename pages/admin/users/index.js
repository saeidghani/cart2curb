import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import {Tabs, Badge} from 'antd';
import {useRouter} from 'next/router';

import Page from '../../../components/Page';
import Customers from '../../../components/Admin/Users/Customers';
import Vendors from '../../../components/Admin/Users/Vendors';
import Drivers from '../../../components/Admin/Users/Drivers';
import AdminAuth from '../../../components/Admin/AdminAuth';
import {useDispatch} from 'react-redux';
import routes from '../../../constants/routes';

const {TabPane} = Tabs;

const Users = props => {
  const [pendingCount, setPendingCount] = useState(0);
  const dispatch = useDispatch();
  const router = useRouter();
  const {pathname} = router;
  const {tab} = router.query;

  useEffect(() => {
    (async () => {
      if (tab === 'drivers') {
        const res = await dispatch?.adminUser?.getPendingDriversCount();
        setPendingCount(res?.data?.pending);
      } else if (tab === 'vendors') {
        const res = await dispatch?.adminUser?.getPendingVendorsCount();
        setPendingCount(res?.data?.pending);
      }
    })();
  }, [tab]);

  const ExtraContent = (
    <Link href={tab === 'drivers' ? routes.admin.drivers.pending : routes.admin.vendors.pending.index}>
      <div className="flex space-x-2 cursor-pointer">
        <span className="text-red-500">{`Pending ${tab === 'drivers' ? 'Drivers' : 'Vendors'} Requests`}</span>
        <Badge count={pendingCount}></Badge>
      </div>
    </Link>
  );

  const capitalize = (string) => {
    return string?.charAt(0)?.toUpperCase() + string?.slice(1);
  };

  const breadcrumb = [
    {
      title: 'Users',
    },
    {
      title: `${capitalize(tab || 'customers')}`,
    }
  ];

  return (
    <AdminAuth>
      <Page title={false} headTitle={'Users'} breadcrumb={breadcrumb}>
        <Tabs
          defaultActiveKey={tab || 'customers'}
          activeKey={tab || 'customers'}
          onChange={(key) => router.push({pathname, query: {tab: key}})}
          tabBarExtraContent={(['drivers', 'vendors'].includes(tab) && pendingCount !== 0) ? ExtraContent : null}
        >
          <TabPane key='customers' tab='Customers'>
            <Customers />
          </TabPane>
          <TabPane key='vendors' tab='Vendors'>
            <Vendors />
          </TabPane>
          <TabPane key='drivers' tab='Drivers'>
            <Drivers />
          </TabPane>
        </Tabs>
      </Page>
    </AdminAuth>
  );
};

export default Users;