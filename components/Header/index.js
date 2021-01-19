import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';

import './styles.less';
import {useAuthenticatedUserType} from '../../hooks/auth';
import MainHeader from './MainHeader';
import AdminHeader from './AdminHeader';

const Header = props => {
  const [isAdminPage, setIsAdminPage] = useState(false);
  const userType = useAuthenticatedUserType();
  const router = useRouter();

  useEffect(() => {
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