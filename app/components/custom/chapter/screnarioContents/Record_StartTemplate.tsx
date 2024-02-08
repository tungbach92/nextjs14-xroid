import React from 'react';
import CardCustom from "@/app/components/custom/CardCustom";
import {BlockRecordStart} from "@/app/types/block";

type props = {
  block:BlockRecordStart
  onDelete: () => void
  onCopy: () => void
  isShowAddButton?: boolean
  handleGetIndex?: () => void
  handleMultiCopy?: (type: string) => void
}

function RecordStartTemplate({
                               onCopy,
                               onDelete,
                               isShowAddButton,
                               handleMultiCopy,
                               handleGetIndex,
                               block
                             }: props) {
  return (
    <CardCustom isCopy={false} onCopy={onCopy} onDelete={onDelete}
                block={block}
                title={'レコードスタート'} color={'#CAEB00'}
                isShowAddButton={isShowAddButton}
                handleGetIndex={handleGetIndex}
                handleMultiCopy={handleMultiCopy}
                className={'border-2 border-solid border-[#CAEB00] min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px] h-full'}>
      <div className={'py-5 text-sm'}>
        ----- レコードスタート -----
      </div>
    </CardCustom>
  );
}

export default RecordStartTemplate;
