import React, {Fragment, useEffect, useMemo} from 'react';
import {Table, Modal, Button, Col} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import Link from "next/link";
import routes from "../../constants/routes";

const CheckAddressModal = ({visible, onHide, address}) => {

    useEffect(() => {
        if (visible) {
        }
    }, []);

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: data => (<span className="text-cell">{data}</span>),
            width: 60
        },
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
            render: data => (<span className="text-cell">{data}</span>)
        },
        {
            title: 'Store',
            dataIndex: 'store',
            key: 'store',
            render: data => (<span className="text-cell">{data}</span>)
        },
        {
            title: '',
            dataIndex: 'accepted',
            key: 'accepted',
            render: data => (<span className="text-cell">{data ? '' : <div className='flex items-center'>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M15.0644 7.31494C15.0644 7.21182 14.98 7.12744 14.8769 7.12744L13.33 7.13447L11.0003 9.91182L8.67299 7.13682L7.12378 7.12979C7.02065 7.12979 6.93628 7.21182 6.93628 7.31729C6.93628 7.36182 6.95269 7.404 6.98081 7.43916L10.03 11.072L6.98081 14.7024C6.95249 14.7368 6.93678 14.7798 6.93628 14.8243C6.93628 14.9274 7.02065 15.0118 7.12378 15.0118L8.67299 15.0048L11.0003 12.2274L13.3277 15.0024L14.8745 15.0095C14.9777 15.0095 15.062 14.9274 15.062 14.822C15.062 14.7774 15.0456 14.7353 15.0175 14.7001L11.973 11.0696L15.0222 7.43682C15.0503 7.404 15.0644 7.35947 15.0644 7.31494Z"
                        fill="#FF4B45"/>
                    <path
                        d="M11 0.523438C5.20156 0.523438 0.5 5.225 0.5 11.0234C0.5 16.8219 5.20156 21.5234 11 21.5234C16.7984 21.5234 21.5 16.8219 21.5 11.0234C21.5 5.225 16.7984 0.523438 11 0.523438ZM11 19.7422C6.18594 19.7422 2.28125 15.8375 2.28125 11.0234C2.28125 6.20938 6.18594 2.30469 11 2.30469C15.8141 2.30469 19.7188 6.20938 19.7188 11.0234C19.7188 15.8375 15.8141 19.7422 11 19.7422Z"
                        fill="#FF4B45"/>
                </svg>
                <div className='ml-2'>They are out of range</div>
            </div>}</span>)
        },
    ];

    const data = useMemo(() => {
        return (address || [])?.map((i, index) => {
            
            // product: i?._id -> product: i?.name , store: i?.store -> store: i?.storeName Sepand
            return {
                key: i?._id,
                index: index + 1,
                product: i?.name,
                store: i?.storeName,
                accepted: i?.accepted,
            }
        })
    }, [address]);

    return (
        <Modal
            title=''
            visible={visible}
            onCancel={onHide}
            centered
            width={730}
            footer={null}
        >
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                className={'pt-4 mt-4'}
            />
            <div className="flex items-center mt-5.5">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M11 0.5C5.20156 0.5 0.5 5.20156 0.5 11C0.5 16.7984 5.20156 21.5 11 21.5C16.7984 21.5 21.5 16.7984 21.5 11C21.5 5.20156 16.7984 0.5 11 0.5ZM11 19.7188C6.18594 19.7188 2.28125 15.8141 2.28125 11C2.28125 6.18594 6.18594 2.28125 11 2.28125C15.8141 2.28125 19.7188 6.18594 19.7188 11C19.7188 15.8141 15.8141 19.7188 11 19.7188Z"
                        fill="#595959"/>
                    <path
                        d="M9.875 6.875C9.875 7.17337 9.99353 7.45952 10.2045 7.6705C10.4155 7.88147 10.7016 8 11 8C11.2984 8 11.5845 7.88147 11.7955 7.6705C12.0065 7.45952 12.125 7.17337 12.125 6.875C12.125 6.57663 12.0065 6.29048 11.7955 6.0795C11.5845 5.86853 11.2984 5.75 11 5.75C10.7016 5.75 10.4155 5.86853 10.2045 6.0795C9.99353 6.29048 9.875 6.57663 9.875 6.875ZM11.5625 9.5H10.4375C10.3344 9.5 10.25 9.58437 10.25 9.6875V16.0625C10.25 16.1656 10.3344 16.25 10.4375 16.25H11.5625C11.6656 16.25 11.75 16.1656 11.75 16.0625V9.6875C11.75 9.58437 11.6656 9.5 11.5625 9.5Z"
                        fill="#595959"/>
                </svg>
                <div className="ml-2">Unavailable items will be removed from your cart</div>
            </div>
            <div className="flex justify-end items-center mt-5.5" onClick={onHide}>
                <Button danger className={'w-32 mr-5'}>
                    Cancel
                </Button>
                <Button type='primary' className={'w-32'} onClick={onHide}>
                    OK
                </Button>
            </div>
        </Modal>
    )
}

export default CheckAddressModal;
