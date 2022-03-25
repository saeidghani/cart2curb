import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Loading = props => {
    return (
        <div className="bg-card flex items-center justify-center py-40 rounded">
            <Spin indicator={antIcon} />
        </div>
    )
}

export default Loading;