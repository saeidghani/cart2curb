import React, {useEffect, useState} from 'react';
import {Form, Row, Col, Input, Select, Upload, Radio, Button, message} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import Link from "next/link";
import ImgCrop from "antd-img-crop";

import Page from "../../../../components/Page";
import routes from "../../../../constants/routes";

const {Item} = Form;
const {Option} = Select;

const NewProduct = props => {
    const [unitType, setUnitType] = useState('quantity');
    const [form] = Form.useForm();
    const [imagesList, setImagesList] = useState([]);
    const token = useSelector(state => state.adminAuth.token);
    const [categories, setCategories] = useState([])
    const dispatch = useDispatch();
    const loading = useSelector(state => state.loading.effects.adminStore.addProduct);
    const router = useRouter()
    const {storeId, storeType} = router.query;

    const onChangeUnitType = (e) => {
        setUnitType(e.target.value);
    }

    const breadcrumb = [
        {
            title: 'Store',
            href: routes.admin.index
        },
        {
            title: 'Add Product',
        }
    ]

        useEffect(() => {
            dispatch.adminStore.getCategories({storeId, token})
                .then(response => {
                    setCategories(response.data);
                })
        }, [])

    const handleChange = ({fileList}) => setImagesList(fileList);

    const submitHandler = async (values) => {
        if (imagesList.length === 0) {
            message.warning('Please Upload some images form your product');
            return false;
        }
        const images = imagesList.map(image => `${process.env.NEXT_PUBLIC_API_BASE_URL}v1/files/photos${image.response.data.path}`);
        const {name, unitType, category, tax, costPrice, stock, description, unitPrice} = values;
        const body = {
            name,
            unitType,
            category,
            stock,
            tax: Number(tax),
            images,
            priceList: {
                price: Number(unitPrice),
                cost: Number(costPrice),
                stock: Number(stock)
            },
            description,
        }

        if (unitType === 'weight') {
            body.weightUnit = values.weightUnit;
            body.weight = Number(values.weight);
        } else {
            body.weight = 0;
            body.weightUnit = 'kg'
        }
        if (storeId && body && token) {
            const res = await dispatch.adminStore.addProduct({storeId, body, token});
            if (res) {
                router.push({pathname: routes.admin.stores.storeDetails, query: {storeId, storeType, tab: 'product'}});
            }
        }
    }

    const checkValidation = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    }

    return (
        <Page title={false} headTitle={'Add Product'} breadcrumb={breadcrumb}>
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
                        }}>Add Product</h1>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Item name={'name'} label={'Name'} rules={[
                            {
                                required: true,
                                message: 'This Field is required'
                            }
                        ]}>
                            <Input placeholder={'Name'}/>
                        </Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Item name={'unitType'} label={'Unit Type'} rules={[
                            {
                                required: true,
                                message: 'This Field is required'
                            }
                        ]}>
                            <Radio.Group onChange={onChangeUnitType} className={'flex flex-row items-center'}>
                                <Radio value={'quantity'} className={'flex-grow radio-info'}>Quantity</Radio>
                                <Radio value={'weight'} className={'flex-grow radio-info'}>Weight</Radio>
                            </Radio.Group>
                        </Item>
                    </Col>
                    {unitType === 'quantity' ? (
                        <Col xs={24} md={12} lg={8}>
                            <Item name={'unitPrice'} label={'Price per Unit'} rules={[
                                {
                                    required: true,
                                    message: 'This Field is required'
                                },
                                {
                                    pattern: /^[0-9.]+$/,
                                    message: 'This Field should be number'
                                }
                            ]}>
                                <Input placeholder={'Price per Unit'}/>
                            </Item>
                        </Col>
                    ) : (
                        <>
                            <Col xs={24} md={12} lg={8}>
                                <Item name={'weightUnit'} label={'Weight Unit'} rules={[
                                    {
                                        required: true,
                                        message: 'This Field is required'
                                    }
                                ]}>
                                    <Select placeholder={'Select Weight Unit'}>
                                        <Option value={'g'}>g</Option>
                                        <Option value={'kg'}>kg</Option>
                                    </Select>
                                </Item>
                            </Col>
                            <Col xs={24} md={12} lg={8}>
                                <Row gutter={24}>
                                    <Col xs={12}>
                                        <Item name={'weight'} label={'Weight'} rules={[
                                            {
                                                required: true,
                                                message: 'This Field is required'
                                            },
                                            {
                                                pattern: /^[0-9.]+$/,
                                                message: 'This Field should be number'
                                            }
                                        ]}>
                                            <Input placeholder={'Weight'}/>
                                        </Item>
                                    </Col>
                                    <Col xs={12}>
                                        <Item name={'unitPrice'} label={'Price per Weight'} rules={[
                                            {
                                                required: true,
                                                message: 'This Field is required'
                                            },
                                            {
                                                pattern: /^[0-9.]+$/,
                                                message: 'This Field should be number'
                                            }
                                        ]}>
                                            <Input placeholder={'Price per Weight'}/>
                                        </Item>
                                    </Col>
                                </Row>
                            </Col>
                        </>
                    )}

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
                        <Item name={'stock'} label={'Stock'} rules={[
                            {
                                required: true,
                                message: 'This Field is required'
                            },
                            {
                                pattern: /^[0-9.]+$/,
                                message: 'This Field should be number'
                            }
                        ]}>
                            <Input placeholder={'Stock'}/>
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
                            <Link href={{
                                pathname: routes.admin.stores.storeDetails,
                                query: {tab: 'product', storeId, storeType}
                            }}>
                                <Button danger className={'w-full md:w-32'}>Cancel</Button>
                            </Link>
                        </Item>
                    </Col>
                </Row>
            </Form>
        </Page>
    )
}

export default NewProduct;