import React from 'react';
import { Player, BigPlayButton } from 'video-react';


const VideoPlayer = props => {
    return (
        <div>
            <Player
                playsInline
                poster={props.poster}
                src={props.src}
                height={340}
            >
                <BigPlayButton position="center" />
            </Player>
        </div>
    );
};

export default VideoPlayer;