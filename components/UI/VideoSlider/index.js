import React from 'react';
import Slider from "react-slick";

import VideoPlayer from "../VideoPlayer";

const VideoSlider = ({videos, ...props}) => {

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 2,
        slidesToScroll: 2
    };

    return (
        <div className="mb-8" style={{ marginLeft: -12, marginRight: -12}}>
            <Slider {...settings}>
                {videos.map((video, index) => {
                    return (
                        <div className="px-3">
                            <VideoPlayer
                                key={`video-${index}`}
                                src={video.src}
                                poster={video.poster}
                            />
                        </div>
                    )
                })}
            </Slider>
        </div>
    )
}

export default VideoSlider;