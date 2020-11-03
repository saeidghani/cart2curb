import React from 'react';
import { Button, Divider } from 'antd';

const AddressCard = ({title, value, deleteHandler, ...props}) => {
    return (
        <>
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col justify-center flex-grow">
                    <span className="text-paragraph text-xs font-medium mb-3">{title}</span>
                    <span className="text-type text-base font-medium">{value}</span>
                </div>
                <Button type={'link'} onClick={deleteHandler} className={'px-0'} disabled={props.disabled}>
                    <span className="text-paragraph text-base underline">
                        Delete
                    </span>
                </Button>
            </div>
            <Divider/>
        </>
    )
}

export default AddressCard;