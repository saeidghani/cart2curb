import api from '../../../../http/Api';
import cookie from "cookie";

export default async function handler(req, res) {
    try {

        let cookies = cookie.parse(req.headers.cookie || '');
        const options = {}
        if(cookies.hasOwnProperty('guestId')) {
            options.headers = {
                Cookie: `guestId=${cookies.guestId}`
            }
        }
        const response = await api.vendor.auth.register(req.body, options);
        res.status(response.status).json(response.data);

    } catch(e) {
        res.status(e.response.status).json(e.response.data)
    }
}