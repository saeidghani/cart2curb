import { Modal } from 'antd';
import React from "react";

const deleteModal = ({ onOk, content, okText, title}) => {
    Modal.confirm({
        title: title || 'Delete Permission',
        content: (
            <span className="text-paragraph">{content || 'Are you sure to Delete? There is no going back!!'}</span>
        ),
        onOk,
        okText: okText || 'Yes, Do it',
        cancelText: 'Cancel',
        cancelButtonProps: {
            danger: true,
            className: 'w-32'
        },
        okButtonProps: {
            className: 'w-32',
        },
        centered: true,
        width: 600
    });
}

export default deleteModal;