import React from 'react';
import cookie from "cookie";
import routes from "../../../../constants/routes";
import {getStore} from "../../../../states";
import CheckoutSuccess from "../../../../components/CheckoutSuccess";

const Checkout = props => {
    const { cart } = props;

    return <CheckoutSuccess cart={cart}/>
}


export async function getServerSideProps({ req, res }) {

    let cookies = cookie.parse(req.headers.cookie || '');
    let userType = cookies.type;

    let cart = {}
    if(userType) {
        if (userType === 'customer') {
            res.writeHead(307, { Location: routes.cart.checkout });
            res.end();
            return {
                props: {
                    cart,
                }
            };
        } else if(userType !== 'vendor') {
            res.writeHead(307, { Location: routes.auth.login });
            res.end();
            return {
                props: {
                    cart,
                }
            };
        }
    }
    const store = getStore();
    try {
        let response;
        response = await store.dispatch.cart.getCart({
            headers: {
                ...req.headers
            }
        });

        if(response) {
            cart = response;
            if(!cart.products || cart.products.length === 0) {
                res.writeHead(307, { Location: routes.cart.index });
                res.end();
                return {
                    props: {
                        cart,
                    }
                };
            }
            if(!cart.deliveryTime || !cart.address) {
                res.writeHead(307, { Location: routes.cart.guest.index });
                res.end();
                return {
                    props: {
                        cart,
                    }
                };
            }

        }
    } catch(e) {
        return {
            cart,
        }
    }

    return {
        props: {
            cart,
        }
    };

}

export default Checkout;