import React, { useState } from 'react';
import { GoogleApiWrapper, Map, Marker, Polygon } from "google-maps-react";
import { Button } from 'antd';
import {RedoOutlined} from '@ant-design/icons';

import Loading from "./Loading";
import salesman from '../../lib/salesman';

const GoogleMap = ({height, google, clickHandler, area, marker, ...props}) => {
    const [polyPoints, setPolyPoints] = useState(area || []);
    console.log({area});
    console.log({marker});
    console.log({initial: props.initialCenter});

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
        const newPoints = [...polyPoints.map(point => new salesman.Point(point.lat, point.lng)), new salesman.Point(newPosition.lat, newPosition.lng)];
        const solution  = salesman.solve(newPoints);
        const newPolyPoint = solution.map(i => ({
            lat: newPoints[i].x,
            lng: newPoints[i].y
        }));

        clickHandler(newPolyPoint);
        setPolyPoints(newPolyPoint);
    }

    const removePointHandler = (index) => {
        const newPolyPoints = polyPoints.filter((item, _i) => _i !== index);
        clickHandler(newPolyPoints);
        setPolyPoints(newPolyPoints);
    }

    const dragHandler = (index, e, map, position) => {
        const newPosition = {
            lat: position.latLng.lat(),
            lng: position.latLng.lng()
        }

        const newPoints = [...polyPoints.filter((item, _i) => _i !== index).map(point => new salesman.Point(point.lat, point.lng)), new salesman.Point(newPosition.lat, newPosition.lng)];
        const solution  = salesman.solve(newPoints);
        const newPolyPoints = solution.map(i => ({
            lat: newPoints[i].x,
            lng: newPoints[i].y
        }));

        clickHandler(newPolyPoints);
        setPolyPoints(newPolyPoints);
    }

    const resetHandler = () => {
        setPolyPoints([]);
        clickHandler([]);
    }
    return (
        <div className={'flex relative'}>
        <Map google={google}
             zoom={16}
             style={style}
             containerStyle={containerStyle}
             onClick={addCoordsHandler}
             {...props}
        >

            {marker && (
                <Marker
                    {...marker}/>
            )}

            {area.map((point, index) => {
                return (
                    <Marker
                        key={`point-${index}`}
                        name={`point-${index}`}
                        position={point}
                        onClick={removePointHandler.bind(this, index)}
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
                paths={area}
                strokeColor="#FF4B45"
                strokeOpacity={0.9}
                strokeWidth={4}
                fillColor="#FF4B45"
                fillOpacity={0.4}/>
        </Map>

        <Button
            shape="circle"
            icon={<RedoOutlined />}
            className={'flex items-center justify-center absolute border-0'}
            style={{ top: 20, left: 20,}}
            onClick={resetHandler}
        />
        </div>
    )
};

export default GoogleApiWrapper({
    apiKey: (process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY),
    LoadingContainer: Loading
})(GoogleMap)