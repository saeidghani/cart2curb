import {serialize} from 'cookie';

export default async function handler(req, res) {

    res.setHeader('Set-Cookie', [
        serialize('token', '', {
            maxAge: -1,
            path: '/',
            httpOnly: true,
        }),
        serialize('type', '', {
            maxAge: -1,
            path: '/',
            httpOnly: true,
        }),

    ]);
    res.end();
}