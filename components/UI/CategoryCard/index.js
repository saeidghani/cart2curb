import React, {useState} from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import './styles.scss';
import {useDispatch, useSelector} from "react-redux";
import Loader from "../Loader";

const CategoryCard = ({title, changeHandler, storeId, ...props}) => {
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1)
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
        setCategories([...categories, ...response.data]);
        setPage(page + 1);
        if(response.data.length < 30) {
            setHasMore(false);
        }
    }
    return (
        <div className={'category-card'}>
            <InfiniteScroll
                pageStart={0}
                loadMore={fetchCategories}
                hasMore={hasMore}
                initialLoad={false}
                loader={<div className="flex items-center justify-center py-6"><Loader/></div>}
            >
                <span className={'category-card__header'}>{title}</span>
                {categories.length === 0 && !loading && (
                    <span className="text-paragraph py-4 block">&mdash; There is no Category</span>
                )}
                {categories.map((cat, index) => {
                    const classes = ['category-card__item'];
                    if(active === cat._id) classes.push('active')
                    return (
                        <span key={`cat-${index}`} className={classes.join(" ")} onClick={clickHandler.bind(this, cat._id)}>{cat.name}</span>
                    )
                })}
            </InfiniteScroll>
        </div>
    )
}

export default CategoryCard;


