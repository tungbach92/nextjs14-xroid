import React from 'react';
import CardCustom from "@/app/components/custom/CardCustom";
import {BlockTimerEnd} from "@/app/types/block";

type props = {
  block:BlockTimerEnd
  onDelete: () => void
  onCopy: () => void
  isShowAddButton?: boolean
  handleGetIndex?: () => void
  handleMultiCopy?: (type: string) => void
}

function TimerEndTemplate({
                            onCopy,
                            onDelete,
                            isShowAddButton,
                            handleMultiCopy,
                            handleGetIndex,
                            block
                          }: props) {
  return (
    <div className={'min-w-[600px] h-full'}>
      <CardCustom isCopy={false} onCopy={onCopy} onDelete={onDelete}
                  block={block}
                  title={'Timer End'} color={'#ff0000'}
                  isShowAddButton={isShowAddButton}
                  handleGetIndex={handleGetIndex}
                  handleMultiCopy={handleMultiCopy}
                  className={'border-2 border-solid border-[#ff0000] min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px] text-xs h-full'}>
        <div className={'py-3 text-sm'}>
          ----- 引数 -----
        </div>
      </CardCustom>
    </div>
  );
}

export default TimerEndTemplate;
