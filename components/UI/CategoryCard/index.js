import React, {useEffect, useRef, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import './styles.less';
import {useDispatch, useSelector} from "react-redux";
import Loader from "../Loader";
import {message} from "antd";

let isIntersecting = true;
const CategoryCard = ({title, changeHandler, storeId, ...props}) => {
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1)
    const loader = useRef(null);
    const [hasMore, setHasMore] = useState(true);
    const loading = useSelector(state => state.loading.effects.app.getCategories);
    const [active, setActive] = useState(null);
    const dispatch = useDispatch();

    const clickHandler = (id) => {
        setActive(id);
        changeHandler(id)
    }
    const fetchCategories = async () => {
        const response = await dispatch.app.getCategories({storeId, page})
        setCategories(categories => [...categories, ...response.data]);
        setPage(page => page + 1);
        if(response.data.length < 30) {
            setHasMore(false);
        }
    }

    useEffect(async () => {
        if(hasMore || page === 1) {
            try {
                const response = await dispatch.app.getCategories({storeId, page})
                if(response) {
                    if (page !== 1) {
                        setCategories(categories => categories.concat(response.data));
                    } else {
                        setCategories(categories => response.data);
                    }
                    if (response.data.length < 30) {
                        setHasMore(false);
                    }
                }
            } catch(e) {
                setHasMore(false);
                message.error('An Error was occurred while fetching data')
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

    return (
        <div className={'category-card'}>
            <span className={'category-card__header'}>{title}</span>
            {categories.length === 0 && !hasMore && (
                <span className="text-paragraph py-4 block">&mdash; There is no Category</span>
            )}
            {categories.map((cat, index) => {
                const classes = ['category-card__item'];
                if(active === cat._id) classes.push('active')
                return (
                    <span key={`cat-${index}`} className={classes.join(" ")} onClick={clickHandler.bind(this, cat._id)}>{cat.name}</span>
                )
            })}
            <div ref={loader}>
                {hasMore && (<div className="flex items-center justify-center py-6"><Loader/></div>)}
            </div>
        </div>
    )
}

export default CategoryCard;


