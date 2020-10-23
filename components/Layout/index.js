import React from 'react';
import { Breadcrumb } from "antd";

import './styles.scss';
import Header from '../Header';
import Footer from '../Footer';

const Layout = props => {
    return (
        <div className={'layout'}>
            <Header/>
            <div className="flex-grow layout__section flex flex-col justify-start">
                {props.children}
            </div>
            <Footer/>
        </div>
    )
}

export default Layout;