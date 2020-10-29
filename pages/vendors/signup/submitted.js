import React from 'react';
import Link from "next/link";

import Page from '../../../components/Page';
import { GreenCheckmarkIcon } from "../../../components/icons";
import routes from "../../../constants/routes";
import withAuth from "../../../components/hoc/withAuth";

const Index = props => {

    return (
        <Page title={false} breadcrumb={[]}>
            <div className="flex items-center text-center flex-col justify-center">
                <GreenCheckmarkIcon/>
                <h3 className="text-2xl font-medium py-8 my-0">Success</h3>
                <p className="text-paragraph pb-40">Thanks for submitting, we will review your application and get in touch in 48 hours!</p>

                <div className="flex flex-row text-center items-center justify-center">
                    <h4 className="font-medium text-secondary text-base">Already a member?</h4>
                    <Link href={routes.vendors.auth.login}>
                        <a className="pl-2 text-info font-medium cursor-pointer text-base">Login</a>
                    </Link>
                </div>
            </div>
        </Page>
    )
}

export default withAuth(Index, routes.vendors.auth.register.index);