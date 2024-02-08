import React from 'react';
import {twMerge} from "tailwind-merge";

type props = {
  voice?: string
  className?: string
  onClick?: () => void
}

function BubbleVoice({
                       // voice = '気楽',
                       voice,
                       className,
                       onClick
                     }: props) {
  return (
    <div
      className={twMerge(
        `group flex gap-6 flex-wrap items-center justify-center border-solid border-2 rounded-xl
             border-gray-300 max-w-fit min-w-[70px] h-[33px] p-2 bg-light-gray relative cursor-pointer hover:scale-105 m-auto ${className ? ` ${className}` : ''}`,
      )}
      onClick={onClick}
    >
      <div className={'m-auto text-xs truncate'}>
        {voice}
      </div>
      <div
        className={twMerge(
          `absolute rotate-45 bottom-[10%] left-[-7%] border-l-0 border-b-0 border-r-[12px] border-r-transparent border-t-[12px] border-t-light-gray border-solid`,
        )}
      >
      </div>
    </div>
  );
}

export default BubbleVoice;
