import React from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

type HistoryCompProps = {
  date: string,
  author: string,
  onClick?: () => void
}

function HistoryComp({date, author, onClick}: HistoryCompProps) {
  return (
    <div className={'flex flex-col gap-1'} onClick={onClick}>
      <div className={'flex items-center'}>
        <PlayArrowIcon fontSize={'small'} className={'-ml-3'}/>
        <span className={'my-auto pl-3'}>{date}</span>
      </div>
      <div className={'flex items-center'}>
        <div className={'bg-blue-500 rounded-full w-2 h-2 ml-1'}/>
        <span className={'pl-2'}>{author}</span>
      </div>
    </div>
  );
}

export default HistoryComp;
