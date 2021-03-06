import cookie from 'cookie';
import api from '../../../http/Api';

export default async function handler(req, res) {
    try {
        let cookies = cookie.parse(req.headers.cookie || '');
        const options = {}
        if(cookies.hasOwnProperty('guestId')) {
            options.headers = {
                Cookie: `guestId=${cookies.guestId}`
            }
        }
        const response = await api.cart.guestInfo(req.body, options);
        if(response.headers['set-cookie']) {
            console.log(response.headers);
            res.setHeader('Set-Cookie', [
                ...response.headers['set-cookie']
            ])
        }
        res.status(200).json(response.data);
    } catch(e) {
        res.status(e.response.status).json(e.response.data)
    }

}