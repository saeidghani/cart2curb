import React, {useEffect, useState} from 'react';
import {Form, Row, Col, Input, Select, Button, message} from 'antd';
import Page from "../../../../components/Page";
import routes from "../../../../constants/routes";
import {useDispatch, useSelector} from "react-redux";
import Link from "next/link";
import {useRouter} from "next/router";

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
        const {name, parent} = values;
        const body = {
            name, parent
        }

        const res = await dispatch.vendorStore.addCategory(body);
        if(res) {
            router.push(routes.vendors.index)
        }
    }

    const checkValidation = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    }
    return (
        <Page title={'Add Category'} breadcrumb={breadcrumb}>
            <Form form={form} layout={'vertical'} onFinish={submitHandler} onFinishFailed={checkValidation}>
                <Row gutter={24}>
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
                            <Select placeholder={'Select Weight Unit'} loading={parentLoading}>
                                {parentCategories && parentCategories.map((item, index) => {
                                    return (
                                        <Option value={item._id} key={item._id}>{item.name}</Option>
                                    )
                                })}
                            </Select>
                        </Item>
                    </Col>
                    <Col xs={24} className={'flex flex-row-reverse md:mt-16 mt-6'}>
                        <Item>
                            <Button type="primary" block className={'w-32 ml-5'} htmlType={'submit'} loading={loading && parentLoading}>
                                Save
                            </Button>
                        </Item>
                        <Item>
                            <Link href={routes.vendors.index}>
                                <Button danger className={'w-32'}>Cancel</Button>
                            </Link>
                        </Item>
                    </Col>
                </Row>
            </Form>
        </Page>
    )
}

export default NewCategory;