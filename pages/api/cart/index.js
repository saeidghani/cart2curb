import api from '../../../http/Api';
import cookie from "cookie";

export default async function handler(req, res) {
    try {
        const token = req.headers.authorization || false;
        if(token) {
            const response = await api.cart.cart({
                headers: {
                    ...req.headers
                }
            })
            res.status(200).json(response.data);
        } else {
            const response = await api.cart.cart();
            res.status(200).json(response.data);
        }
    } catch(e) {
        res.status(e.response.status).json(e.response.data)
    }
}