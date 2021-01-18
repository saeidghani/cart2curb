import React, {useState, useEffect} from 'react';
import {Form, Row, Col, Input, Select, Button, message} from 'antd';
import {useRouter} from "next/router";
import Link from "next/link";
import {useDispatch, useSelector} from "react-redux";

import routes from "../../../constants/routes";
import {EditOutlined} from '@ant-design/icons';

const {Item} = Form;
const {Option} = Select;

const Taxes = props => {
  const [form] = Form.useForm();
  const [parentCategories, setParentCategories] = useState([])
  const dispatch = useDispatch();
  const loading = useSelector(state => state.loading.effects.adminStore.addCategory);
  const parentLoading = useSelector(state => state.loading.effects.adminStore.getCategories);
  const token = useSelector(state => state?.adminAuth?.token);
  const categories = useSelector(state => state?.adminStore?.categories);
  const router = useRouter();
  const {categoryId, storeId, storeType} = router.query;

  useEffect(() => {
    if (storeId && categoryId) {
      const currentCategory = categories?.data?.find(c => c?._id === categoryId);
      const {name, parent, description = ''} = currentCategory || {};
      const parentCategory = categories?.data?.find(c => c?._id === parent)?._id || '';
      form.setFieldsValue({
        name,
        parent: parentCategory,
        description
      })
    }
  }, [storeId && categoryId]);

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
      title: 'taxes',
      href: routes.admin.profile.index,
      query: {tab: 'taxes'}
    },
  ];

  const submitHandler = async (values) => {

    const {name, parent, description} = values;
    const body = {
      name, parent, description
    }

    const res = await dispatch.adminStore.editCategory({storeId, categoryId, body, token});
    if (res) {
      router.push({pathname: routes.admin.stores.storeDetails, query: {storeId, storeType, tab: 'category'}})
    }
  }

  const checkValidation = (errorInfo) => {
    message.error(errorInfo?.errorFields[0]?.errors[0], 5);
  }
  return (
    <Form className="mt-4" form={form} layout={'vertical'} onFinish={submitHandler} onFinishFailed={checkValidation}>
      <Row gutter={48}>
        <Col xs={24} md={12} lg={10}>
          <Item name='service-cost' label='Service Cost'>
            <div className="flex items-center space-x-2">
              <Input placeholder='Service Cost' />
              <EditOutlined className={'text-secondarey text-xl'} />
            </div>
          </Item>
        </Col>
        <Col xs={24} md={12} lg={10}>
          <Item name='delivery-cost' label='Delivery Cost'>
            <div className="flex items-center space-x-2">
              <Input placeholder='Delivery Cost' />
              <EditOutlined className={'text-secondarey text-xl'} />
            </div>
          </Item>
        </Col>
        <Col xs={24} md={12} lg={10}>
          <Item name='servicetax' label='Service Tax'>
            <div className="flex items-center space-x-2">
              <Input placeholder='Service Tax' />
              <EditOutlined className={'text-secondarey text-xl'} />
            </div>
          </Item>
        </Col>
        <Col xs={24} md={12} lg={10}>
          <Item name='delivery-tax ' label='Delivery tax'>
            <div className="flex items-center space-x-2">
              <Input placeholder='Delivery tax ' />
              <EditOutlined className={'text-secondarey text-xl'} />
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
            <Link
              href={{pathname: routes.admin.stores.storeDetails, query: {...router.query, tab: 'category', storeId}}}>
              <Button danger className={'w-full md:w-32'}>Cancel</Button>
            </Link>
          </Item>
        </Col>
      </Row>
    </Form>
  )
}

export default Taxes;