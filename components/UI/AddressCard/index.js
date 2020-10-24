import React from 'react';
import { Button, Divider } from 'antd';

const AddressCard = ({title, value, deleteHandler, ...props}) => {
    return (
        <>
            <div className="flex flex-row items-center justify-between py-2">
                <div className="flex flex-col justify-center flex-grow">
                    <span className="text-paragraph text-xs font-medium mb-3">{title}</span>
                    <span className="text-type text-base font-medium">{value}</span>
                </div>
                <Button type={'link'} onClick={deleteHandler} className={'underline text-paragraph px-0 '}>
                    Delete
                </Button>
            </div>
            <Divider/>
        </>
    )
}

export default AddressCard;