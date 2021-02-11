import React, {useEffect, useState} from 'react';
import {Form, Row, Col, Input, Button, message} from 'antd';
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";

import {EditOutlined} from '@ant-design/icons';

const {Item} = Form;

const Taxes = props => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const loading = useSelector(state => state.loading.effects.adminProfile.getSystemConfig);
    const token = useSelector(state => state?.adminAuth?.token);
    const systemConfig = useSelector(state => state?.adminProfile?.systemConfig);
    const router = useRouter();
    const [enableField, setEnableField] = useState('');
    const {editField} = router.query;

    useEffect(() => {
        if (token) {
            dispatch?.adminProfile?.getSystemConfig({token});
        }
    }, [token]);

    useEffect(() => {
        const {deliveryFee, deliveryTaxPercent, serviceFee, serviceTaxPercent} = systemConfig || {};
        form.setFieldsValue({
            deliveryFee, deliveryTaxPercent, serviceFee, serviceTaxPercent
        });
    }, [systemConfig]);

    const submitHandler = async (values) => {
        const {deliveryFee, deliveryTaxPercent, serviceFee, serviceTaxPercent} = values;
        const body = {
            deliveryFee: deliveryFee * 1,
            deliveryTaxPercent: deliveryTaxPercent * 1,
            serviceFee: serviceFee * 1,
            serviceTaxPercent: serviceTaxPercent * 1
        }

        const res = await dispatch.adminProfile.editSystemConfig({body, token});
        if (res) {
            setEnableField('');
        }
    }

    const checkValidation = (errorInfo) => {
        message.error(errorInfo?.errorFields[0]?.errors[0], 5);
    };

    const InputItem = ({name, label}) => (
        <Col xs={24} md={12} lg={10} className="flex items-center space-x-2 w-full">
            <Item name={name} label={label} className="w-full">
                <Input
                    placeholder={label}
                    disabled={name !== enableField}
                    className={name === enableField ? 'border border-solid border-red-500' : ''}
                />
            </Item>
            <EditOutlined className='text-secondarey text-xl' onClick={() => setEnableField(name)}/>
        </Col>
    );

    const inputItemInfo = [
        {name: "serviceFee", label: "Service Cost"},
        {name: "deliveryFee", label: "Delivery Cost"},
        {name: "serviceTaxPercent", label: "Service Tax"},
        {name: "deliveryTaxPercent", label: "Delivery tax"},
    ];

   /* const inputItemInfo = [
        {name: "serviceFee", label: "Service Fee($)"},
        {name: "deliveryFee", label: "Delivery Fee($)"},
        {name: "serviceTaxPercent", label: "Service Tax(%)"},
        {name: "deliveryTaxPercent", label: "Delivery tax(%)"},
        {name: "deliveryTaxPercent", label: "First Delivery Fee($)"},
        {name: "deliveryTaxPercent", label: "HST(%)"},
    ];*/

    return (
        <Form
            className="mt-4"
            form={form}
            layout={'vertical'}
            onFinish={submitHandler}
            onFinishFailed={checkValidation}>
            <Row gutter={48}>
                {inputItemInfo.map(({name, label}) => <InputItem name={name} label={label}/>)}
                {enableField && <Col xs={24} className={'flex flex-col md:flex-row-reverse md:mt-10 mt-6'}>
                    <Item>
                        <Button
                            type="primary"
                            block
                            className={'w-full md:w-32 ml-0 md:ml-5'}
                            htmlType={'submit'}
                            oading={loading}
                        >
                            Save
                        </Button>
                    </Item>
                    <Item>
                        <Button danger className={'w-full md:w-32'} onClick={() => setEnableField('')}>Cancel</Button>
                    </Item>
                </Col>}
            </Row>
        </Form>
    )
}

export default Taxes;