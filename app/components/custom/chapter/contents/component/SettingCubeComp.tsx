import React from 'react';
import {Chapter} from "@/app/types/types";

type Props = {
  chapter: Chapter,
  onClick: () => void
}

function SettingCubeComp({chapter, onClick}: Props) {
  return (
    <div>
      <div className="max-w-fit pt-5 flex flex-col justify-items-center">
        <span className={"text-xs pb-2"}>このチャプターの課金</span>
        <div className={'flex items-center gap-2 m-auto'}>
          <img
            src="/icons/content/billingType.svg"
            alt=""
            width={30}
            height={30}
            className="cursor-pointer "
            onClick={onClick}
          />
          <span className={''}>{chapter?.cube || 0}</span>
        </div>
      </div>

    </div>
  );
}

export default SettingCubeComp;
