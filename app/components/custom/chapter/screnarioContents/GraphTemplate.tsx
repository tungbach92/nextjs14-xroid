import React from 'react';
import CardCustom from "@/app/components/custom/CardCustom";
import {BlockGraph} from "@/app/types/block";

type props = {
  block?:BlockGraph
  onDelete: () => void
  onCopy: () => void
  is4EneColor: boolean
  isShowAddButton?: boolean
  handleGetIndex?: () => void
  handleMultiCopy?: (type: string) => void
}

function GraphTemplate({
                         onDelete,
                         onCopy,
                         is4EneColor,
                         isShowAddButton,
                         handleGetIndex,
                         handleMultiCopy,
                         block
                       }: props) {
  return (
    <CardCustom isCopy={true} onCopy={onCopy} onDelete={onDelete}
                block={block}
                isShowAddButton={isShowAddButton}
                handleGetIndex={handleGetIndex}
                handleMultiCopy={handleMultiCopy}
                title={'Graph'} color={'#FF4B4B'}
                className={'border-2 border-solid border-[#FF4B4B] min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px] h-full'}>
      <img src={`${is4EneColor ? "/images/EneColor_4.png" : "/images/Enecolor.png"}`} alt={'graph'}
           className={'mt-3 w-16'}/>
    </CardCustom>
  );
}

export default GraphTemplate;
