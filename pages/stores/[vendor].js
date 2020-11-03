import React, {useEffect, useRef, useState} from 'react';
import {Row, Col, Form, Button, Input, Select, message} from 'antd';
import Page from "../../components/Page";
import routes from "../../constants/routes";
import {getStore} from "../../states";
import CategoryCard from "../../components/UI/CategoryCard";
import StoreProductCard from "../../components/UI/StoreProductCard";
import ShopOverview from "../../components/UI/ShopOverview";
import moment from "moment";
import {useDispatch, useSelector} from "react-redux";
import InfiniteScroll from "react-infinite-scroller";
import Loader from "../../components/UI/Loader";
import {InfoCircleOutlined} from "@ant-design/icons";

const { Item } = Form;
const { Option } = Select;

const VendorPage = props => {
    const [form] = Form.useForm();
    const loader = useRef(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loading = useSelector(state => state.loading.effects.app.getProducts);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(false);
    const dispatch = useDispatch();

    const breadcrumb = [
        {
            title: 'Vendors',
            href: routes.stores.index,
        },
        {
            title: 'Vendor Details',
        }
    ]

    const { vendor } = props;


    useEffect(async () => {
        if(hasMore) {
            const formFields = form.getFieldsValue()
            const body = {
                storeId: vendor._id,
                pageNumber: page,
            }
            if(selectedCategory) {
                body.category = selectedCategory;
            }
            if(formFields.search) {
                body.search = formFields.search;
            }
            if(formFields.storeType) {
                body.storeType = formFields.storeType;
            }
            try {
                const response = await dispatch.app.getProducts(body)
                if(page !== 1) {
                    setProducts(products.concat(response.data));
                } else {
                    setProducts(response.data);
                }
                if(response.data.length < 15) {
                    setHasMore(false);
                }
            } catch(e) {
                console.log(e);
            }
        }
    }, [page, hasMore, selectedCategory])


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
        if (target.isIntersecting) {
            setPage((page) => page + 1)
        }
    }


    const selectCategoryHandler = (catId) => {
        setProducts([]);
        setSelectedCategory(catId);
        setHasMore(true);
        setPage(1);
    }

    const searchHandler = (values) => {
        setProducts([]);
        setHasMore(true);
        setPage(1);
    }

    return (
        <Page title={'Vendor Details Page'} breadcrumb={breadcrumb}>
            <Row gutter={[24, 24]}>
                <Col xs={24} md={8} lg={6}>
                    <img src={vendor.image || ''} alt={'shop name'} className={'rounded-sm w-full'}/>
                </Col>
                <Col xs={24} md={16} lg={18} className={'flex flex-col'}>
                    <h1 className={'text-type text-2xl mb-2 mt-0'}>{vendor.name}</h1>
                    <span className="text-type mb-4 text-sm">{moment(vendor.openingTime).format('HH:mm A')} &mdash; {moment(vendor.closingTime).format('HH:mm A')}</span>
                    <span className="text-overline md:mb-12 mb-8 text-sm capitalize">{vendor.storeType}</span>
                    <p className="mb-8 mt-0 text-muted text-xs">{vendor.description}</p>
                </Col>
            </Row>

            <div className={'pt-16 pb-15 without-padding'}>
                <Row className={'bg-card flex items-center pt-12 pb-6 layout__section'}>
                    <Col xs={24}>
                        <Form form={form} layout={'vertical'} onFinish={searchHandler}>
                            <Row gutter={24} className={'flex flex-col lg:flex-row justify-center lg:items-center'}>
                                <Col xs={24} lg={8}>
                                    <Item name={'search'} label={'Search'}>
                                        <Input placeholder={'Product name'}/>
                                    </Item>
                                </Col>
                                <Col xs={24} lg={8}>
                                    <Item name={'storeType'} label={'Type of Service'}>
                                        <Select placeholder={'Service Type'}>
                                            <Option value={'service'} disabled={true}>Service</Option>
                                            <Option value={'product'}>Product</Option>
                                        </Select>
                                    </Item>
                                </Col>
                                <Col xs={24} lg={3} style={{ flexBasis: 125}}>
                                    <Item>
                                        <Button type={'primary'} className={'w-full lg:w-32 mt-7.5'} htmlType={'submit'}>Search</Button>
                                    </Item>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </div>
            <Row gutter={24}>
                <Col xs={24}>
                    <h2 className="text-2xl text-type font-medium mt-0 mb-11">Results</h2>
                </Col>
                <Col xs={24} md={8} lg={6}>
                    <div className="mb-8 md:mb-0">
                        <CategoryCard title={'Subcategories'} storeId={vendor._id} changeHandler={selectCategoryHandler}/>
                    </div>
                </Col>
                <Col xs={24} md={16} lg={18}>
                    <Row gutter={[24, 42]}>

                        {products.length === 0 && !loading && (
                            <Col xs={24} className={'flex flex-col items-center justify-center py-8'}>
                                <InfoCircleOutlined className={'text-paragraph mb-6 text-4xl'} />
                                <span className="text-paragraph mb-4">There is no Products.</span>

                            </Col>
                        )}
                        {products.map(p => {
                            return (
                                <Col xs={24} md={12} lg={8} key={p.id}>
                                    <StoreProductCard
                                        imageURL={p.images ? p.images : '/images/temp/shop-item.png'}
                                        price={p.priceList.price || ""}
                                        name={p.name}
                                        vendor={vendor.name}
                                        vendorId={vendor._id}
                                        productId={p._id}
                                    />
                                </Col>
                            )
                        })}
                        <div className="flex w-full items-center justify-center py-6" ref={loader}>
                            {hasMore && (<Loader/>)}
                        </div>
                    </Row>
                </Col>
            </Row>
        </Page>
    )
}


export async function getServerSideProps({ req, res, params }) {
    const store = getStore()

    let vendor = {};

    try {
        const response = await store.dispatch.app.getStore(params.vendor)

        if(!response) {
            res.writeHead(307, { Location: routes.stores.index });
            res.end();
            return {
                props: {
                    vendor
                }
            };
        }

        vendor = response;
    } catch(e) {

        res.writeHead(307, { Location: routes.homepage });
        res.end();
        return {
            props: {
                vendor
            }
        };
    }
    return {
        props: {
            vendor
        },
    }
}

export default VendorPage;