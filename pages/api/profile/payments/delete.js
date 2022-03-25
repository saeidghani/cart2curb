import cookie from 'cookie';
import api from '../../../../http/Api';

export default async function handler(req, res) {

    let cookies = cookie.parse(req.headers.cookie || '');
    let token = cookies.token
    try {
        const response = await api.customer.profile.deletePayment(req.body, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        res.status(200).json(response.data);
    } catch(e) {

        if(e.hasOwnProperty('response')) {
            res.status(e.response.status).json(e.response.data);
        } else {
            res.status(400).json({ message: "Something went wrong"})
        }
    }

}