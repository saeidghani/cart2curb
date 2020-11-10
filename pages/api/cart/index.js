import api from '../../../http/Api';
import cookie, {serialize} from "cookie";

export default async function handler(req, res) {
    try {
        const token = req.headers.authorization || false;
        if(token) {
            const response = await api.cart.cart({
                headers: {
                    ...req.headers
                },
            })
            res.status(200).json(response.data);
        } else {

            let cookies = cookie.parse(req.headers.cookie || '');
            const options = {}
            if(cookies.hasOwnProperty('guestId')) {
                options.headers = {
                    Cookie: `guestId=${cookies.guestId}`
                }
            }
            const response = await api.cart.cart(options);
            if(response.headers['set-cookie']) {
                res.setHeader('Set-Cookie', [
                    ...response.headers['set-cookie']
                ])
            }
            res.status(200).json(response.data);
        }
    } catch(e) {
        console.log(e);
        res.status(e.response.status).json(e.response.data)
    }
}