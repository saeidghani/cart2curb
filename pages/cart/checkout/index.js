import React from 'react';
import CheckoutSuccess from "../../../components/CheckoutSuccess";
import {useRouter} from "next/router";


const Checkout = props => {
    const router = useRouter();
    const {orderId} = router.query;

    return <CheckoutSuccess orderId={orderId}/>
}

export default Checkout;