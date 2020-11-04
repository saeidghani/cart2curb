import React, {useEffect, useState} from 'react';
import {Form, Row, Col, Input, Select, Upload, Radio, Button, message} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import Page from "../../../../components/Page";
import routes from "../../../../constants/routes";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import withAuth from "../../../../components/hoc/withAuth";
import cookie from "cookie";
import {getStore} from "../../../../states";
import userTypes from "../../../../constants/userTypes";
import Link from "next/link";

const { Item } = Form;
const { Option } = Select;

const EditProduct = props => {
    const [unitType, setUnitType] = useState('quantity');
    const [form] = Form.useForm();
    const [imagesList, setImagesList] = useState([]);
    const token = useSelector(state => state.vendorAuth.token);
    const [categories, setCategories] = useState([])
    const dispatch = useDispatch();
    const loading = useSelector(state => state.loading.effects.vendorStore.addProduct);
    const router = useRouter()

    const { product } = props;

    const onChangeUnitType = (e) => {
        setUnitType(e.target.value);
    }

    const breadcrumb = [
        {
            title: 'Store',
            href: routes.vendors.index
        },
        {
            title: 'Edit Product',
        }
    ]

    useEffect(() => {
        dispatch.vendorStore.getCategories({
            page_size: 200,
            page_number: 1
        })
            .then(response => {
                setCategories(response.data);
            })
    }, [])

    useEffect(() => {
        const {
            name,
            unitType,
            weight,
            weightUnit,
            priceList,
            images,
            category,
            tax,
            description
        } = product;
        const transformedImageList = images.map((image, index) => {
            const name = image.split('/').slice(-1);
            return {
                url: image,
                name,
                status: 'done',
                uid: product._id + '-' + index
            }
        })
        form.setFieldsValue({
            name: name || '',
            unitType: unitType || '',
            weight: weight || '',
            weightUnit: weightUnit || '',
            unitPrice: priceList.price || '',
            category: category?.name || '',
            tax: tax || '',
            description: description || '',
            costPrice: priceList.cost || '',
            stock: priceList.stock || '',
            photo: transformedImageList,
        })
        setImagesList(transformedImageList);
        setUnitType(unitType || 'quantity');
    }, [])

    const handleChange = ({ fileList }) => setImagesList(fileList);

    const submitHandler = async (values) => {
        if(imagesList.length === 0) {
            message.warning('Please Upload some images form your product');
            return false;
        }
        const images = imagesList.map(image => product.images.includes(image.url) ? image.url : `http://165.227.34.172:3003/api/v1/files/photos${image.response.data.path}`);
        const {name, unitType, category, tax, costPrice, stock, description, unitPrice} = values;
        const body = {
            name,
            unitType,
            category,
            tax: Number(tax),
            images,
            priceList: {
                price: Number(unitPrice),
                cost: Number(costPrice),
                stock: Number(stock)
            },
            description,
        }

        if(unitType === 'weight') {
            body.weightUnit = values.weightUnit;
            body.weight = Number(values.weight);
        } else {
            body.weight = 0;
            body.weightUnit = 'kg'
        }

        const res = await dispatch.vendorStore.editProduct({
            id: product._id,
            body,
        });
        if(res) {
            router.push(routes.vendors.index)
        }
    }

    const checkValidation = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    }

    return (
        <Page title={false} breadcrumb={breadcrumb}>
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
                        }}>Edit Product</h1>
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
                            <Upload
                                name={'photo'}
                                action={'http://165.227.34.172:3003/api/v1/files/photos/'}
                                headers={{
                                    Authorization: `Bearer ${token}`
                                }}
                                listType="picture"
                                className={'flex upload-list-inline flex-row-reverse justify-end items-stretch flex-wrap-reverse'}
                                onChange={handleChange}
                                fileList={imagesList}
                            >
                                <div className="pt-2 h-full" style={{ float: 'left'}}>
                                    <div className={'flex items-center flex-row justify-center border border-dashed border-input px-12 bg-card h-full'} style={{ height: 66}}>
                                        <PlusOutlined className={'text-2xl text-icon'} />
                                        <div className={'pl-3 text-cell'}>Upload</div>
                                    </div>
                                </div>
                            </Upload>
                        </Item>
                    </Col>
                    <Col xs={24}>
                        <Item name={'description'} label={'Description'} rules={[
                            {
                                required: true,
                                message: 'This Field is required'
                            }
                        ]}>
                            <Input.TextArea placeholder={'Description'} autoSize={{ minRows: 4, maxRows: 9}} style={{ resize: 'none'}}/>
                        </Item>
                    </Col>
                    <Col xs={24} className={'flex flex-col md:flex-row-reverse md:mt-6 mt-6'}>
                        <Item>
                            <Button type="primary" block className={'w-full md:w-32 ml-0 md:ml-5'} htmlType={'submit'} loading={loading}>
                                Save
                            </Button>
                        </Item>
                        <Item>
                            <Link href={routes.vendors.index}>
                                <Button danger className={'w-full md:w-32'}>Cancel</Button>
                            </Link>
                        </Item>
                    </Col>
                </Row>
            </Form>
        </Page>
    )
}

export async function getServerSideProps({ req, res, params }) {

    let cookies = cookie.parse(req.headers.cookie || '');
    let token = cookies.token
    let userType = cookies.type;


    let product = {};

    if (!token) {
        res.writeHead(307, { Location: routes.vendors.auth.login });
        res.end();
        return {
            props: {
                product,
            }
        };
    }

    if(cookies.type !== 'vendor') {
        res.writeHead(307, { Location: userTypes[cookies.type].profile });
        res.end();
        return {
            props: {
                product,
            }
        };
    }


    const store = getStore();
    const response = await store.dispatch.vendorStore.getProduct({
        id: params.number,
        token,
    })

    if(!response) {
        res.writeHead(307, { Location: routes.vendors.index });
        res.end();
        return {
            props: {
                product,
            }
        };
    }

    if(response) {
        product = response;
    }
    return {
        props: {
            product,
        }
    }
}

export default EditProduct;