import React from 'react';
import {Menu, Dropdown, Avatar} from 'antd';
import {MenuOutlined} from '@ant-design/icons';
import Link from 'next/link';

import routes from "../../constants/routes";
//import Avatar from '../UI/Avatar';

const ProfileDropdown = ({name, avatarSrc}) => {
    const _Menu = (
        <Menu className="shadow-lg">
            <Menu.Item
                className='flex items-center'
            >
                <Link href={routes.driver.profile.index}>
                    <div className="cursor-pointer flex items-center space-x-2 w-full py-2"
                         style={{borderBottom: '1px solid #F0F1F6'}}>
                        <Avatar src={avatarSrc}/>
                        <div className="">
                            {name || ''}
                        </div>
                    </div>
                </Link>
            </Menu.Item>
            <Menu.Item
                className='flex items-center w-full py-2'
            >
                <Link href={routes.driver.deliveries.current}>
                    <div className="text-xs">
                        Current Deliveries
                    </div>
                </Link>
            </Menu.Item>
            <Menu.Item
                className='flex items-center w-full py-2'
            >
                <Link href={routes.driver.deliveries.available}>
                    <div className="text-xs">
                        Available Deliveries
                    </div>
                </Link>
            </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown overlay={_Menu} trigger={['click']}>
            <MenuOutlined style={{fontSize: 18, marginRight: 5}}/>
        </Dropdown>
    );
};

export default ProfileDropdown;
