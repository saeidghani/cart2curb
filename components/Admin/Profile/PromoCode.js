import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Row, Col, Input, Form, Table, Select, Button, Space, message} from 'antd';
import {
  FileSearchOutlined,
  PlusCircleOutlined,
  CheckCircleOutlined,
  StopOutlined,
  EditOutlined,
  InfoCircleOutlined, DeleteOutlined
} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import Link from "next/link";

import routes from "../../../constants/routes";
import deleteModal from "../../Modals/Delete";
import OrderDetailsModal from "../../Modals/OrderDetails";
import Loader from "../../UI/Loader";
import {getProperty} from "../../../helpers";
import {useRouter} from "next/router";
import Avatar from "../../UI/Avatar";

const {Item} = Form;
const {Option} = Select;

let isIntersecting = true;
const PromoCode = () => {
  const loader = useRef(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [deleted, setDeleted] = useState([]);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const vendorsLoading = useSelector(state => state?.loading?.effects?.adminUser?.getPromoCode);
  const vendors = useSelector(state => state?.adminUser?.vendors?.data);
  const token = useSelector(state => state?.adminAuth?.token);

  useEffect(async () => {
    if (hasMore || page === 1) {
      const formFields = form.getFieldsValue()
      let query = {
        page_number: page,
        page_size: 15,
      }
      if (formFields.search) {
        query.search = formFields.search;
      }
      try {
        const response = await dispatch.adminUser?.getPromoCode(query);
        if (response.data.length < 15) {
          setHasMore(false);
        }
      } catch (e) {
        setHasMore(false);
        message.error('An Error was occurred while fetching data')
      }
    }
    isIntersecting = true;
  }, [page, search]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1
    };

    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current)
    }

  }, [loader.current]);

  const handleObserver = (entities) => {
    const target = entities[0];
    if (target.isIntersecting && isIntersecting) {
      isIntersecting = false
      setPage((page) => page + 1)
    }
  }

  const searchHandler = (values) => {
    isIntersecting = false;
    setPage(1);
    setHasMore(true);
    setSearch(values.search);
  }

  const columns = useMemo(() => [
    {
      title: "Promo Code Name",
      dataIndex: 'name',
      key: 'name',
      render: src => <Avatar src={src} justImage/>
    },
    {
      title: "Your Offer",
      dataIndex: 'discount',
      key: 'discount',
      render: number => <span className="text-cell">{number}</span>
    },
    {
      title: "Members used",
      dataIndex: 'members',
      key: 'members',
      render: CXName => <span className="text-cell">{CXName}</span>
    },
    {
      title: "OP",
      dataIndex: 'action',
      key: 'action',
      render: (actions, {key, storeId}) => {
        return (
          <div className={'flex flex-row items-center space-x-3'}>
            <Link href={{pathname: routes.admin.vendors.edit(key), query: {storeId}}}>
              <Button
                type={'link'}
                shape={'circle'}
                icon={<EditOutlined className={'text-secondarey text-xl'}/>}
                className={'btn-icon-small'}
              />
            </Link>
            <Button
              type={'link'}
              shape={'circle'}
              icon={<DeleteOutlined className={'text-btn text-xl'}/>}
              className={'btn-icon-small'} onClick={actions.deleteHandler}
            />
          </div>
        )
      },
      width: 140,
    },
  ], []);

  const setSubstring = (str, lastIndex) => {
    return `${str.substring(0, lastIndex)} ...`;
  }

  const data = useMemo(() => {
    return vendors?.map(({vendor, store}) => ({
        key: vendor?._id,
        avatar: vendor?.image,
        name: `${vendor?.contactName}`,
        number: vendor?._id,
        email: vendor?.email || '-',
        phoneNumber: vendor?.phone || '-',
        address: vendor?.addresses?.length > 0 ?
          setSubstring(`${vendor?.addresses[0]?.addressLine1} ${vendor?.addresses[0]?.city} ${vendor?.addresses[0]?.state} ${vendor?.addresses[0]?.country} ${vendor?.addresses[0]?.postalCode}`, 20) :
          '-',
        storeId: store?._id,
        action: {
          deleteHandler: () => {
            deleteModal({
              onOk: async () => {
                const res = await dispatch?.adminStore?.deleteProduct({storeId, productId: product?._id, token});
                if (res) {
                  setDeleted(deleted?.concat(product?._id))
                }
              },
              okText: 'Ok',
              title: 'Do you want to delete this promo code?',
              content: 'Are you sure to delete this promo code? There is no going back!!',
            });
          },
        },
      })
    );
  }, [vendors, deleted]);

  return (
    <>
      <Row gutter={24} className={'flex items-center pt-6 pb-4'}>
        <Col lg={18} xs={24}>
          <Form form={form} layout={'vertical'} onFinish={searchHandler}>
            <Row gutter={24}>
              <Col lg={9} xs={24}>
                <Item name={'search'} label={'Search'}>
                  <Input placeholder={'Search'}/>
                </Item>
              </Col>
              <Col lg={6} xs={24}>
                <Item className={'pt-7'}>
                  <Button type={'primary'} size={'lg'} className={'w-32'} htmlType={'submit'}
                          loading={vendorsLoading}>Search</Button>
                </Item>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col lg={6} xs={24} className={'flex flex-row-reverse'}>
          <Link href={routes.admin.promoCode.add}>
            <Button
              type={'link'}
              icon={<PlusCircleOutlined className={'text-info mr-3'} style={{fontSize: 20}}/>}
              className={'flex items-center justify-center text-info px-0 hover:text-teal-500 text-base'}
              disabled={vendors?.length === 0}
            >
              Add New Promo Code
            </Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col xs={24}>
          <Table columns={columns} dataSource={data} scroll={{x: 1100}} pagination={false}
                 loading={vendorsLoading && vendors?.length === 0}/>
          {hasMore && (
            <div ref={loader}>

              <div className="flex w-full items-center justify-center py-6"><Loader/></div>
            </div>
          )}
        </Col>
      </Row>
    </>
  )
}

export default PromoCode;