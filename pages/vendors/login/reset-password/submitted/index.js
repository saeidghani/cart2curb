import React from 'react';
import Link from "next/link";

import Page from '../../../../../components/Page';
import { GreenCheckmarkIcon } from "../../../../../components/icons";
import routes from "../../../../../constants/routes";

const Index = props => {

    return (
        <Page title={false} breadcrumb={[]}>
            <div className="flex items-center text-center flex-col justify-center">
                <GreenCheckmarkIcon/>
                <h3 className="text-2xl font-medium py-8 my-0">Success</h3>
                <p className="text-paragraph pb-40">You have successfully changed your password, use the link below to login.</p>
                <Link href={routes.vendors.auth.login}>
                    <a className="text-info font-medium cursor-pointer text-base">Login</a>
                </Link>
            </div>
        </Page>
    )
}

export default Index;