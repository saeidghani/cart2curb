import React from 'react';
import { Breadcrumb } from "antd";

import './styles.scss';
import Header from '../Header';
import Footer from '../Footer';

const Layout = props => {
    const classes = ["flex-grow flex flex-col justify-start"]
    if(!props.forceLayout) {
        classes.push('layout__section')
    }
    return (
        <div className={'layout'}>
            <Header avatar={props.avatar}/>
            <div className={classes.join(" ")}>
                {props.children}
            </div>
            <Footer/>
        </div>
    )
}

export default Layout;