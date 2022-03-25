import React from 'react';

import routes from "../../constants/routes";
import {getStore} from "../../states";
import cookie, {serialize} from "cookie";
import userTypes from "../../constants/userTypes";

const ProfileRedirect = (props) => {
    return null;
}

export async function getServerSideProps({ req, res, query }) {
    let store = getStore();
    let { token, role } = query;

    let cookies = cookie.parse(req.headers.cookie || '');
    let cookieToken = cookies.token
    let userType = cookies.type;

    if(cookieToken) {
        res.writeHead(307, { Location: userTypes[userType].profile });
        res.end();
    } else {
        if(role === 'customer') {
            let profile = await store.dispatch.profile.getProfile({
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(profile) {
                res.setHeader('Set-Cookie', [
                    serialize('token', String(token),  {
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

                res.writeHead(307, { Location: routes.profile.index });
                res.end();
            } else {
                res.writeHead(307, { Location: routes.auth.login });
                res.end();
            }
        } else if(role === 'driver') {
            // @todo: Do authorization for driver

            res.writeHead(307, { Location: '/driver/profile' });
            res.end();
        } else {
            res.writeHead(307, { Location: routes.auth.login });
            res.end();
        }
    }

    return {
        props: {}
    }
}

export default ProfileRedirect;