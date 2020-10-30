import api from '../../../../http/Api';

export default async function handler(req, res) {
    try {
        const response = await api.vendor.auth.register(req.body);
        res.status(response.status).json(response.data);

    } catch(e) {
        res.status(e.response.status).json(e.response.data)
    }
}