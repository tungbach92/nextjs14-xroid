import React, {useEffect, useRef, useState} from 'react';
import ReactPlayer from "react-player";

type Props = {
  videoId: string;
  onPlay?: (player: any) => void;
}
const VideoYoutubePlayer = ({ videoId, onPlay }: Props) => {
  const playerRef = useRef<any>(null);

  const handlePlay = () => {
    if(typeof onPlay === 'function') {
      onPlay(playerRef.current);
    }
  }

  return (
    <div>
      {/*@ts-ignore*/}
      <ReactPlayer
        url={`https://www.youtube.com/watch?v=` + videoId}
        ref={playerRef}
        width={'100%'}
        height={315}
        onPlay={handlePlay}
        controls={true}
      />
    </div>
  );
};

export default VideoYoutubePlayer;
