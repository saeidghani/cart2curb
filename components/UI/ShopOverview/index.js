import React, {useState} from 'react';
import { Button } from 'antd';
import { EyeOutlined, ShopOutlined } from '@ant-design/icons';
import routes from "../../../constants/routes";
import Link from "next/link";

const ShopOverview = ({imageURL, name, title, service, subType, ...props}) => {
    const [hasError, setHasError] = useState(false);

    const changeToPlaceholder = (source) => {
        setHasError(true);

        source.onError = '';
        return true;
    }

    return (
        <div className="flex flex-col h-full">
            <Link href={routes.stores.single(props._id)} as={routes.stores.single(props._id)}>
                {hasError ? (
                    <div className="bg-card flex items-center justify-center text-4xl text-gray cursor-pointer" style={{ maxHeight: 288, minHeight: 288, objectFit: 'cover', width: '100%', borderRadius: 2 }}>
                        <ShopOutlined />
                    </div>
                ) : (
                    <img src={imageURL} alt={name} style={{ maxHeight: 288, minHeight: 288, objectFit: 'contain', width: '100%', borderRadius: 2, cursor: 'pointer' }} onError={changeToPlaceholder}/>
                )}
            </Link>
            <div className="flex flex-col mt-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-base text-paragraph font-medium">{name}</span>
                    <span className="text-sm text-type font-medium">{title}</span>
                </div>
                {!subType && <span className="text-transparent text-xs font-medium">ddd</span>}
                <span className="text-xs text-overline font-medium mb-4">{subType?.length > 40 ? `${subType.substring(0, 35)} ...` : subType}</span>
                {props._id && (
                    <Link href={routes.stores.single(props._id)} as={routes.stores.single(props._id)}>
                        <Button danger icon={<EyeOutlined style={{ fontSize: 18}} />} className={'flex items-center font-bold justify-center h-14'}>Show</Button>

                    </Link>
                )}
            </div>
        </div>
    )
}

export default ShopOverview;
