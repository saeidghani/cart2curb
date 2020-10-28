import {serialize} from 'cookie';
import api from '../../../http/Api';
import routes from "../../../constants/routes";

export default async function handler(req, res) {

    res.setHeader('Set-Cookie', [
        serialize('token', '', {
            maxAge: -1,
            path: '/',
        }),
    ]);
    res.end();
}