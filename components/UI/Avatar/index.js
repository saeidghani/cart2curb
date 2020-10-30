import React from 'react';
import { Space } from 'antd';
import { StarFilled, StarOutlined, UserOutlined } from '@ant-design/icons';

const Avatar = props => {
    return (
        <div className="flex items-center">
            {props.src ? (
                <img src={props.src} alt="profile" className="rounded-full cursor-pointer" />
            ) : (
                <div className={'rounded-full bg-card flex items-center justify-center'} style={{ width: 50, height: 50}}>
                    <UserOutlined />
                </div>
            )}
            {!props.justImage && (
                <div className="flex flex-col justify-center ml-3">
                    <span className="text-paragraph text-xs">{props.title}</span>
                    <span>
                    <Space size={4} className="flex items-center text-yellow-400">
                        <StarFilled className={'text-xs'}/>
                        <StarFilled className={'text-xs'}/>
                        <StarFilled className={'text-xs'}/>
                        <StarFilled className={'text-xs'}/>
                        <StarOutlined className={'text-xs'}/>
                    </Space>
                </span>
                </div>
            )}
        </div>
    )
}

export default Avatar;