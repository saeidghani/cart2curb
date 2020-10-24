import React from 'react';
import { Button, Divider, Space, Grid } from 'antd';

const PaymentInfoCard = ({cardType, card, expireInfo, deleteHandler, editHandler, ...props}) => {
    const { lg, md, sm } = Grid.useBreakpoint();
    return (
        <>
            <div className="flex flex-row items-center justify-between py-2">
                <Space size={lg ? 60 : md ? 40 : sm ? 20 : 16}>
                    <span className="text-type text-base font-medium">{cardType} {card}</span>
                    <span className="text-type text-base font-medium">Expires: {expireInfo}</span>
                </Space>
                <Space size={lg ? 60 : md ? 40 : sm ? 20 : 16}>
                    <Button type={'link'} onClick={editHandler} className={'underline text-paragraph px-0 '}>
                        Edit
                    </Button>
                    <Button type={'link'} onClick={deleteHandler} className={'underline text-paragraph px-0 '}>
                        Delete
                    </Button>
                </Space>
            </div>
            <Divider/>
        </>
    )
}

export default PaymentInfoCard;