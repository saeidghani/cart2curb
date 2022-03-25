import cookie, {serialize} from 'cookie';
import api from '../../../http/Api';

export default async function handler(req, res) {

    try {
        // @todo: implement driver user
        const response = await api.customer.profile.updateProfile(req.body.profile, {
                headers: {
                    Authorization: `Bearer ${req.body.token}`
                }
            }
        );
        const addressResponse = await api.customer.profile.addAddress(req.body.address, {
                headers: {
                    Authorization: `Bearer ${req.body.token}`
                }
            }
        );

        if(response.data.success && addressResponse.data.success) {
            res.setHeader('Set-Cookie', [
                serialize('token', String(req.body.token),  {
                    path: '/',
                    expires: (new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
                    maxAge: 30 * 24 * 60 * 60,
                    httpOnly: true
                }),
                serialize('type', String("customer"),  {
                    path: '/',
                    expires: (new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
                    maxAge: 30 * 24 * 60 * 60,
                    httpOnly: true
                })
            ])
        }
        res.status(200).json(response.data);
    } catch(e) {
        res.status(e.response.status).json(e.response.data)
    }

}