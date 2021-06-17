import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Menu} from 'antd';

import Loader from "../Loader";

const {SubMenu} = Menu;

// submenu keys of first level
const rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];

let isIntersecting = true;
const CategorySubCategoryCard = ({title, changeHandler, storeId, ...props}) => {
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1)
    const loader = useRef(null);
    const [hasMore, setHasMore] = useState(true);
    const loading = useSelector(state => state.loading.effects.app.getCategories);
    const [openKeys, setOpenKeys] = useState([]);
    const dispatch = useDispatch();

    const clickHandler = (id) => {
        changeHandler(id)
    }

    useEffect(async () => {
        if (hasMore || page === 1) {
            try {
                const response = await dispatch?.app?.getCategoryTree({storeId, page})
                if (response) {
                    if (page !== 1) {
                        const newCats = [...categories];
                        response?.data?.forEach(c => {
                            if (!categories?.include(c?._id)) {
                                newCats.push(c);
                            }
                        });
                        setCategories(categories => newCats);
                    } else {
                        setCategories(categories => response?.data);
                    }
                    if (response?.data?.length < 30) {
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
            {categories?.length === 0 && !hasMore && (
                <span className="text-paragraph py-4 block">&mdash; There is no Category</span>
            )}
            {categories?.length !== 0 &&
            <Menu mode="inline"
                  openKeys={openKeys}
                  onOpenChange={onOpenChange}
                  style={{
                      width: '100%', paddingLeft: 0, backgroundColor: '#fafafa', borderRadius: '20px',
                      paddingTop: '20px',
                      paddingBottom: '10px'
                  }}
            >
                <div style={{color: 'black'}} className="ml-6 mt-2 mb-4 font-bold cursor-pointer"
                     onClick={clickHandler.bind(this, 'all')}>Show All
                </div>
                {categories?.map((cat, index) =>
                    cat?.children?.length === 0 ?
                        <Menu.Item key={cat?._id} style={{paddingLeft: 0, backgroundColor: '#fafafa', margin: 0}}
                                   onClick={clickHandler.bind(this, cat?._id)}>
                            <div style={{
                                width: '90%',
                            }} className="">
                                {cat?.name}
                            </div>
                        </Menu.Item> : <SubMenu
                            key={cat?._id}
                            title={<div style={{
                                color: 'black',
                            }}
                                        onClick={clickHandler.bind(this, cat?._id)}
                            >
                                {cat?.name}
                            </div>} style={{paddingLeft: 0}}>
                            {cat?.children?.map((subCat, index) =>
                                <Menu.Item key={subCat?._id} style={{paddingLeft: 0, backgroundColor: '#fafafa', margin: 0}}
                                           onClick={clickHandler.bind(this, subCat?._id)}>
                                    <div style={{
                                        width: '90%',
                                        //borderBottom: cat?.children && cat?.children?.length - 1 === index ? '0' : '1px solid lightGray',
                                        //lineHeight: cat?.children && cat?.children?.length - 1 === index ? '32px' : '35px',
                                    }} className="">
                                        {subCat?.name}
                                    </div>
                                </Menu.Item>
                            )}
                        </SubMenu>
                )}
            </Menu>
            }
            <div ref={loader}>
                {hasMore && (<div className="flex items-center justify-center py-6"><Loader/></div>)}
            </div>
        </div>
    )
}

export default CategorySubCategoryCard;
//

