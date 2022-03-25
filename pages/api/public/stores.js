import api from '../../../http/Api';

export default async function handler(req, res) {

    try {
        const response = await api.app.stores();

        res.status(200).json(response.data);
    } catch(e) {
        res.status(e.response.status).json(e.response.data)
    }

}