import React from 'react';
import { Modal, Form, Input } from "antd";

const { Item } = Form;

const ReportModal = ({ visible, onHide, onOk }) => {
    const [form] = Form.useForm();
    return (
        <Modal
            title={'Report'}
            visible={visible}
            onOk={onOk}
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
                    <Input.TextArea placeholder={'Report Message'} autoSize={{ minRows: 4, maxRows: 9 }}/>
                </Item>
            </Form>
        </Modal>
    )
}

export default ReportModal;