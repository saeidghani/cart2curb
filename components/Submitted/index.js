import React, {useEffect} from 'react';
import Link from "next/link";

import { GreenCheckmarkIcon } from "../icons";
import routes from "../../constants/routes";
import {useRedirectAuthenticated} from "../../hooks/auth";

const Index = props => {
    const redirect = useRedirectAuthenticated();

    useEffect(() => {
        redirect();
    }, [redirect])

    return (
        <div>
            <div className="flex items-center text-center flex-col justify-center">
                <GreenCheckmarkIcon/>
                <h3 className="text-2xl font-medium pt-9 pb-8 my-0">Success</h3>
                <p className="text-paragraph pb-40 text-base">You have successfully changed your password, use the link below to login.</p>
                <Link href={routes.auth.login}>
                    <a className="text-info font-medium cursor-pointer text-base">Login</a>
                </Link>
            </div>
        </div>
    )
}

export default Index;