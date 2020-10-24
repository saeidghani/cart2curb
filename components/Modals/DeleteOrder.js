import { Modal } from 'antd';
import React from "react";

const deleteOrderModal = (onOk) => {
    Modal.confirm({
        title: 'Cancel Order',
        content: (
            <span className="text-paragraph">Are you sure to cancel this order? There is no going back!!</span>
        ),
        onOk,
        okText: 'Yes, Log Out',
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

export default deleteOrderModal;