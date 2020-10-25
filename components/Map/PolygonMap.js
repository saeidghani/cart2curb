import React, { useState } from 'react';
import { GoogleApiWrapper, Map, Marker, Polygon } from "google-maps-react";

import Loading from "./Loading";
import {GOOGLE_MAP_API_KEY} from '../../constants';

const GoogleMap = ({height, google, clickHandler, ...props}) => {
    const [polyPoints, setPolyPoints] = useState([])

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

    const addCoordsHandler = (e, map, position) => {
        const newPosition = {
            lat: position.latLng.lat(),
            lng: position.latLng.lng()
        }
        const newPolyPoints = polyPoints.concat(newPosition);
        clickHandler(newPolyPoints);
        setPolyPoints(newPolyPoints);
    }

    const dragHandler = (index, e, map, position) => {
        const newPosition = {
            lat: position.latLng.lat(),
            lng: position.latLng.lng()
        }
        const newPolyPoints = [...polyPoints];
        newPolyPoints[index] = newPosition;

        clickHandler(newPolyPoints);
        setPolyPoints(newPolyPoints);
    }
    return (
        <Map google={google}
             zoom={16}
             style={style}
             containerStyle={containerStyle}
             onClick={addCoordsHandler}
             {...props}
        >
            {polyPoints.map((point, index) => {
                return (
                    <Marker
                        key={`point-${index}`}
                        name={`point-${index}`}
                        position={point}
                        draggable={true}
                        onDragend={(...e) => dragHandler(index, ...e)}
                        icon={{
                            url: "/images/marker.svg",
                            anchor: new google.maps.Point(32,32),
                            scaledSize: new google.maps.Size(64,64)
                        }}
                    />
                )
            })}
            <Polygon
                paths={polyPoints}
                strokeColor="#FF4B45"
                strokeOpacity={0.9}
                strokeWidth={4}
                fillColor="#FF4B45"
                fillOpacity={0.4}/>
        </Map>
    )
};

export default GoogleApiWrapper({
    apiKey: (GOOGLE_MAP_API_KEY),
    LoadingContainer: Loading
})(GoogleMap)