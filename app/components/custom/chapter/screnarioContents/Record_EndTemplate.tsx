import React from 'react';
import CardCustom from "@/app/components/custom/CardCustom";
import {BlockRecordEnd} from "@/app/types/block";

type props = {
  block:BlockRecordEnd
  onDelete: () => void
  onCopy: () => void
  isShowAddButton?: boolean
  handleGetIndex?: () => void
  handleMultiCopy?: (type: string) => void
}

function Record_EndTemplate({
                              onDelete,
                              onCopy,
                              isShowAddButton,
                              handleMultiCopy,
                              handleGetIndex,
                              block
                            }: props) {

  return (
    <CardCustom isCopy={false} onCopy={onCopy} onDelete={onDelete}
                block={block}
                title={'レコードエンド'} color={'#CAEB00'}
                isShowAddButton={isShowAddButton}
                handleMultiCopy={handleMultiCopy}
                handleGetIndex={handleGetIndex}
                className={'border-2 border-solid border-[#CAEB00] min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px] h-full'}>
      <div className={'py-5 text-sm'}>
        ----- レコードエンド -----
      </div>
    </CardCustom>
  );
}

export default Record_EndTemplate;
