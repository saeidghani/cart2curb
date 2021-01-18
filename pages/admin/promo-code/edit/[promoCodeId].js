import React, {useEffect, useState} from 'react';
import {Form, Row, Col, Input, Button, message, Progress} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {MinusCircleFilled, PlusCircleFilled} from '@ant-design/icons';

import Page from '../../../../components/Page';
import routes from '../../../../constants/routes';
import store from '../../../../states';

const {Item} = Form;

const New = props => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const loading = useSelector(state => state.loading.effects.adminStore.addCategory);
  const parentLoading = useSelector(state => state.loading.effects.adminStore.getCategories);
  const categories = useSelector(state => state?.adminStore?.categories);
  const token = store?.getState()?.adminAuth?.token;
  const router = useRouter();
  const [offer, setOffer] = useState(1);
  //const { }          = router.query;

  const breadcrumb = [
    {
      title: 'Admin',
      href: routes.admin.deliveries.index
    },
    {
      title: 'Profile',
      href: routes.admin.profile.index,
      query: {tab: 'promoCode'}
    },
    {
      title: 'Promo Code',
      href: routes.admin.profile.index,
      query: {tab: 'promoCode'}
    },
    {
      title: `Edit`
    }
  ];

  const handleIncrement = () => {
    if (offer < 100) setOffer(prevState => prevState + 1);

  };

  const handleDecrement = () => {
    if (offer > 0) setOffer(prevState => prevState - 1);
  };

  const submitHandler = async (values) => {
    const {name, offer} = values;
    const body = {
      name, offer
    };

    const res = await dispatch.adminStore.addCategory({body, token});
    if (res) {
      router.push({pathname: routes.admin.profile.index, query: {tab: 'promoCode'}});
    }
  };

  const checkValidation = (errorInfo) => {
    message.error(errorInfo.errorFields[0].errors[0], 5);
  };
  return (
    <Page title={false} headTitle={'Add Category'} breadcrumb={breadcrumb}>
      <Form form={form} layout={'vertical'} onFinish={submitHandler} onFinishFailed={checkValidation}>
        <Row gutter={24}>
          <Col xs={24} md={12} lg={8}>
            <Item name='name' label='Promo Code Name' rules={[
              {
                required: true,
                message: 'Promo Code Name field is required'
              }
            ]}>
              <Input placeholder='Promo Code Name' />
            </Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Item
              name='offer'
              label='Your Offer'
            >
              <div className="flex items-center space-x-2 w-32">
                <MinusCircleFilled
                  style={{color: '#1890FF', fontSize: 20}}
                  onClick={handleDecrement}
                />
                <Input
                  name="offer"
                  value={offer}
                  onChange={e => setOffer(e.target.value * 1)}
                  suffix='%'
                />
                <PlusCircleFilled
                  style={{color: '#1890FF', fontSize: 20}}
                  onClick={handleIncrement}
                />
              </div>
            </Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Item name='usage'>
              <div className="flex items-center space-x-3">
                <Progress type="circle" width={82} />
                <span className="">Members used from your Promo Code</span>
              </div>
            </Item>
          </Col>
          <Col xs={24} className={'flex flex-col md:flex-row-reverse md:mt-10 mt-6'}>
            <Item>
              <Button type="primary" block className={'w-full md:w-32 ml-0 md:ml-5'} htmlType={'submit'}
                      loading={loading || parentLoading}>
                Save
              </Button>
            </Item>
            <Item>
              <Link href={{pathname: routes.admin.profile.index, query: {tab: 'promoCode'}}}>
                <Button danger className={'w-full md:w-32'}>Cancel</Button>
              </Link>
            </Item>
          </Col>
        </Row>
      </Form>
    </Page>
  );
};

export default New;