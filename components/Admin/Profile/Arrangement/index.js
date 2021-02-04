import React, {useState, useEffect} from 'react';
import {Button, Select} from 'antd';
import {useRouter} from "next/router";
import Link from "next/link";
import {useDispatch, useSelector} from "react-redux";

import routes from "../../../../constants/routes";
import {convertAddress} from "../../../../helpers";
import DraggableTable from './DraggableTable';

const {Option} = Select;

const Arrangement = props => {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.loading.effects.adminStore.getStores);
    const token = useSelector(state => state?.adminAuth?.token);
    const allStores = useSelector(state => state?.adminStore?.stores?.data);
    const router = useRouter();
    const [rankedStores, setRankedStores] = useState([]);
    const [selectedStores, setSelectedStores] = useState([]);
    const [data, setData] = useState([]);

    useEffect(async() => {
        if (token) {
            dispatch?.adminStore?.getStores('');
            try {
                const res = await dispatch?.adminStore?.getStoresRank('');
                setRankedStores(res?.data);
            } catch (err) {};
        }
    }, [token]);

    useEffect(() => {
        const prevRankedStores = rankedStores?.map((s, index) => ({
            key: index,
            storeId: s?.store?._id,
            vendorId: s?.vendor?._id,
            storeType: s?.store?.storeType,
            number: '???',
            CXName: s?.vendor?.contactName,
            store: s?.store?.name,
            img: s?.store?.image,
            address: convertAddress(s?.store?.address)
        }));
        const prevRankedStoreIds = prevRankedStores?.map(s => s?.storeId);
        setSelectedStores(prevRankedStoreIds);
    }, [rankedStores]);

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
                address: convertAddress(el?.store?.address)
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

    const handleSave = () => {
        const body = data?.map((el, index) => ({_id: el?.storeId, rank: index + 1}));
        console.log(body);
        dispatch?.adminProfile?.addRank({body, token});
    };

    return (
        <div className="">
            <div className="w-48 mb-8">
                <div className="mb-2">Search</div>
                <Select
                    showSearch
                    className="w-full"
                    placeholder='Search'
                    loading={loading}
                    onChange={(val) => {
                        if (!selectedStores.includes(val)) {
                            setSelectedStores(selectedStores.concat(val.split('+')[1]));
                        }
                    }}
                >
                    {allStores?.map(s =>
                        <Option
                            key={s?.store?._id}
                            value={`${s?.store?.name}+${s?.store?._id}`}
                        >
                            <div className="flex space-x-2">
                                <img src={s?.store?.image} className="w-10" alt=""/>
                                <span>{s?.store?.name}</span>
                            </div>
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