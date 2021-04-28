import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import { Menu, message } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';

import './styles.less';
import Loader from "../Loader";

const { SubMenu } = Menu;

// submenu keys of first level
const rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];

let isIntersecting = true;
const CategorySubCategoryCard = ({title, changeHandler, storeId, ...props}) => {
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1)
    const loader = useRef(null);
    const [hasMore, setHasMore] = useState(true);
    const loading = useSelector(state => state.loading.effects.app.getCategories);
    const [openKeys, setOpenKeys] = useState(['sub1']);
    const dispatch = useDispatch();

    const clickHandler = (id) => {
        changeHandler(id)
    }

    useEffect(async () => {
        if (hasMore || page === 1) {
            try {
                const response = await dispatch.app.getCategoryTree({storeId, page})
                if (response) {
                    if (page !== 1) {
                        setCategories(categories => response?.data);
                        //setCategories(categories => categories.concat(response?.data));
                    } else {
                        setCategories(categories => response?.data);
                    }
                    if (response.data.length < 30) {
                        setHasMore(false);
                    }
                }
            } catch (e) {
                setHasMore(false);
            }
        }
        isIntersecting = true;
    }, [page])

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: "20px",
            threshold: 1.0
        };

        const observer = new IntersectionObserver(handleObserver, options);
        if (loader.current) {
            observer.observe(loader.current)
        }

    }, []);


    const handleObserver = (entities) => {
        const target = entities[0];
        if (target.isIntersecting && isIntersecting) {
            isIntersecting = false
            setPage((page) => page + 1)
        }
    }


    const onOpenChange = keys => {
        const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };

    return (
        <div className="category-card">
            {categories.length === 0 && !hasMore && (
                <span className="text-paragraph py-4 block">&mdash; There is no Category</span>
            )}
            <Menu mode="inline" openKeys={openKeys} onOpenChange={onOpenChange} style={{width: '100%', paddingLeft: 0}}>
                {categories?.map((cat, index) =>
                <SubMenu key={cat._id} title={<div style={{borderTop: categories?.length-1 === index ? '1px solid lightGray' : '0', borderBottom: index === 0 ? '1px solid lightGray' : '0'}}>{cat?.name}</div>} style={{paddingLeft: 0}}>
                    {cat?.children?.map((subCat, index) =>
                    <Menu.Item key={subCat._id} style={{paddingLeft: 0}} onClick={clickHandler.bind(this, subCat._id)}><div style={{borderBottom: cat?.children?.length-1 === index ? '0' : '1px solid lightGray', lineHeight: '30px'}} className="">{subCat.name}</div></Menu.Item>
                    )}
                </SubMenu>
                )}
            </Menu>
            <div ref={loader}>
                {hasMore && (<div className="flex items-center justify-center py-6"><Loader/></div>)}
            </div>
        </div>
    )
}

export default CategorySubCategoryCard;


