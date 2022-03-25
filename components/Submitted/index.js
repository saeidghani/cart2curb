import React from 'react';
import Link from "next/link";

import { GreenCheckmarkIcon } from "../icons";
import routes from "../../constants/routes";

const Index = props => {
    return (
        <div>
            <div className="flex items-center text-center flex-col justify-center">
                <GreenCheckmarkIcon/>
                <h3 className="text-2xl text-type font-medium pt-9 pb-8 my-0">Success</h3>
                <p className="text-paragraph pb-40 text-base">{props.content || 'You have successfully changed your password, use the link below to login.'}</p>
                <Link href={props.href || routes.auth.login}>
                    <a className="text-info font-medium cursor-pointer text-base">Login</a>
                </Link>
            </div>
        </div>
    )
}

export default Index;