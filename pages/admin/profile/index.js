import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import {Tabs, Button, Modal} from 'antd';
import {useRouter} from 'next/router';
import {useDispatch} from 'react-redux';

import Page from '../../../components/Page';
import AdminAuth from '../../../components/Admin/AdminAuth';
import Arrangement from '../../../components/Admin/Profile/Arrangement/index';
import Edit from '../../../components/Admin/Profile/Edit';
import Promo from '../../../components/Admin/Profile/Promo';
import Taxes from '../../../components/Admin/Profile/Taxes';
import Video from '../../../components/Admin/Profile/Video';
import routes from '../../../constants/routes';
import {QuestionCircleOutlined} from "@ant-design/icons";

const {TabPane} = Tabs;

const Profile = props => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {pathname} = router;
  const {tab = 'edit'} = router.query;
  const [logOutModalVisible, setLogOutModalVisible] = useState(false);

  const breadcrumb = [
    {
      title: 'Admin',
      href: routes.admin.stores.index
    },
    {
      title: 'Profile',
    }
  ];

  const handleLogOut = () => {
    dispatch?.adminAuth?.logout();
    router.push(routes.admin.auth.login);
  };

  const ExtraContent = (
      <div className="flex items-center space-x-4">
        <Button
            danger
            type="link"
            className="px-3"
            onClick={() => setLogOutModalVisible(true)}>
          Log Out
        </Button>
        <Link href={{pathname: routes.admin.profile.changePassword}}>
          <span className="cursor-pointer">Change Password</span>
        </Link>
      </div>
  );

  return (
      <AdminAuth>
        <Page title={false} headTitle={'Profile'} breadcrumb={breadcrumb}>
          <Modal
              visible={logOutModalVisible}
              okText="Yes, Log Out"
              cancelText="Cancel"
              onOk={handleLogOut}
              onCancel={() => setLogOutModalVisible(false)}
          >
            <div className="flex space-x-3">
              <QuestionCircleOutlined style={{color: "#FAAD14", fontSize: 18, marginTop: 2}}/>
              <div>
                <div className="font-bold">Log Out</div>
                <div className="mt-2">Are you sure to log out from your account?</div>
              </div>
            </div>
          </Modal>
          <Tabs
              defaultActiveKey={tab}
              activeKey={tab}
              onChange={(key) => router.push({pathname, query: {tab: key}})}
              tabBarExtraContent={ExtraContent}
          >
            <TabPane key='edit' tab='Edit'>
              <Edit/>
            </TabPane>
            <TabPane key='video' tab='Video'>
              <Video/>
            </TabPane>
            <TabPane key='promoCode' tab='Promo Code'>
              <Promo/>
            </TabPane>
            <TabPane key='arrangement' tab='Arrangement'>
              <Arrangement/>
            </TabPane>
            <TabPane key='taxes' tab='Taxes'>
              <Taxes/>
            </TabPane>
          </Tabs>
        </Page>
      </AdminAuth>
  );
};

export default Profile;