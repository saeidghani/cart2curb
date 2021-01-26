import React from 'react';
import Link from "next/link";

import routes from "../../constants/routes";
import {LikeTwoTone} from "@ant-design/icons";

const Success = props => {
    return (
        <div>
            <div className="flex items-center text-center flex-col justify-center">
                <LikeTwoTone style={{fontSize: 40, marginTop: 50}} />
                <h3 className="text-2xl text-type font-medium my-0 pt-2 pb-2">Success</h3>
                <p className="text-paragraph text-base pb-20">Thanks for submitting, we will review your application and get in touch in 48 hours!</p>
                <div className="flex space-x-2 items-center">
                    <div>Already a Cart2Curb driver?</div>
                    <Link href={routes.driver.auth.login}>
                        <a className="text-secondarey font-medium cursor-pointer text-base">Login</a>
                    </Link></div>
            </div>
        </div>
    )
}

export default Success;