import canada from 'canada';
import { useMemo } from 'react';

export const useCities = (province) => {
    const cities = canada.cities;

    return useMemo(() => {
        if(province) {
            return Array.from(cities).filter(city => {
                return city[1] === province
            })
        }
        return [];
    }, [province, cities])
}

export const useProvinces = () => {
    const provinces = canada.provinces;

    return useMemo(() => {
        return provinces
    }, [provinces])
}