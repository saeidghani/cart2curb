import React, {useState, useEffect} from 'react';
import {Form, Row, Col, Input, Button, message, Upload} from 'antd';
import {useRouter} from "next/router";
import Link from "next/link";
import {useDispatch, useSelector} from "react-redux";
import {CloudUploadOutlined, UserOutlined} from '@ant-design/icons';

import routes from "../../../constants/routes";
import ShopOverview from '../../UI/ShopOverview';

const Arrangement = props => {
  const [parentCategories, setParentCategories] = useState([])
  const dispatch = useDispatch();
  const loading = useSelector(state => state.loading.effects.adminStore.addCategory);
  const token = useSelector(state => state?.adminAuth?.token);
  const allStores = useSelector(state => state?.adminStore?.stores?.data);
  const router = useRouter();
  const {categoryId, storeId, storeType} = router.query;

  useEffect(() => {
    if (token) {
      dispatch?.adminStore?.getStores('');
    }
  }, [token]);

  return (
      <div className="grid grid-cols-3 gap-x-2">
        <div className="bg-gray-500">
          <span className="">Search</span>
          <Input/>
          {allStores?.map(s => <div>{s?.store?.name}</div>)}
        </div>
        <div className="col-start-2 col-span-2 grid grid-cols-4 gap-x-2">{allStores?.map(s =>
          <ShopOverview
              name={s?.store?.name}
              title={s?.store?.name}
              imageURL={s?.store?.image}
              service={s?.store?.storeType}
              subType={s?.store?.subType}
          />)}</div>
      </div>
  )
}

export default Arrangement;