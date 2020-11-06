import React, {useEffect, useState} from 'react';
import {Form, Row, Col, Input, Select, Button, message} from 'antd';
import Page from "../../../../components/Page";
import routes from "../../../../constants/routes";
import {useDispatch, useSelector} from "react-redux";
import Link from "next/link";
import {useRouter} from "next/router";
import withAuth from "../../../../components/hoc/withAuth";

const { Item } = Form;
const { Option } = Select;

const NewCategory = props => {
    const [form] = Form.useForm();
    const [parentCategories, setParentCategories] = useState([])
    const dispatch = useDispatch();
    const loading = useSelector(state => state.loading.effects.vendorStore.addCategory);
    const parentLoading = useSelector(state => state.loading.effects.vendorStore.getCategories);
    const router = useRouter();

    useEffect(() => {
        dispatch.vendorStore.getCategories({})
            .then(response => {
                setParentCategories(response.data);
            })
    }, [])


    const breadcrumb = [
        {
            title: 'Store',
            href: routes.vendors.index
        },
        {
            title: 'Add Category',
        }
    ]
    const submitHandler = async (values) => {
        const {name, parent, description} = values;
        const body = {
            name, parent, description
        }

        const res = await dispatch.vendorStore.addCategory(body);
        if(res) {
            router.push(routes.vendors.categories.index)
        }
    }

    const checkValidation = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    }
    return (
        <Page title={false} headTitle={'Add Category'} breadcrumb={breadcrumb}>
            <Form form={form} layout={'vertical'} onFinish={submitHandler} onFinishFailed={checkValidation}>
                <Row gutter={24}>
                    <Col xs={24}>
                        <h1 style={{
                            fontSize: 27,
                            fontWeight: 'medium',
                            marginTop: 0,
                            marginBottom: 25,
                            color: '#020911',
                        }}>Add Category</h1>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Item name={'name'} label={'Name'} rules={[
                            {
                                required: true,
                                message: "Name field is required"
                            }
                        ]}>
                            <Input placeholder={'Name'}/>
                        </Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Item name={'parent'} label={'Parent Category'}>
                            <Select placeholder={'Select Parent Category'} loading={parentLoading}>
                                <Option value={''}>None</Option>
                                {parentCategories && parentCategories.map((item, index) => {
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
                            <Input.TextArea placeholder={'description'} autoSize={{ minRows: 4, maxRows: 8 }} style={{ resize: 'none' }}/>
                        </Item>
                    </Col>
                    <Col xs={24} className={'flex flex-col md:flex-row-reverse md:mt-10 mt-6'}>
                        <Item>
                            <Button type="primary" block className={'w-full md:w-32 ml-0 md:ml-5'} htmlType={'submit'} loading={loading || parentLoading}>
                                Save
                            </Button>
                        </Item>
                        <Item>
                            <Link href={routes.vendors.categories.index}>
                                <Button danger className={'w-full md:w-32'}>Cancel</Button>
                            </Link>
                        </Item>
                    </Col>
                </Row>
            </Form>
        </Page>
    )
}

export default withAuth(NewCategory, 'vendor');