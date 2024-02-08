import React from 'react';
import CardCustom from "@/app/components/custom/CardCustom";
import {BlockForEnd} from "@/app/types/block";

type props = {
  block:BlockForEnd
  onDelete: () => void
  onCopy: () => void
  isShowAddButton?: boolean
  handleGetIndex?: () => void
  handleMultiCopy?: (type: string) => void
}

function ForEndTemplate({
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
                  title={'For_end'} color={'#CAEB00'}
                  isShowAddButton={isShowAddButton}
                  handleGetIndex={handleGetIndex}
                  handleMultiCopy={handleMultiCopy}
                  className={'border-2 border-solid border-[#CAEB00] min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px] h-full'}>
        <div className={'py-6 text-sm'}>
          ----- 条件分岐終了 -----
        </div>
      </CardCustom>
    </div>
  );
}

export default ForEndTemplate;
