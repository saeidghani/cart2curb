import cookie, { serialize } from 'cookie';
import api from '../../../../http/Api';

export default async function handler(req, res) {

    try {

        let cookies = cookie.parse(req.headers.cookie || '');
        const options = {}
        if(cookies.hasOwnProperty('guestId')) {
            options.headers = {
                Cookie: `guestId=${cookies.guestId}`
            }
        }
        const response = await api.vendor.auth.login(req.body, options);
        if(response.data.success) {

            res.setHeader('Set-Cookie', [
                serialize('token', String(response.data.data.token),  {
                    path: '/',
                    expires: (new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
                    maxAge: 30 * 24 * 60 * 60,
                    httpOnly: true,
                }),
                serialize('type', String("vendor"),  {
                    path: '/',
                    expires: (new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
                    maxAge: 30 * 24 * 60 * 60,
                    httpOnly: true,
                })
            ])
        }
        res.status(response.status).json(response.data);

    } catch(e) {
        res.status(e.response.status).json(e.response.data)
    }
}