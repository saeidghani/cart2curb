import cookie from 'cookie';
import api from '../../../http/Api';

export default async function handler(req, res) {

    let cookies = cookie.parse(req.headers.cookie || '');
    let token = cookies.token
    try {
        const response = await api.customer.profile.updateProfile(req.body.id, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        res.status(200).json(response.data);
    } catch(e) {
        res.status(e.response.status).json(e.response.data)
    }

}