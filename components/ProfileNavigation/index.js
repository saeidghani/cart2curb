import React from 'react';

import {CreditCartNavIcon, LocationIcon, ProfileIcon, ShoppingCartBagIcon} from '../icons';
import NavigationItem from "./Item";
import routes from "../../constants/routes";

const ProfileNavigation = props => {

    return (
        <div className="bg-card rounded py-4 px-8">
            <NavigationItem icon={ProfileIcon} title={'Account'} href={routes.profile.index}/>
            <NavigationItem icon={LocationIcon} title={'Addresses'} href={routes.profile.addresses.index}/>
            <NavigationItem icon={ShoppingCartBagIcon} title={'Orders'} href={routes.profile.orders}/>
            <NavigationItem icon={CreditCartNavIcon} title={'Payment Info'} href={routes.profile.payments.index}/>
        </div>
    )
}

export default ProfileNavigation;