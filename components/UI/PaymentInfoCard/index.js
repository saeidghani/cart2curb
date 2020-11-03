import React from 'react';
import { Button, Divider, Space, Grid } from 'antd';

const PaymentInfoCard = ({card, expireInfo, deleteHandler, editHandler, ...props}) => {
    const { lg, md, sm } = Grid.useBreakpoint();
    return (
        <>
            <div className="flex flex-row items-center justify-between py-2">
                <Space size={lg ? 60 : md ? 40 : sm ? 20 : 16}>
                    <span className="text-type text-base font-medium">{card}</span>
                    <span className="text-type text-base font-medium">Expires: {expireInfo}</span>
                </Space>
                <Button type={'link'} onClick={deleteHandler} className={'px-0'}>
                    <span className="text-paragraph underline">
                    Delete
                    </span>
                </Button>
            </div>
            <Divider/>
        </>
    )
}

export default PaymentInfoCard;