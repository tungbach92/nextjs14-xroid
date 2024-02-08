import React, {useRef} from 'react';
import ReactPlayer from "react-player";

type Props = {
  videoId: string;
  onPlay?: (player: any) => void;
}
const VideoVimeoPlayer = ({ videoId, onPlay }: Props) => {
  const playerRef = useRef(null);

  const handlePlay = () => {
    if(typeof onPlay === 'function') {
      onPlay(playerRef.current);
    }
  }

  return (
    <div>
      {/*@ts-ignore*/}
      <ReactPlayer
        url={`${videoId}`}
        onPlay={handlePlay}
        width={'100%'}
        height={315}
        ref={playerRef}
        controls={true}
      />
    </div>
  );
};

export default VideoVimeoPlayer;
