import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Row, Col, Input, Form, Table, Select, Button, Space, message} from 'antd';
import {
    PlusCircleOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import Link from "next/link";

import routes from "../../../constants/routes";
import deleteModal from "../../Modals/Delete";
import Loader from "../../UI/Loader";

const {Item} = Form;

let isIntersecting = true;

const Promo = () => {
    const loader = useRef(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [deleted, setDeleted] = useState([]);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const promosLoading = useSelector(state => state?.loading?.effects?.adminUser?.getPromos);
    const promos = useSelector(state => state?.adminProfile?.promos?.data);
    const token = useSelector(state => state?.adminAuth?.token);

    useEffect(async () => {
        if (hasMore || page === 1) {
            const formFields = form.getFieldsValue()
            let query = {
                page_number: page,
                page_size: 15,
            }
            if (formFields.search) {
                query.search = formFields.search;
            }
            try {
                const response = await dispatch.adminProfile?.getPromos({query, token});
                if (response?.data?.length < 15) {
                    setHasMore(false);
                }
            } catch (e) {
                setHasMore(false);
                message.error('An Error was occurred while fetching data')
            }
        }
        isIntersecting = true;
    }, [page, search]);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: "20px",
            threshold: 1
        };

        const observer = new IntersectionObserver(handleObserver, options);
        if (loader.current) {
            observer.observe(loader.current)
        }

    }, [loader.current]);

    const handleObserver = (entities) => {
        const target = entities[0];
        if (target.isIntersecting && isIntersecting) {
            isIntersecting = false
            setPage((page) => page + 1)
        }
    }

    const columns = [
        {
            title: "Promo Code Name",
            dataIndex: 'name',
            key: 'name',
            render: name =>  <span className="text-cell">{name}</span>
        },
        {
            title: "Your Offer",
            dataIndex: 'off',
            key: 'off',
            render: off => <span className="text-cell">{off}</span>
        },
        {
            title: "Members used",
            dataIndex: 'membersUsed',
            key: 'membersUsed',
            render: membersUsed => <span className="text-cell">{membersUsed}</span>
        },
        {
            title: "OP",
            dataIndex: 'action',
            key: 'action',
            render: (actions, {key, promoId}) => {
                return (
                    <div className={'flex flex-row items-center space-x-3'}>
                        <Link href={{pathname: routes.admin.promo.edit(promoId)}}>
                            <Button
                                type={'link'}
                                shape={'circle'}
                                icon={<EditOutlined className={'text-secondarey text-xl'}/>}
                                className={'btn-icon-small'}
                            />
                        </Link>
                        <Button
                            type={'link'}
                            shape={'circle'}
                            icon={<DeleteOutlined className={'text-btn text-xl'}/>}
                            className={'btn-icon-small'} onClick={actions.deleteHandler}
                        />
                    </div>
                )
            },
            width: 140,
        },
    ];

    const data = useMemo(() => {
        return promos?.filter(p => !deleted.includes(p?._id))?.map((promo) => ({
                key: promo?._id,
                promoId: promo?._id,
                off: promo?.off,
                name: `${promo?.code}`,
                membersUsed: `${promo?.membersUsed}`,
                action: {
                    deleteHandler: () => {
                        deleteModal({
                            onOk: async () => {
                                const res = await dispatch?.adminProfile?.deletePromo({
                                    promoId: promo?._id,
                                    token
                                });
                                if (res) {
                                    setDeleted(deleted?.concat(promo?._id))
                                }
                            },
                            okText: 'Ok',
                            title: 'Do you want to delete this promo code?',
                            content: 'Are you sure to delete this promo code? There is no going back!!',
                        });
                    },
                },
            })
        );
    }, [promos, deleted]);

    return (
        <>
            <Row gutter={24} className={'flex items-center pb-4'}>
                <Col xs={24}>
                    <Link href={routes.admin.promo.add}>
                        <Button
                            type={'link'}
                            icon={<PlusCircleOutlined className={'text-info mr-3'} style={{fontSize: 20}}/>}
                            className={'flex ml-auto text-info px-0 hover:text-teal-500 text-base'}
                            disabled={promos?.length === 0}
                        >
                            Add New Promo Code
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col xs={24}>
                    <Table columns={columns} dataSource={data} scroll={{x: 1100}} pagination={false}
                           loading={promosLoading && promos?.length === 0}/>
                    {hasMore && (
                        <div ref={loader}>

                            <div className="flex w-full items-center justify-center py-6"><Loader/></div>
                        </div>
                    )}
                </Col>
            </Row>
        </>
    )
}

export default Promo;