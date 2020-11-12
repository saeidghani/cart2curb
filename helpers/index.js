import routes from "../constants/routes";

export const isAuthRoute = (route) => {
    const authRoutes = getRoutesList(routes.auth);
    const vendorAuthRoutes = getRoutesList(routes.vendors.auth);
    if(authRoutes.includes(route)) {
        return {
            value: true,
            type: 'customer',
        }
    } else if(vendorAuthRoutes.includes(route)) {
        return {
            value: true,
            type: 'vendor',
        }
    } else {
        return {
            value: false,
            type: '',
        }
    }
}

export const getRoutesList = (section) => {
    let result = [];
    Object.values(section).map(route => {
        if(typeof route === 'string') {
            result.push(route);
        } else {
            let insideRoutes = getRoutesList(route);
            result.push(...insideRoutes);
        }
    })

    return result;
}

export const getProperty = (object, key, placeholder = null, converter = false) => {
    if(object) {
        if(object.hasOwnProperty(key)) {
            return converter ? converter(object[key]) : object[key]
        }
        return placeholder
    }

    return placeholder;
}

export const convertAddress = (address) => {
    const result = [address.addressLine1];
    if(address.addressLine2) {
        result.push(address.addressLine2);
    }
    result.push(address.city);
    result.push(address.province);
    result.push(address.country);
    return result.join(", ");
}