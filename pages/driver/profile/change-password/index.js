import React, {useEffect, useState} from 'react';
import {
    Button,
    Input,
    Form,
    Row,
    Col, message
} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import {useRouter} from "next/router";
import DriverPage from '../../../../components/DriverPage';
import routes from "../../../../constants/routes";
const {Item} = Form;
const EditCustomer = props => {
    const loading = useSelector(state => state?.loading?.effects?.adminUser?.getCustomer);
    const [imageUrl, setImageUrl] = useState('')
    const [stream, setStream] = useState("Facebook");
    const customer = useSelector(state => state?.adminUser?.customer);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const token = useSelector(state => state?.adminAuth?.token);
    const router = useRouter();
    const {customerId} = router.query;

    useEffect(() => {
        if (customerId) {
            dispatch.adminUser?.getCustomer(customerId);
        }
    }, [customerId]);
    useEffect(() => {
        let streamPreference = '',
            streamId = '',
            instagram = '',
            facebook = '';
        const streamOnIndex = customer?.socialMedias ? customer?.socialMedias?.findIndex(item => item?.streamOn) : -1;
        const instagramIndex = customer?.socialMedias ? customer?.socialMedias?.findIndex(item => item?.provider === 'instagram') : -1;
        const facebookIndex = customer?.socialMedias ? customer?.socialMedias?.findIndex(item => item?.provider === 'facebook') : -1;
        if (streamOnIndex > -1) {
            streamPreference = customer?.socialMedias[streamOnIndex]?.provider;
            streamId = customer?.socialMedias[streamOnIndex]?.username;
            setStream(streamPreference);
        }
        if (instagramIndex > -1) {
            instagram = customer?.socialMedias[instagramIndex]?.username;
        }
        if (facebookIndex > -1) {
            facebook = customer?.socialMedias[facebookIndex]?.username;
        }
        setImageUrl(customer?.image);
        form.setFieldsValue({
            firstName: customer?.firstName || '',
            lastName: customer?.lastName || '',
            email: customer?.email || '',
            phone: customer?.phone || '',
            birthdate: customer?.birthdate ? moment(customer?.birthdate || '') : '',
            notifyMethod: customer?.notifyMethod || undefined,
            streamPreference,
            streamId,
            instagram,
            facebook,
        })
    }, [customer]);

    const breadcrumb = [
        {
            title: 'Users',
            href: routes.admin.users.index,
            query: {tab: 'customers'}
        },
        {
            title: 'Customers',
            href: routes.admin.users.index,
            query: {tab: 'customers'}
        },
        {
            title: `Edit`,
        }
    ]
    const handleChange = info => {
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            setImageUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/files/photos${info.file.response.data.path}`);
        }
    };
    const submitHandler = async (values) => {
        const {notifyMethod, birthdate, streamPreference, streamId, facebook, instagram, firstName, lastName, phone} = values;
        let wasStreamSet = false;
        const body = {
            notifyMethod,
            birthdate: moment(birthdate).format('YYYY-MM-DD'),
            firstName,
            lastName,
            phone
        }
        if (imageUrl) {
            body.image = imageUrl
        }
        const socialMedias = [];
        if (facebook) {
            socialMedias.push({
                "username": facebook,
                "provider": "facebook",
                "streamOn": streamPreference === 'facebook'
            })
            if (streamPreference === 'facebook') {
                wasStreamSet = true;
            }
        }
        if (facebook) {
            socialMedias.push({
                "username": instagram,
                "provider": "instagram",
                "streamOn": streamPreference === 'instagram'
            })
            if (streamPreference === 'instagram') {
                wasStreamSet = true;
            }
        }
        if (streamPreference && !wasStreamSet) {
            if (!streamId) {
                message.error('Please enter your Username');
                return false;
            }

            if (!wasStreamSet) {
                socialMedias.push({
                    "username": streamId,
                    "provider": streamPreference,
                    "streamOn": true
                })
            }
        }
        body.socialMedias = socialMedias;

        const res = await dispatch?.adminUser?.editCustomer({customerId, body, token});
        if (res) {
            router.push(routes.admin.users.index);
        }
    }

    const checkValidation = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    }
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
    }
    return (
        <DriverPage title={'Change Password'}>
            <Row>
                <Col span={24}>
                    <Form
                        form={form}
                        layout="vertical"
                        className="flex flex-col"
                        onFinishFailed={checkValidation}
                        onFinish={submitHandler}
                    >
                        <Row gutter={24}>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'Current-Password'} label={'Current Password'}
                                      rules={[
                                          {
                                              required: true,
                                              message: "Please enter your Current Password"
                                          },
                                          {
                                              min: 3,
                                              message: "Password in not True"
                                          }
                                      ]}>
                                    <Input placeholder="Current Password"/>
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'New-Password'} label={'New Password'}
                                      rules={[
                                        {
                                            required: true,
                                            message: "New Password Field is required"
                                        },
                                        {
                                            pattern: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
                                            message: "Please enter valid Email Address"
                                        }
                                      ]}>
                                    <Input placeholder="New Password"/>
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'Confirm-New-Password'} label={'Confirm New Password'}
                                      rules={[
                                          {
                                              required: true,
                                              message: "Confirm Your New Password"
                                          },
                                          {
                                              pattern: /^[1-9][0-9]*$/,
                                              message: "Your Password is not Confirm"
                                          }
                                      ]}>
                                    <Input placeholder="Confirm New Password"/>
                                </Item>
                            </Col>
                            <Col xs={24} className="mt-4">
                                <Item>
                                    <Button type="primary" block htmlType={'submit'} loading={loading}>
                                       Save Changes
                                    </Button>
                                </Item>
                            </Col>
                            <Col xs={24}>
                                <Item>
                                <Button className="w-full p-3 border border-red-500 border-solid text-red-500 text-center font-medium text-sm mr-1">Cancel</Button>

                                </Item>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </DriverPage>
    )
}

export default EditCustomer;