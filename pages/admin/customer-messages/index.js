import React, {useState, useEffect} from 'react';
import {Card} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import {
  UserOutlined,
} from '@ant-design/icons';

import Page from "../../../components/Page";
import DetailItem from "../../../components/UI/DetailItem";
import routes from "../../../constants/routes";
import Loader from "../../../components/UI/Loader";
import AdminAuth from "../../../components/Admin/AdminAuth";

const CustomerMessages = props => {
  const dispatch = useDispatch();
  const deliveries = useSelector(state => state?.adminDelivery?.deliveries);
  const loadingDelivery = useSelector(state => state?.loading?.effects?.adminDelivery?.getDeliveries);
  const isLoggedIn = useSelector(state => state?.adminAuth?.isLoggedIn);
  const token = useSelector(state => state?.adminAuth?.token);

  useEffect(() => {
    if (isLoggedIn) {
    };
  }, [isLoggedIn]);

  if (loadingDelivery) return (
    <div className="flex items-center justify-center py-10">
      <Loader/>
    </div>
  );

  const breadcrumb = [
    {
      title: 'Vendors',
      href: routes.admin.deliveries.index,
    }
  ];


  return (
    <AdminAuth>
      <Page title={false} headTitle={'Pending Vendors'} breadcrumb={breadcrumb}>
        <Card className="mb-4 shadow pr-10">
          <DetailItem
            labelColor='overline' title='Copmpany Name'
            value={'Barry'}
          />
        </Card>
      </Page>
    </AdminAuth>
  )
}

export default CustomerMessages;
