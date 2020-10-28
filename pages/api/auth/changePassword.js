import cookie from 'cookie';
import api from '../../../http/Api';

export default async function handler(req, res) {
    let cookies = cookie.parse(req.headers.cookie || '');
    let token = cookies.token
    try {
        const response = await api.customer.auth.changePassword(req.body, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        res.status(200).json(response.data);
    } catch(e) {
        res.status(400).json({ message: 'something' })
    }
}