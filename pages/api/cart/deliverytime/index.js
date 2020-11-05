
import api from '../../../../http/Api';

export default async function handler(req, res) {
    try {

        const token = req.headers.authorization;
        if(token) {
            const response = await api.cart.deliveryTime({
                headers: {
                    ...req.headers
                }
            })
            res.status(200).json(response.data);
        } else {
            const response = await api.cart.deliveryTime();
            res.status(200).json(response.data);
        }
    } catch(e) {

        res.status(e.response.status).json(e.response.data)
    }

}