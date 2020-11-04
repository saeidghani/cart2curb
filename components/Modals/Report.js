import React from 'react';
import {Modal, Form, Input, message} from "antd";

const { Item } = Form;

const ReportModal = ({ visible, onHide, onOk }) => {
    const [form] = Form.useForm();

    const submitHandler = () => {
        const formFields = form.getFieldsValue();
        if(!formFields.message) {
            message.error('Please write your Report Message first');
            return false;
        }
        onOk(formFields.message);
    }

    return (
        <Modal
            title={'Report'}
            visible={visible}
            onOk={submitHandler}
            onCancel={onHide}
            centered
            okText={'Send'}
            cancelText={'Cancel'}
            cancelButtonProps={{
                danger: true,
                className: 'w-32'
            }}
            okButtonProps={{
                className: 'w-32'
            }}
            width={560}
        >
            <Form form={form} layout={'vertical'}>
                <Item name={'message'} label={'Write Your Report Here'}>
                    <Input.TextArea placeholder={'Report Message'} autoSize={{ minRows: 5, maxRows: 5 }}  style={{ resize: 'none' }}/>
                </Item>
            </Form>
        </Modal>
    )
}

export default ReportModal;