import cookie from 'cookie';
import api from '../../../../http/Api';

export default async function handler(req, res) {

    let cookies = cookie.parse(req.headers.cookie || '');
    let token = cookies.token
    let type = cookies.type;
    try {
        if(token && type === 'customer') {
            const response = await api.cart.setDeliveryTime(req.body, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            res.status(200).json(response.data);
        } else {

            let cookies = cookie.parse(req.headers.cookie || '');
            const options = {}
            if(cookies.hasOwnProperty('guestId')) {
                options.headers = {
                    Cookie: `guestId=${cookies.guestId}`
                }
            }
            const response = await api.cart.setDeliveryTime(req.body, options);
            if(response.headers['set-cookie']) {
                console.log(response.headers);
                res.setHeader('Set-Cookie', [
                    ...response.headers['set-cookie']
                ])
            }
            res.status(200).json(response.data);
        }
    } catch(e) {
        res.status(e.response.status).json(e.response.data)
    }

}