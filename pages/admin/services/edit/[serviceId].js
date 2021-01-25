import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import Link from "next/link";
import ImgCrop from "antd-img-crop";
import {Form, Row, Col, Input, Select, Upload, Radio, Button, message} from 'antd';
import {PlusOutlined} from '@ant-design/icons';

import Page from "../../../../components/Page";
import routes from "../../../../constants/routes";

const {Item} = Form;
const {Option} = Select;

const EditService = props => {
    const router = useRouter();
    const [form] = Form.useForm();
    const token = useSelector(state => state?.adminAuth?.token);
    const dispatch = useDispatch();
    const loading = useSelector(state => state.loading?.effects?.adminStore?.addService);
    const service = useSelector(state => state?.adminStore?.service);
    const [imagesList, setImagesList] = useState([]);
    const [categories, setCategories] = useState([]);
    const {serviceId, storeId, storeType} = router.query;

    useEffect(() => {
        if (storeId && serviceId && token) {
            dispatch?.adminStore?.getService({storeId, serviceId, token});
        }
    }, [storeId, serviceId, token]);

    const breadcrumb = [
        {
            title: 'Store',
            href: routes.admin.stores.storeDetails,
            query: {tab: 'service', storeId, serviceId, storeType}
        },
        {
            title: 'Services',
            href: routes.admin.stores.storeDetails,
            query: {tab: 'service', storeId, storeType}
        },
        {
            title: 'Edit',
        }
    ]

    useEffect(() => {
        if (storeId && token) {
            dispatch.adminStore.getCategories({
                storeId,
                token,
                query: {
                    page_size: 200,
                    page_number: 1
                }
            }).then(response => {
                setCategories(response?.data);
            })
        }
    }, []);

    useEffect(() => {
        const {
            name,
            priceList,
            images,
            category,
            tax,
            description
        } = service || {};
        const transformedImageList = images?.map((image, index) => {
            const name = image?.split('/').slice(-1);
            return {
                url: image,
                name,
                status: 'done',
                uid: service?._id + '-' + index
            }
        })
        form.setFieldsValue({
            name: name || '',
            category: category?._id || '',
            tax: tax || '',
            description: description || '',
            costPrice: priceList?.cost || '',
            price: priceList?.price || '',
            photo: transformedImageList,
        });
        setImagesList(transformedImageList);
    }, []);

    const handleChange = ({fileList}) => setImagesList(fileList);

    const submitHandler = async (values) => {
        if (imagesList.length === 0) {
            message.warning('Please Upload some images form your service');
            return false;
        }
        const images = imagesList.map(image => service.images.includes(image.url) ? image.url : `${process.env.NEXT_PUBLIC_API_BASE_URL}v1/files/photos${image?.response?.data?.path}`);
        const {name, category, tax, costPrice, price, description} = values;
        const body = {
            name,
            category,
            tax: Number(tax),
            images,
            priceList: {
                cost: Number(costPrice),
                price: Number(price),
            },
            description,
        }

        if (storeId && serviceId && body && token) {
            const res = await dispatch.adminStore.editService({
                storeId, serviceId, body, token
            });
            if (res) {
                router.push({pathname: routes.admin.stores.storeDetails, query: {storeId, storeType, tab: 'service'}})
            }
        }
    }

    const checkValidation = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    }

    return (
        <Page title={false} headTitle={'Edit Service'} breadcrumb={breadcrumb}>
            <Form form={form} layout={'vertical'}
                  initialValues={{
                      unitType: 'quantity',
                  }}
                  onFinish={submitHandler} onFinishFailed={checkValidation}
            >
                <Row gutter={24}>
                    <Col xs={24}>
                        <h1 style={{
                            fontSize: 27,
                            fontWeight: 'medium',
                            marginTop: 0,
                            marginBottom: 25,
                            color: '#020911',
                        }}>Edit Service</h1>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Item name={'category'} label={'Category'} rules={[
                            {
                                required: true,
                                message: 'This Field is required'
                            }
                        ]}>
                            <Select placeholder={'Category'}>
                                {categories && categories.map((item, index) => {
                                    return (
                                        <Option value={item._id} key={item._id}>{item.name}</Option>
                                    )
                                })}
                            </Select>
                        </Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Item name={'tax'} label={'Tax'} rules={[
                            {
                                required: true,
                                message: 'This Field is required'
                            },
                            {
                                pattern: /^[0-9.]+$/,
                                message: 'This Field should be number'
                            },
                            ({getFieldValue}) => ({
                                validator(rule, value) {
                                    if (!value || (Number(value) <= 100 && Number(value) >= 0)) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('Tax rate must be greater than 0 and less than 100');
                                },
                            }),
                        ]}>
                            <Input placeholder={'Tax'}/>
                        </Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Item name={'costPrice'} label={'Cost Price'} rules={[
                            {
                                required: true,
                                message: 'This Field is required'
                            },
                            {
                                pattern: /^[0-9.]+$/,
                                message: 'This Field should be number'
                            }
                        ]}>
                            <Input placeholder={'Cost Price'}/>
                        </Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Item name={'price'} label={'price'} rules={[
                            {
                                required: true,
                                message: 'This Field is required'
                            },
                            {
                                pattern: /^[0-9.]+$/,
                                message: 'This Field should be number'
                            }
                        ]}>
                            <Input placeholder={'price'}/>
                        </Item>
                    </Col>
                    <Col xs={24}>
                        <Item name={'photo'}>
                            <ImgCrop>
                                <Upload
                                    name={'photo'}
                                    action={'/v1/files/photos/'}
                                    headers={{
                                        Authorization: `Bearer ${token}`
                                    }}
                                    listType="picture"
                                    className={'flex upload-list-inline flex-row-reverse justify-end items-stretch flex-wrap-reverse'}
                                    onChange={handleChange}
                                    fileList={imagesList}
                                >
                                    <div className="pt-2 h-full" style={{float: 'left'}}>
                                        <div
                                            className={'flex items-center flex-row justify-center border border-dashed border-input px-12 bg-card h-full'}
                                            style={{height: 66}}>
                                            <PlusOutlined className={'text-2xl text-icon'}/>
                                            <div className={'pl-3 text-cell'}>Upload</div>
                                        </div>
                                    </div>
                                </Upload>

                            </ImgCrop>
                        </Item>
                    </Col>
                    <Col xs={24}>
                        <Item name={'description'} label={'Description'} rules={[
                            {
                                required: true,
                                message: 'This Field is required'
                            }
                        ]}>
                            <Input.TextArea placeholder={'Description'} autoSize={{minRows: 4, maxRows: 9}}
                                            style={{resize: 'none'}}/>
                        </Item>
                    </Col>
                    <Col xs={24} className={'flex flex-col md:flex-row-reverse md:mt-6 mt-6'}>
                        <Item>
                            <Button type="primary" block className={'w-full md:w-32 ml-0 md:ml-5'} htmlType={'submit'}
                                    loading={loading}>
                                Save
                            </Button>
                        </Item>
                        <Item>
                            <Link href={{pathname: routes.admin.stores.storeDetails, query: {tab: 'service', storeId, storeType}}}>
                                <Button danger className={'w-full md:w-32'}>Cancel</Button>
                            </Link>
                        </Item>
                    </Col>
                </Row>
            </Form>
        </Page>
    )
}

export default EditService;