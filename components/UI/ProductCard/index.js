import React from 'react';
import Link from "next/link";
import { EyeOutlined } from '@ant-design/icons';

import routes from "../../../constants/routes";

import './styles.scss';


const ProductCard = props => {
    console.log(props);
    return (
        <div className={'border border-overline product-card'}>
            <img className={'product-card__image'} src={props.images} alt={props.name}/>
            <Link href={routes.stores.product()} as={routes.stores.product(props.vendor, props._id)}>
                <div className={'product-card__overlay'}>
                    <EyeOutlined className={'text-white text-3xl'}/>
                </div>
            </Link>

        </div>
    )
}

export default ProductCard;