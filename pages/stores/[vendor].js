import React, {useEffect, useRef, useState} from 'react';
import {Row, Col, Form, Button, Input, Select} from 'antd';
import Page from "../../components/Page";
import routes from "../../constants/routes";
import {getStore} from "../../states";
import CategoryCard from "../../components/UI/CategoryCard";
import StoreProductCard from "../../components/UI/StoreProductCard";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../../components/UI/Loader";
import {InfoCircleOutlined, ShopOutlined} from "@ant-design/icons";

const { Item } = Form;
const { Option } = Select;

let isIntersecting = true;
const VendorPage = props => {
    const [form] = Form.useForm();
    const loader = useRef(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loading = useSelector(state => state.loading.effects.app.getProducts);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(false);
    const dispatch = useDispatch();
    const [hasError, setHasError] = useState(false);
    const [imageStore, setImageStore] = useState('');
    const [search, setSearch] = useState('');
    const [type, setType] = useState('');

    const changeToPlaceholder = (source) => {
        setHasError(true);
        return true;
    }

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

    useEffect(() => {
        setImageStore(vendor.image);
    }, [vendor])

    useEffect(async () => {
        if(hasMore || page === 1) {
            const formFields = form.getFieldsValue()
            const body = {
                storeId: vendor._id,
                pageNumber: page,
            }
            if(selectedCategory && selectedCategory !== 'all') {
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
                    setProducts(products => products.concat(response.data));
                } else {
                    setProducts(products => response.data);
                }
                if(response.data.length < 15) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
            } catch(e) {
                console.log(e);
            }
        }
        isIntersecting = true;
    }, [page, selectedCategory, search, type])


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


    const selectCategoryHandler = (catId) => {
        if(catId !== selectedCategory) {
            isIntersecting = false;
            setProducts([]);
            setHasMore(true);
            setSelectedCategory(catId);
            setPage(1)
        }
    }

    const searchHandler = (values) => {
        isIntersecting = false;
        setProducts([]);
        setHasMore(true);
        setSearch(values.search);
        setType(values.storeType);
        setPage(1);
    }

    const address = [vendor.address.addressLine1];
    if(vendor.address.addressLine2) {
        address.push(vendor.address.addressLine2);
    }
    address.push(vendor.address.city);
    address.push(vendor.address.province);
    address.push(vendor.address.country);

    return (
        <Page title={'Vendor Details Page'} breadcrumb={breadcrumb}>
            <Row gutter={[24, 24]}>
                <Col xs={24} md={8} lg={6}>

                    {hasError ? (
                        <div className="bg-card flex items-center justify-center text-4xl text-gray h-full" style={{ minHeight: 384, objectFit: 'cover', width: '100%', borderRadius: 2 }}>
                            <ShopOutlined />
                        </div>
                    ) : (
                        <img src={imageStore} alt={'shop name'} className={'rounded-sm w-full'} onErrorCapture={changeToPlaceholder}/>
                    )}
                </Col>
                <Col xs={24} md={16} lg={18} className={'flex flex-col'}>
                    <h1 className={'text-type text-2xl mb-2 mt-0'}>{vendor.name}</h1>
                    <span className="text-type mb-4 text-sm">{address.join(", ")}</span>
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

                        {products.length === 0 && !hasMore && (
                            <Col xs={24} className={'flex flex-col items-center justify-center py-8'}>
                                <InfoCircleOutlined className={'text-paragraph mb-6 text-4xl'} />
                                <span className="text-paragraph mb-4">There is no Products.</span>

                            </Col>
                        )}
                        {products.map(p => {
                            return (
                                <Col xs={24} md={12} lg={8} key={p._id}>
                                    <StoreProductCard
                                        imageURL={p.images}
                                        price={p.priceList.price || ""}
                                        name={p.name}
                                        vendor={vendor.name}
                                        vendorId={vendor._id}
                                        productId={p._id}
                                    />
                                </Col>
                            )
                        })}
                        {hasMore && (<div className="flex w-full items-center justify-center py-6" ref={loader}>
                            <Loader/>
                        </div>)}
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