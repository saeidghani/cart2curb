import React, {useState, useEffect} from 'react';
import {Form, Row, Col, Input, Select, Upload, Radio, Button, message} from 'antd';

import Page from "../../../../components/Page";
import routes from "../../../../constants/routes";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import Link from "next/link";

const {Item} = Form;
const {Option} = Select;

const EditCategory = props => {
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
            title: 'Store',
            href: routes.admin.stores.storeDetails,
            query: {tab: 'category', storeId, storeType}
        },
        {
            title: 'Categories',
            href: routes.admin.stores.storeDetails,
            query: {tab: 'category', storeId, storeType}
        },
        {
            title: `Edit`,
        }
    ]

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
        <Page title={false} headTitle={'Edit Category'} breadcrumb={breadcrumb}>
            <Form form={form} layout={'vertical'} onFinish={submitHandler} onFinishFailed={checkValidation}>
                <Row gutter={24}>
                    <Col xs={24}>
                        <h1 style={{
                            fontSize: 27,
                            fontWeight: 'medium',
                            marginTop: 0,
                            marginBottom: 25,
                            color: '#020911',
                        }}>Edit Category</h1>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Item name={'name'} label={'Name'}>
                            <Input placeholder={'Name'}/>
                        </Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Item name={'parent'} label={'Parent Category'}>
                            <Select placeholder={'Select Parent Category'} loading={parentLoading}>
                                <Option value={''}>None</Option>
                                {(categories?.data || [])?.filter(item => item._id !== categoryId).map((item, index) => {
                                    return (
                                        <Option value={item._id} key={item._id}>{item.name}</Option>
                                    )
                                })}
                            </Select>
                        </Item>
                    </Col>
                    <Col xs={24}>
                        <Item
                            name={'description'}
                            label={'Description'}
                        >
                            <Input.TextArea placeholder={'description'} autoSize={{minRows: 4, maxRows: 8}}
                                            style={{resize: 'none'}}/>
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
        </Page>
    )
}

export default EditCategory;