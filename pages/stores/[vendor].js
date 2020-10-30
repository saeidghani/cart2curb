import React, {useEffect, useState} from 'react';
import { Row, Col, Form, Button, Input, Select } from 'antd';
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
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loading = useSelector(state => state.loading.effects.app.getProducts);
    const [products, setProducts] = useState([]);
    const [productsMetaData, setProductsMetaData] = useState({
        pagination: {
            totalRecords: 1000
        }
    })
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


    const fetchProducts = async () => {
        const body = {
            storeId: vendor._id,
            pageNumber: page,
        }
        if(selectedCategory) {
            body.category = selectedCategory;
        }
        try {
            const response = await dispatch.app.getProducts(body)
            setProducts(products.concat(response.data));
            setProductsMetaData(response.metaData);
            setPage(page + 1);
            if(response.data.length < 30) {
                setHasMore(false);
            }
        } catch(e) {
            setProductsMetaData({
                pagination: {
                    totalRecords: 0
                }
            })
        }
    }

    const selectCategoryHandler = (catId) => {
        setPage(1);
        setSelectedCategory(catId);
        setProducts([]);
        setProductsMetaData({
            pagination: {
                totalRecords: 1000
            }
        })
        fetchProducts()
    }

    return (
        <Page title={'Vendor Details Page'} breadcrumb={breadcrumb}>
            <Row gutter={[24, 24]}>
                <Col xs={24} md={8} lg={6}>
                    <img src={'/images/temp/shop-item.png'} alt={'shop name'} className={'rounded-sm w-full'}/>
                </Col>
                <Col xs={24} md={16} lg={18} className={'flex flex-col'}>
                    <h1 className={'text-type text-2xl mb-2 mt-0'}>{vendor.name}</h1>
                    <span className="text-type mb-4 text-sm">{moment(vendor.openingTime).format('HH:mm A')} &mdash; {moment(vendor.closingTime).format('HH:mm A')}</span>
                    <span className="text-overline md:mb-12 mb-8 text-sm">{vendor.storeType}</span>
                    <p className="mb-8 mt-0 text-muted text-xs">{vendor.description}</p>
                </Col>
            </Row>

            <div className={'pt-16 pb-15 without-padding'}>
                <Row className={'bg-card flex items-center pt-12 pb-6 layout__section'}>
                    <Col xs={24}>
                        <Form form={form} layout={'vertical'}>
                            <Row gutter={24} className={'flex flex-col lg:flex-row justify-center lg:items-center'}>
                                <Col xs={24} lg={8}>
                                    <Item name={'search'} label={'Search'}>
                                        <Input placeholder={'Enter City, Street, ...'}/>
                                    </Item>
                                </Col>
                                <Col xs={24} lg={8}>
                                    <Item name={'service'} label={'Type of Service'}>
                                        <Select placeholder={'Service Type'}>
                                            <Option value={'type 1'}>Type 1</Option>
                                            <Option value={'type 2'}>Type 2</Option>
                                            <Option value={'type 3'}>Type 3</Option>
                                            <Option value={'type 4'}>Type 4</Option>
                                        </Select>
                                    </Item>
                                </Col>
                                <Col xs={24} lg={3} style={{ flexBasis: 125}}>
                                    <Item>
                                        <Button type={'primary'} className={'w-full lg:w-32 mt-7.5'}>Search</Button>
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
                        <CategoryCard title={'Sub Categories'} storeId={vendor._id} changeHandler={selectCategoryHandler}/>
                    </div>
                </Col>
                <Col xs={24} md={16} lg={18}>
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={fetchProducts}
                            hasMore={hasMore}
                            initialLoad={false}
                            loader={<div className="flex w-full items-center justify-center py-6"><Loader/></div>}
                        >
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
                            </Row>
                        </InfiniteScroll>
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