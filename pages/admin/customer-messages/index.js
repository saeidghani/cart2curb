import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from "react-redux";

import Page from "../../../components/Page";
import Loader from "../../../components/UI/Loader";
import AdminAuth from "../../../components/Admin/AdminAuth";
import {message} from "antd";

let isIntersecting = true;
const CustomerMesseges = props => {
    const loader = useRef(null);
    const dispatch = useDispatch();
    const token = useSelector(state => state?.adminAuth?.token);
    const [messages, setMessages] = useState({});
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect( () => {
        if (hasMore || page === 1) {
            let query = {
                page_number: page,
                page_size: 15,
            }
            if (token) {
                (async () => {
                    setLoadingMessages(true);
                    try {
                        const res = await dispatch?.adminProfile?.getCustomerMessages({query, token});
                        if (res.data.length < 15) {
                            setHasMore(false);
                        }
                        setMessages(res);
                        setLoadingMessages(false);
                    } catch (err) {
                        setHasMore(false);
                        setLoadingMessages(false);
                        message.error('An Error was occurred while fetching data');
                    };
                })();
            }
        }
        isIntersecting = true;
    }, [page, token]);

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

    if (loadingMessages) return (
        <div className="flex items-center justify-center py-10">
            <Loader/>
        </div>
    );

    return (
        <AdminAuth>
            <Page title={false} headTitle={'Customers Messenger'} breadcrumb={[{title: 'Admin > Customers Messenger'}]}>
                <h2 className="font-normal text-2xl mt-8 mb-14">Customers Messages</h2>
                {messages?.data?.map(msg =>
                    <div className="mb-20">
                        <div className="flex justify-between items-center mb-7">
                            <div className="flex items-center w-4/12">
                                <div className="mr-7 text-sm font-normal">Name</div>
                                <div className="font-bold text-base">{msg?.name}</div>
                            </div>
                            <div className="flex items-center w-4/12">
                                <div className="mr-7 text-sm font-normal">Phone Number</div>
                                <div className="font-bold text-base">{msg?.phone}</div>
                            </div>
                            <div className="flex items-center w-4/12">
                                <div className="mr-7 text-sm font-normal">Subject</div>
                                <div className="font-bold text-base">{msg?.subject}</div>
                            </div>
                        </div>
                        <div className="text-sm font-normal mb-3">Message</div>
                        <div className="w-full p-3.5 bg-card">
                            Hi,
                            <br></br>
                            {msg?.message}
                        </div>
                    </div>
                )}
            </Page>
        </AdminAuth>
    )
}

export default CustomerMesseges;
