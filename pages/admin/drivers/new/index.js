import React, {useState} from 'react';
import {Form, Row, Col, Input, Upload, Button, message} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import Link from 'next/link';
import ImgCrop from 'antd-img-crop';
import {CloudUploadOutlined, UserOutlined} from '@ant-design/icons';

import Page from '../../../../components/Page';
import routes from '../../../../constants/routes';
import {useRouter} from 'next/router';
import api from "../../../../http/Api";

const {Item} = Form;

const NewDriver = props => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const loading = useSelector(state => state.loading.effects.adminUser.addDriver);
    const token = useSelector(state => state?.adminAuth?.token);
    const router = useRouter();
    const [imageUrl, setImageUrl] = useState('');

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    function beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    }

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
        {
            title: `Add`
        }
    ];

    const uploadProps = {
        action: '/v1/files/photos/',
        headers: {
            Authorization: `Bearer ${token}`
        },

        progress: {
            strokeColor: {
                '0%': '#ff4b45',
                '100%': '#87d068',
            },
            strokeWidth: 2,
            format: percent => `${parseFloat(percent.toFixed(2))}%`,
        },
    };

    const handleUpload = info => {
        console.log(info);
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            setImageUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/files/photos${info?.file?.response?.data?.path || ''}`);
        }
    };

    const setOptions = token => ({
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const submitHandler = async (values) => {
        const {name, email, phone} = values;
        const body = {name, email, phone};
        if (imageUrl) {
            body.image = imageUrl;
        }
        const res = await api?.admin?.user?.addDriver(body, setOptions(token));
        //const res = await dispatch.adminUser.addDriver({body, token});
        if (res) {
            router.push({pathname: routes.admin.users.index});
        }
    };

    const checkValidation = (errorInfo) => {
        message.error(errorInfo?.errorFields[0]?.errors[0], 5);
    };
    return (
      <Page title={false} headTitle={'Edit Driver'} breadcrumb={breadcrumb}>
          <Form form={form} layout={'vertical'} onFinish={submitHandler} onFinishFailed={checkValidation}>
              <Row gutter={24}>
                  <Col xs={24}>
                      <h1 style={{
                          fontSize: 27,
                          fontWeight: 'medium',
                          marginTop: 0,
                          marginBottom: 25,
                          color: '#020911'
                      }}>Edit Driver</h1>
                  </Col>
                  <Col xs={24} md={12} lg={8}>
                      <Item name={'name'} label={'Name'}>
                          <Input placeholder={'Name'} />
                      </Item>
                  </Col>
                  <Col xs={24} md={12} lg={8}>
                      <Item name={'email'} label={'Email'}>
                          <Input placeholder={'Email'} />
                      </Item>
                  </Col>
                  <Col xs={24} md={12} lg={8}>
                      <Item name={'phone'} label={'Phone Number'}>
                          <Input placeholder={'Phone Number'} />
                      </Item>
                  </Col>
                  <Col xs={24}>
                      <Item name={'image'} className="">
                          <div className="flex items-center space-x-4">
                              <div className="">Upload Image</div>
                              <ImgCrop>
                                  <Upload
                                    name={'image'}
                                    listType="picture"
                                    className={'upload-list-inline'}
                                    showUploadList={false}
                                    beforeUpload={beforeUpload}
                                    onChange={handleUpload}
                                    {...uploadProps}
                                  >
                                      <div className="flex space-x-3">
                                          {imageUrl ? <img src={imageUrl} alt="avatar" style={{width: 70, height: 70}} /> : (
                                            (
                                              <>
                                                  <div
                                                    className={'full-rounded text-overline bg-card flex items-center justify-center'}
                                                    style={{width: 50, height: 50, borderRadius: 50}}>
                                                      <UserOutlined className={'text-lg'}/>
                                                  </div>
                                              </>
                                            )
                                          )}
                                          <div className="pt-2 h-full" style={{float: 'left'}}>
                                              <div
                                                className={'flex items-center justify-center border border-solid border-input px-4 py-2'}
                                              >
                                                  <CloudUploadOutlined className={'text-2xl text-icon'} />
                                                  <div className={'pl-3 text-cell'}>Upload</div>
                                              </div>
                                          </div>
                                      </div>
                                  </Upload>
                              </ImgCrop>
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
                          <Link
                            href={{pathname: routes.admin.stores.storeDetails, query: {...router.query, tab: 'drivers'}}}>
                              <Button danger className={'w-full md:w-32'}>Cancel</Button>
                          </Link>
                      </Item>
                  </Col>
              </Row>
          </Form>
      </Page>
    );
};

export default NewDriver;