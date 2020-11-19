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

export function isPointInside(point, vs) {
    let x = point[0], y = point[1];

    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        let xi = vs[i][0], yi = vs[i][1];
        let xj = vs[j][0], yj = vs[j][1];

        let intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};