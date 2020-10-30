import React, {useEffect, useState} from 'react';
import { Row, Col, Button } from 'antd';
import { PlusOutlined, PlusCircleOutlined } from '@ant-design/icons';

import ProfileLayout from "../../../components/Layout/Profile";
import AddressCard from "../../../components/UI/AddressCard";
import cookie from "cookie";
import {getStore} from "../../../states";
import routes from "../../../constants/routes";
import Link from "next/link";
import deleteModal from "../../../components/Modals/Delete";
import {useDispatch, useSelector} from "react-redux";
import {useRedirectToLogin} from "../../../hooks/auth";

const addresses = props => {
    const [deleted, setDeleted] = useState([]);
    const dispatch = useDispatch();
    const deleteLoading = useSelector(state => state.loading.effects.profile.deleteAddress);
    const redirect = useRedirectToLogin()

    useEffect(() => {
        redirect();
    }, [redirect])

    const deleteAddress = async id => {
        const res = await dispatch.profile.deleteAddress(id);
        if(res) {
            setDeleted(deleted.concat(id));
        }
    }
    return (
        <ProfileLayout title={'Addresses'} breadcrumb={[{ title: "User Profile" }]}>
            <Row>
                {props.addresses.length === 0 || props.addresses.length === deleted.length ? (
                    <Col xs={24} className={'flex flex-col items-center justify-center pt-6'}>
                        <PlusCircleOutlined className={'text-paragraph mb-6 text-4xl'} />
                        <span className="text-paragraph mb-4">You have no Address, Use below button to add.</span>

                        <Link href={routes.profile.addresses.add}>
                            <Button
                                type={'link'}
                                icon={<PlusOutlined className={'text-info border-info'} style={{ fontSize: 12 }}/>}
                                className={'flex items-center justify-center text-info px-0 hover:text-teal-500 text-base'}
                            >
                                Add New Address
                            </Button>
                        </Link>
                    </Col>
                ) : (
                    <>
                        {props.addresses.map((item, index) => {
                            if(deleted.includes(item._id)) {
                                return null;
                            }
                            const address = item.addressLine2 ? [item.addressLine2] : [];
                            address.push(item.addressLine1);
                            address.push(item.city);
                            address.push(item.province);
                            address.push(item.country);
                            return (
                                <Col xs={24} key={`address-${index}`}>
                                    <AddressCard title={`Address ${index + 1}`} value={address.join(', ')} deleteHandler={() => deleteModal({
                                        onOk: deleteAddress.bind(this, item._id),
                                        okText: 'Yes, Delete',
                                        title: "Delete Address?",
                                        loading: deleteLoading
                                    })}/>
                                </Col>
                            )
                        })}

                        <Col xs={24} className={'flex'}>
                            <Link href={routes.profile.addresses.add}>
                                <a
                                    className={'flex items-center justify-center text-info p-0'}
                                >
                                    <PlusOutlined className={'text-info mr-3'} style={{ fontSize: 12 }}/>
                                    <span className=" hover:text-teal-500 text-base">
                                        Add New Address
                                    </span>
                                </a>
                            </Link>

                        </Col>
                    </>
                )}
            </Row>
        </ProfileLayout>
    )
}



export async function getServerSideProps({ req, res }) {

    let cookies = cookie.parse(req.headers.cookie || '');
    let token = cookies.token

    let addresses = [];
    if (!token) {
        res.writeHead(307, { Location: routes.auth.login });
        res.end();
        return {
            props: {
                addresses
            }
        };
    }

    if(cookies.type !== 'customer') {
        res.writeHead(307, { Location: routes.vendors.index });
        res.end();
        return {
            props: {
                addresses
            }
        };
    }

    const store = getStore();
    const response = await store.dispatch.profile.getAddresses({
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if(response) {
        addresses = response;
    }
    return {
        props: {
            addresses
        }
    }
}


export default addresses;