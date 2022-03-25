import React from 'react';
import { GoogleApiWrapper, Map, Marker } from "google-maps-react";

import Loading from "./Loading";

const GoogleMap = ({height, google, marker, clickHandler, ...props}) => {
    const style = {
        width: '100%',
        height: height || '300px'
    }

    const containerStyle = {
        position: 'relative',
        width: '100%',
        height: height || '300px',
        borderRadius: 5,
        overflow: 'hidden'
    }
    return (
        <Map google={google}
             zoom={16}
             style={style}
             containerStyle={containerStyle}
             onClick={clickHandler}
             {...props}
        >
            <Marker
                {...marker}/>
        </Map>
    )
};

export default GoogleApiWrapper({
    apiKey: (process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY),
    LoadingContainer: Loading
})(GoogleMap)