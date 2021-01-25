import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Row, Col, Input, Form, Table, Select, Button, Space, message, Modal} from 'antd';
import {
    PlusCircleOutlined,
    CheckCircleOutlined,
    StopOutlined,
    EditOutlined,
    QuestionCircleOutlined
} from '@ant-design/icons';
import {useDispatch, useSelector} from 'react-redux';
import Link from 'next/link';

import routes from '../../../constants/routes';
import Loader from '../../UI/Loader';
import Avatar from '../../UI/Avatar';

const {Item} = Form;

let isIntersecting = true;
const Drivers = () => {
    const loader = useRef(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [blockDriverId, setBlockDriverId] = useState('');
    const [blocked, setBlocked] = useState([]);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const driversLoading = useSelector(state => state?.loading?.effects?.adminUser?.getDrivers);
    const drivers = useSelector(state => state?.adminUser?.drivers?.data);
    const token = useSelector(state => state?.adminAuth?.token);

    useEffect(async () => {
        if (hasMore || page === 1) {
            const formFields = form.getFieldsValue();
            let query = {
                page_number: page,
                page_size: 15
            };
            if (formFields.search) {
                query.search = formFields.search;
            }
            try {
                const response = await dispatch.adminUser?.getDrivers(query);
                if (response.data.length < 15) {
                    setHasMore(false);
                }
            } catch (e) {
                setHasMore(false);
                message.error('An Error was occurred while fetching data');
            }
        }
        isIntersecting = true;
    }, [page, search]);

    useEffect(() => {
        let isBlocked = [];
        drivers?.forEach((driver) => {
            if (!driver?.isApproved) isBlocked.push(driver?._id);
        });
        setBlocked(isBlocked);
    }, [drivers]);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '20px',
            threshold: 1
        };

        const observer = new IntersectionObserver(handleObserver, options);
        if (loader.current) {
            observer.observe(loader.current);
        }

    }, [loader.current]);

    const handleObserver = (entities) => {
        const target = entities[0];
        if (target.isIntersecting && isIntersecting) {
            isIntersecting = false;
            setPage((page) => page + 1);
        }
    };

    const searchHandler = (values) => {
        isIntersecting = false;
        setPage(1);
        setHasMore(true);
        setSearch(values.search);
    };

    const handleBlockOK = async () => {
        const res = await dispatch.adminUser.addPendingDriver({
            driverId: blockDriverId,
            body: {isApproved: false},
            token
        });
        if (res) {
            setBlockDriverId('');
            setBlocked(blocked.concat(blockDriverId));
        }
    };

    const columns = useMemo(() => [
        {
            title: '',
            dataIndex: 'avatar',
            key: 'avatar',
            render: src => <Avatar src={src} justImage/>
        },
        {
            title: '#',
            dataIndex: 'ID',
            key: 'ID',
            render: number => <span className="text-cell">{number}</span>
        },
        {
            title: 'Driver Name',
            dataIndex: 'name',
            key: 'name',
            render: CXName => <span className="text-cell">{CXName}</span>
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: email => <span className="text-cell">{email}</span>
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            render: phoneNumber => <span className="text-cell">{phoneNumber}</span>
        },
        {
            title: 'Insurance',
            dataIndex: 'insurance',
            key: 'insurance',
            render: insurance => <span className="text-cell"><img src={insurance} alt=""/></span>
        },
        {
            title: 'Driving Insurance',
            dataIndex: 'drivingInsurance',
            key: 'drivingInsurance',
            render: drivingInsurance => <span className="text-cell"><img src={drivingInsurance} alt=""/></span>
        },
        {
            title: 'OP',
            dataIndex: 'action',
            key: 'action',
            render: (actions, {key}) => {
                return (
                    <div className={'flex flex-row items-center space-x-3'}>
                        <Link href={{pathname: routes.admin.drivers.edit(key)}}>
                            <Button
                                type={'link'}
                                shape={'circle'}
                                icon={<EditOutlined className={'text-secondarey text-xl'}/>}
                                className={'btn-icon-small'}
                            />
                        </Link>
                        {(blocked?.includes(key)) ? <Button
                            type={'link'}
                            shape={'circle'}
                            icon={<CheckCircleOutlined className='text-secondarey text-xl'/>}
                            className={'btn-icon-small'}
                            onClick={actions.unBlockHandler}
                        /> : <Button
                            type={'link'}
                            shape={'circle'}
                            icon={<StopOutlined className='text-secondarey text-xl'/>}
                            className={'btn-icon-small'}
                            onClick={actions.blockHandler}
                        />}
                    </div>
                );
            },
            width: 140
        }
    ], [blocked]);

    const setSubstring = (str, lastIndex) => {
        return `${str.substring(0, lastIndex)} ...`;
    };

    const data = useMemo(() => {
        return drivers?.map((driver) => ({
                key: driver?._id,
                avatar: driver?.image,
                ID: driver?._id,
                name: `${driver?.name}`,
                email: driver?.email || '-',
                phoneNumber: driver?.phone || '-',
                insurance: driver?.license || '-',
                drivingInsurance: driver?.license || '-',
                action: {
                    blockHandler: async () => {
                        const res = await dispatch.adminUser.addPendingDriver({
                            driverId: driver?._id,
                            body: {isApproved: false},
                            token
                        });
                        if (res) {
                            const blockedDriver = blocked?.find(b => b === driver?._id);
                            if (!blockedDriver) {
                                setBlocked(prevBlocked => prevBlocked.concat(driver?._id));
                            }
                        }
                    },
                    unBlockHandler: async () => {
                        const res = await dispatch.adminUser.addPendingDriver({
                            driverId: driver?._id,
                            body: {isApproved: true},
                            token
                        });
                        if (res) {
                            const blockedDriver = blocked?.find(b => b === driver?._id);
                            if (blockedDriver) {
                                const newBlocked = blocked?.filter(b => b !== driver?._id);
                                setBlocked(newBlocked);
                            }
                        }
                    }
                }
            })
        );
    }, [drivers, blocked]);

    return (
        <>
            <Modal
                visible={blockDriverId}
                okText="yes, block"
                cancelText="No"
                onOk={handleBlockOK}
                onCancel={() => setBlockDriverId('')}
            >
                <div className="flex space-x-3">
                    <QuestionCircleOutlined style={{color: "#FAAD14", fontSize: 18, marginTop: 2}}/>
                    <div>
                        <div className="font-bold">Block User</div>
                        <div className="mt-2">Are you sure to block this user?</div>
                    </div>
                </div>
            </Modal>
            <Row gutter={24} className={'flex items-center pt-6 pb-4'}>
                <Col lg={18} xs={24}>
                    <Form form={form} layout={'vertical'} onFinish={searchHandler}>
                        <Row gutter={24}>
                            <Col lg={9} xs={24}>
                                <Item name={'search'} label={'Search'}>
                                    <Input placeholder={'Search'}/>
                                </Item>
                            </Col>
                            <Col lg={6} xs={24}>
                                <Item className={'pt-7'}>
                                    <Button type={'primary'} size={'lg'} className={'w-32'} htmlType={'submit'}
                                            loading={driversLoading}>Search</Button>
                                </Item>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col lg={6} xs={24} className={'flex flex-row-reverse'}>
                    <Link href={routes.admin.drivers.add}>
                        <Button
                            type={'link'}
                            icon={<PlusCircleOutlined className={'text-info mr-3'} style={{fontSize: 20}}/>}
                            className={'flex items-center justify-center text-info px-0 hover:text-teal-500 text-base'}
                            disabled={drivers?.length === 0}
                        >
                            Add New Driver
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col xs={24}>
                    <Table columns={columns} dataSource={data} scroll={{x: 1100}} pagination={false}
                           loading={driversLoading && drivers?.length === 0}/>
                    {hasMore && (
                        <div ref={loader}>

                            <div className="flex w-full items-center justify-center py-6"><Loader/></div>
                        </div>
                    )}
                </Col>
            </Row>
        </>
    );
};

export default Drivers;