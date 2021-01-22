import React, {useState, useEffect} from 'react';
import {Form, Row, Col, Input, Button, message, Upload} from 'antd';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {useDispatch, useSelector} from 'react-redux';
import {EditOutlined} from '@ant-design/icons';

import routes from '../../../constants/routes';

const {Item} = Form;

const Edit = props => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const loading = useSelector(state => state.loading.effects.adminProfile?.getProfile);
    const token = useSelector(state => state?.adminAuth?.token);
    const profile = useSelector(state => state?.adminProfile?.profile);
    const router = useRouter();


    useEffect(() => {
        if (token) {
            dispatch?.adminProfile?.getProfile({token});
        }
    }, [token]);

    return (
        <div className="flex flex-col mt-2">
            <span className="">Email</span>
            <div className="flex items-center space-x-3">
                <span className="">
                {profile.email}
                </span>
                <Link href={{pathname: routes.admin.profile.changeEmail}}><EditOutlined className="text-secondarey"/></Link>
            </div>
        </div>
    );
};

export default Edit;
