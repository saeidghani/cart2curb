import React, {useEffect, useState} from 'react';
import {Badge, Button, Drawer, Row, Col} from 'antd';
import Link from 'next/link';
import {MenuOutlined} from '@ant-design/icons';
import {useDispatch, useSelector} from 'react-redux';
import {useRouter} from 'next/router';

import {HeaderLogoIcon, HeaderNotificationIcon} from '../icons';
import routes from '../../constants/routes';
import './styles.less';
import {useAuthenticatedUserType, useIsAuthenticated, useIsAuthRoute} from '../../hooks/auth';
import Avatar from '../UI/Avatar';
import userTypes from '../../constants/userTypes';
import MainHeader from './MainHeader';
import AdminHeader from './AdminHeader';

const Header = props => {
  const [visible, setVisible] = useState(false);
  const [avatarImage, setAvatarImage] = useState('');
  const [isVendorPage, setIsVendorPage] = useState(false);
  const [isAdminPage, setIsAdminPage] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const isAuthRoute = useIsAuthRoute();
  const userType = useAuthenticatedUserType();
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const adminIsLoggedIn = useSelector(state => state.adminAuth?.isLoggedIn);
  const adminImage = useSelector(state => state?.adminProfile?.profile?.image);
  const cart = useSelector(state => state.cart.cart);
  const cartChanges = useSelector(state => state.cart.cartChanges);
  const router = useRouter();
  const {pathname} = router;

  useEffect(() => {
    dispatch.cart.getClientCart();
  }, [token, cartChanges]);

  useEffect(() => {
    if (router.route.indexOf('/vendors') === 0) {
      setIsVendorPage(true);
    } else {
      setIsVendorPage(false);
    }
    if (router.route.indexOf('/admin') === 0) {
      setIsAdminPage(true);
    } else {
      setIsAdminPage(false);
    }
  }, [router, userType]);

  return (
    <header className={'header layout__section'}>
      {isAdminPage ? <AdminHeader /> : <MainHeader {...props} />}
    </header>
  );
};

export default Header;