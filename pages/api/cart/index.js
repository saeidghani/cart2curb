import api from '../../../http/Api';
import cookie from "cookie";

export default async function handler(req, res) {
    try {
        console.log(req.cookies);
        const response = await api.cart.cart();
        console.log(response);
        res.status(200).json(response.data);
    } catch(e) {
        res.status(e.response.status).json(e.response.data)
    }
}