import {serialize} from 'cookie';

export default async function handler(req, res) {

    res.setHeader('Set-Cookie', [
        serialize('token', '', {
            maxAge: -1,
            path: '/',
        }),
        serialize('type', '', {
            maxAge: -1,
            path: '/',
        }),

    ]);
    res.end();
}