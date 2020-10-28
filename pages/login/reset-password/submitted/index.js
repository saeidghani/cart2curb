import React, {useEffect} from 'react';
import Link from "next/link";

import Page from '../../../../components/Page';
import { GreenCheckmarkIcon } from "../../../../components/icons";
import routes from "../../../../constants/routes";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {useRedirectAuthenticated} from "../../../../hooks/auth";

const Index = props => {
    const {
        isReseted,
        resetAttempt,
        isLoggedIn
    } = useSelector(state => state.auth);
    const dispatch = useDispatch()
    const router = useRouter();

    const redirect = useRedirectAuthenticated();

    useEffect(() => {
        redirect();
    }, [redirect])


    useEffect(() => {
        dispatch.auth.increaseAttempt();
    }, []);

    useEffect(() => {
        if(resetAttempt !== 1 || !isReseted) {
            dispatch.auth.destroyResetToken();
            if(isLoggedIn) {
                router.push(routes.profile.index);
            } else {
                router.push(routes.auth.login);
            }
        }
    }, [resetAttempt, router, isReseted, isLoggedIn])

    return (
        <Page title={false} breadcrumb={[]}>
            <div className="flex items-center text-center flex-col justify-center">
                <GreenCheckmarkIcon/>
                <h3 className="text-2xl font-medium py-8 my-0">Success</h3>
                <p className="text-paragraph pb-40">You have successfully changed your password, use the link below to login.</p>
                <Link href={routes.auth.login}>
                    <a className="pl-2 text-info font-medium cursor-pointer text-base">Login</a>
                </Link>
            </div>
        </Page>
    )
}

export default Index;