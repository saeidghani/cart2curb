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
  const loading = useSelector(state => state.loading.effects.adminProfile?.getPromo);
  const token = useSelector(state => state?.adminAuth?.token);
  const promo = useSelector(state => state?.adminProfile?.promo);
  const router = useRouter();
  const [off, setOff] = useState(0);
  const [usageRate, setUsageRate] = useState(1);
  const { promoId } = router.query;

  useEffect(() => {
    if (token) {
      dispatch?.adminProfile?.getPromo({promoId, token});
    }
  }, [token, promoId]);

  useEffect(() => {
    const {code, off, cartsCount, canUseCustomers} = promo || {};
    form.setFieldsValue({
      code,
    });
    setOff(off || 1);
    const usageRate = parseInt((cartsCount / canUseCustomers?.length) * 100, 10) || 0;
    setUsageRate(usageRate);
  }, [promo]);

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
    if (off < 100) setOff(prevState => prevState + 1);
  };

  const handleDecrement = () => {
    if (off > 0) setOff(prevState => prevState - 1);
  };

  const submitHandler = async (values) => {
    const {code} = values;
    const body = {
      code, off
    };

    const res = await dispatch.adminProfile?.editPromo({promoId, body, token});
    if (res) {
      router.push({pathname: routes.admin.profile.index, query: {tab: 'promoCode'}});
    }
  };

  const checkValidation = (errorInfo) => {
    message.error(errorInfo.errorFields[0].errors[0], 5);
  };

  const handleOff = e => {
    if (!e.target.value) setOff(0);
    if (e.target.value * 1 > 0 && e.target.value * 1 < 100) {
      setOff(e.target.value * 1);
    }
  };

  return (
    <Page title={false} headTitle={'Edit Promo'} breadcrumb={breadcrumb}>
      <Form form={form} layout={'vertical'} onFinish={submitHandler} onFinishFailed={checkValidation}>
        <Row gutter={24}>
          <Col xs={24} md={12} lg={8}>
            <Item name='code' label='Promo Code Name' rules={[
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
              name='off'
              label='Your Offer'
            >
              <div className="flex items-center space-x-2 w-32">
                <MinusCircleFilled
                  style={{color: '#1890FF', fontSize: 20}}
                  onClick={handleDecrement}
                />
                <Input
                  name="off"
                  value={off}
                  onChange={handleOff}
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
            <Item name='usageRate'>
              <div className="flex items-center space-x-3">
                <Progress type="circle" width={82} percent={usageRate} />
                <span className="">Members used from your Promo Code</span>
              </div>
            </Item>
          </Col>
          <Col xs={24} className={'flex flex-col md:flex-row-reverse md:mt-10 mt-6'}>
            <Item>
              <Button type="primary" block className={'w-full md:w-32 ml-0 md:ml-5'} htmlType={'submit'}
                      loading={loading}>
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