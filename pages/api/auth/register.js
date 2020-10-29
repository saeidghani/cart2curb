import { serialize } from 'cookie';
import api from '../../../http/Api';

export default async function handler(req, res) {
    try {
        const response = await api.customer.auth.register(req.body);
        if(response.data.success) {

            res.setHeader('Set-Cookie', [
                serialize('token', String(response.data.data.token),  {
                    path: '/',
                    expires: (new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
                    maxAge: 30 * 24 * 60 * 60
                }),
                serialize('type', String("customer"),  {
                    path: '/',
                    expires: (new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
                    maxAge: 30 * 24 * 60 * 60
                })
            ])
        }
        res.status(response.status).json(response.data);

    } catch(e) {
        res.status(e.response.status).json(e.response.data)
    }
}