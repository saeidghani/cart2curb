import { Modal } from 'antd';
import React from "react";

const LogoutModal = (onOk) => {
    Modal.confirm({
        title: 'Log Out',
        content: (
            <span className="text-paragraph">Are you sure to log out from your account?</span>
        ),
        onOk,
        okText: 'Yes, Log Out',
        cancelText: 'Cancel',
        cancelButtonProps: {
            danger: true
        },
        centered: true,
        width: 600
    });
}

export default LogoutModal;