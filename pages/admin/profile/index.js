import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import {Tabs, Badge} from 'antd';
import {useRouter} from 'next/router';
import {useDispatch} from 'react-redux';

import Page from '../../../components/Page';
import AdminAuth from '../../../components/Admin/AdminAuth';
import Arrangement from '../../../components/Admin/Profile/Arrangement';
import Edit from '../../../components/Admin/Profile/Edit';
import Promo from '../../../components/Admin/Profile/Promo';
import Taxes from '../../../components/Admin/Profile/Taxes';
import Video from '../../../components/Admin/Profile/Video';
import routes from '../../../constants/routes';

const {TabPane} = Tabs;

const Profile = props => {
  const [pendingCount, setPendingCount] = useState(0);
  const dispatch = useDispatch();
  const router = useRouter();
  const {pathname} = router;
  const {tab = 'edit'} = router.query;

  const breadcrumb = [
    {
      title: 'Admin',
      href: routes.admin.stores.index
    },
    {
      title: 'Profile',
    }
  ];

  return (
    <AdminAuth>
      <Page title={false} headTitle={'Profile'} breadcrumb={breadcrumb}>
        <Tabs
          defaultActiveKey={tab}
          activeKey={tab}
          onChange={(key) => router.push({pathname, query: {tab: key}})}
        >
          <TabPane key='edit' tab='Edit'>
            <Edit />
          </TabPane>
          <TabPane key='video' tab='Video'>
            <Video />
          </TabPane>
          <TabPane key='promoCode' tab='Promo Code'>
            <Promo />
          </TabPane>
          <TabPane key='arrangement' tab='Arrangement'>
            <Arrangement />
          </TabPane>
          <TabPane key='taxes' tab='Taxes'>
            <Taxes />
          </TabPane>
        </Tabs>
      </Page>
    </AdminAuth>
  );
};

export default Profile;