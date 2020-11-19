
import api from '../../../../http/Api';
import cookie from "cookie";

export default async function handler(req, res) {
    try {

        let cookies = cookie.parse(req.headers.cookie || '');
        let type = cookies.type;
        const token = req.headers.authorization;
        if(token && type === 'customer') {
            const response = await api.cart.deliveryTime({
                headers: {
                    ...req.headers
                }
            })
            res.status(200).json(response.data);
        } else {

            const options = {}
            if(cookies.hasOwnProperty('guestId')) {
                options.headers = {
                    Cookie: `guestId=${cookies.guestId}`
                }
            }
            const response = await api.cart.deliveryTime(options);
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