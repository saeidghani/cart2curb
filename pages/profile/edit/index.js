import React, {useState} from 'react';
import {
    Button,
    Input,
    Form,
    Row,
    Col,
    Divider,
    Select, Upload, DatePicker, message
} from 'antd';

import Page from '../../../components/Page';
import routes from "../../../constants/routes";

const { Item } = Form;
const { Option } = Select;

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

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


const AccountEdit = props => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState('')
    const [form] = Form.useForm();

    const breadcrumb = [
        {
            title: "User Profile",
            href: routes.profile.index
        },
        {
            title: 'Add/Edit Info'
        }
    ]

    const handleChange = info => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl => {
                setLoading(true);
                setImageUrl(imageUrl);
            });
        }
    };

    return (
        <Page title={'Account Edit'} breadcrumb={breadcrumb}>
            <Row>
                <Col span={24}>
                    <Form
                        form={form}
                        layout="vertical"
                        className="flex flex-col"
                    >
                        <Row gutter={24}>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'firstname'} label={'First Name'}>
                                    <Input placeholder="First Name" />
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'lastname'} label={'Last Name'}>
                                    <Input placeholder="Last Name" />
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'email'} label={'Email Address'}>
                                    <Input type='email' placeholder="Email Address" disabled={true} />
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'phone'} label={'Phone Number'}>
                                    <Input placeholder="Phone Number" />
                                </Item>
                            </Col>

                            <Col xs={24}>
                                <Divider />
                            </Col>

                            <Col xs={24}>
                                <h3 className="text-type font-medium text-base mb-8">Details</h3>
                            </Col>

                            <Col lg={8} md={12} xs={24}>
                                <Item name={'avatar'}>
                                    <div className={'flex items-center justify-start mt-4'}>
                                        <Upload
                                            name="avatar"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                            beforeUpload={beforeUpload}
                                            onChange={handleChange}
                                        >
                                            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: 50, height: 50, borderRadius: 50 }} /> : (
                                                <>
                                                    <div className={'full-rounded text-primary flex items-center justify-center'} style={{ width: 50, height: 50, borderRadius: 50}}>+</div>
                                                </>
                                            )}
                                        </Upload>
                                        <label htmlFor={'avatar'} className="text-info ml-3">Upload</label>
                                    </div>
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'notification'} label={'Order Status Notification Method'}>
                                    <Select
                                        placeholder={'Select'}
                                    >
                                        <Option value={'sms'}>Text Message to Phone Number</Option>
                                        <Option value={'mail'}>Send a mail to Email Address</Option>
                                    </Select>
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'birthday'} label={'Birthday'}>
                                    <DatePicker className={'w-full'}/>
                                </Item>
                            </Col>

                            <Col lg={8} md={12} xs={24}>
                                <Item name={'stream-preference'} label={'Stream Preference'}>
                                    <Select
                                        placeholder={'Select'}
                                    >
                                        <Option value={'skype'}>Skype</Option>
                                        <Option value={'whatsapp'}>Whatsapp</Option>
                                        <Option value={'telegram'}>Telegram</Option>
                                        <Option value={'twitter'}>Twitter</Option>
                                    </Select>
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'id'} label={'Skype ID'}>
                                    <Input placeholder="Skype ID" />
                                </Item>
                            </Col>

                            <Col xs={24}>
                                <Divider />
                            </Col>
                            <Col xs={24}>
                                <h3 className={'font-medium text-base pb-6'}>Social Integration</h3>
                            </Col>

                            <Col lg={8} md={12} xs={24}>
                                <Item name={'facebook-ID'} label={'Facebook'}>
                                    <Input placeholder="Facebook Username" />
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'instagram-ID'} label={'Instagram'}>
                                    <Input placeholder="Instagram Username" />
                                </Item>
                            </Col>

                            <Col xs={24} className={'flex items-center flex-row-reverse pt-8'}>
                                <Item>
                                    <Button type="primary" className={'w-32 ml-5'}>
                                        Save
                                    </Button>
                                </Item>
                                <Item>
                                    <Button danger className={'w-32'}>
                                        Cancel
                                    </Button>
                                </Item>
                            </Col>
                        </Row>

                    </Form>
                </Col>
            </Row>
        </Page>
    )
}

export default AccountEdit;