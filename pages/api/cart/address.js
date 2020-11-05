import cookie from 'cookie';
import api from '../../../http/Api';

export default async function handler(req, res) {

    let cookies = cookie.parse(req.headers.cookie || '');
    let token = cookies.token
    try {
        if(token) {
            const response = await api.cart.address(req.body, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            res.status(200).json(response.data);
        } else {
            const response = await api.cart.address(req.body);
            res.status(200).json(response.data);
        }
    } catch(e) {
        res.status(e.response.status).json(e.response.data)
    }

}