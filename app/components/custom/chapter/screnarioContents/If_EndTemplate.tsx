import React from 'react';
import CardCustom from "@/app/components/custom/CardCustom";
import {BlockIfEnd} from "@/app/types/block";

type props = {
  block:BlockIfEnd
  onDelete: () => void
  onCopy: () => void
  isShowAddButton?: boolean
  handleGetIndex?: () => void
  handleMultiCopy?: (type: string) => void
}

function IfEndTemplate({
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
                  title={'If_end'} color={'#CAEB00'}
                  block={block}
                  isShowAddButton={isShowAddButton}
                  handleGetIndex={handleGetIndex}
                  handleMultiCopy={handleMultiCopy}
                  className={'border-2 border-solid border-[#CAEB00] min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px] text-xs h-full'}>
        <div className={'py-3 text-sm'}>
          ----- 条件分岐終了 -----
        </div>
      </CardCustom>
    </div>
  );
}

export default IfEndTemplate;
