import React, {useState, useEffect, useMemo} from 'react';
import {Form, Row, Col, Input, Button, message, Select, Table} from 'antd';
import {useRouter} from "next/router";
import Link from "next/link";
import {useDispatch, useSelector} from "react-redux";
import {CloudUploadOutlined, EditOutlined, FileSearchOutlined, UserOutlined} from '@ant-design/icons';

import routes from "../../../../constants/routes";
import DraggableTable from './DraggableTable';

const {Option} = Select;

const Arrangement = props => {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.loading.effects.adminStore.getStores);
    const token = useSelector(state => state?.adminAuth?.token);
    const allStores = useSelector(state => state?.adminStore?.stores?.data);
    const router = useRouter();
    const [selectedStores, setSelectedStores] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {
        if (token) {
            dispatch?.adminStore?.getStores('');
        }
    }, [token]);

    const columns = [
        {
            title: "",
            dataIndex: 'img',
            key: 'img',
            render: img => <span className="text-cell"><img src={img} width={100} alt=""/></span>
        },
        {
            title: "#",
            dataIndex: 'number',
            key: 'number',
            render: number => <span className="text-cell">{number}</span>
        },
        {
            title: "Name",
            dataIndex: 'CXName',
            key: 'CXName',
            render: CXName => <span className="text-cell">{CXName}</span>
        },
        {
            title: "store",
            dataIndex: 'store',
            key: 'store',
            render: store => <span className="text-cell">{store}</span>
        },
        {
            title: "Address",
            dataIndex: 'address',
            key: 'address',
            render: address => <span className="text-cell">{address}</span>
        },
        {
            title: "OP",
            dataIndex: 'action',
            key: 'action',
            render: (_, {storeId}) => {
                return (
                    <div className={'flex flex-row items-center space-x-2'}>
                        <Button
                            danger
                            type='link'
                            onClick={() => {
                                const filteredData = data?.filter(d => d?.storeId !== storeId);
                                const filteredSelectedStores = selectedStores?.filter(el => el !== storeId);
                                setData(filteredData);
                                setSelectedStores(filteredSelectedStores);
                            }}
                        >
                            Remove
                        </Button>
                    </div>
                )
            },
            width: 140,
        },
    ];

    useEffect(() => {
        const stores = allStores?.filter(s => selectedStores.includes(s?.store?._id))?.map((el, index) => {
            return {
                key: index,
                storeId: el?.store?._id,
                vendorId: el?.vendor?._id,
                storeType: el?.store?.storeType,
                number: '???',
                CXName: el?.vendor?.contactName,
                store: el?.store?.name,
                img: el?.store?.image,
                address: `${el?.store?.address?.addressLine1}
                ${el?.store?.address?.addressLine2}
                ${el?.store?.address?.city}
                ${el?.store?.address?.province}
                ${el?.store?.address?.country}
                ${el?.store?.address?.postalCode}`
            }
        });
        const arrangedStores = [];
        stores?.forEach(s => {
            const index = data.findIndex(item => item?.storeId === s?.storeId);
            if (index === -1) {
                arrangedStores.push(s);
            } else {
                arrangedStores.splice(index, 0, s);
            }
        });
        setData(arrangedStores);
    }, [selectedStores]);

    const handleSave = () => {
        const body = data?.map((el, index) => ({_id: el?.storeId, rank: index + 1}));
        dispatch?.adminProfile?.addRank({body, token});
    };

    return (
        <div className="">
            <div className="w-48 mb-8">
                <div className="mb-2">Search</div>
                <Select
                    className="w-full"
                    placeholder='Search'
                    loading={loading}
                    onChange={(val) => {
                        if (!selectedStores.includes(val)) {
                            setSelectedStores(selectedStores.concat(val))
                        }
                    }}
                >
                    {allStores?.map(s =>
                        <Option
                            key={s?.store?._id}
                            value={s?.store?._id}
                        >
                            {s?.store?.name}
                        </Option>)}
                </Select>
            </div>
            <DraggableTable columns={columns} data={data} onSetData={(data) => setData(data)}/>
            <div className="flex justify-end space-x-2 mt-10">
                <Button
                    type="primary"
                    block
                    className='w-full md:w-32 ml-0 md:ml-5'
                    loading={loading}
                    onClick={handleSave}
                >
                    Save
                </Button>
                <Link
                    href={{pathname: routes.admin.profile.index}}
                >
                    <Button danger className='w-full md:w-32'>Cancel</Button>
                </Link>
            </div>
        </div>
    )
}

export default Arrangement;