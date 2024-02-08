import React from 'react';

type Props = {
  icon?: string,
  bottomTitle?: string
  rankTitle?: string | React.ReactNode
  colorTitle?: string | React.ReactNode
  className?: string
}

function HeaderIcon({icon, bottomTitle, rankTitle, colorTitle, className}: Props) {
  return (
    <div className={className}>
      <div className={'flex mx-auto gap-3 justify-center w-full'}>
        <div className={'flex items-center justify-center gap-3'}>
          {rankTitle}
          <img src={icon}
               alt={'enecolor'}
               className={'w-[40px]'}/>
          {colorTitle}
        </div>
      </div>
      <div>
        {bottomTitle &&
          <span className={'my-auto'}>{bottomTitle}</span>
        }
      </div>
    </div>
  );
}

export default HeaderIcon;
