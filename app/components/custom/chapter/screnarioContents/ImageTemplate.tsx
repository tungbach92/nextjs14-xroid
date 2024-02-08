import React, {useEffect, useState} from 'react';
import CardCustom from "@/app/components/custom/CardCustom";
import {readWriteBlocksAtom} from "@/app/store/atom/blocks.atom";
import {BlockImage} from "@/app/types/block";
import {useSetAtom} from "jotai";
import {CssTextField} from "@/app/components/custom/CssTextField";
import {cloneDeep} from "lodash";
import {InputAdornment} from "@mui/material";
import {convertInputNumber} from "@/app/common/convertNumber";
import {regexDecimal} from "@/app/configs/constants";

type ImageProps = {
  onDelete: () => void
  onCopy: () => void
  isShowAddButton?: boolean
  handleGetIndex?: () => void
  handleMultiCopy?: (type: string) => void
  block: BlockImage
}

function ImageTemplate({
  onCopy,
  onDelete,
  isShowAddButton,
  handleGetIndex,
  handleMultiCopy,
  block
}: ImageProps) {
  const updateBlocks = useSetAtom(readWriteBlocksAtom)
  const [delay, setDelay] = useState<string>('0')

  useEffect(() => {
    setDelay(convertInputNumber(block.data.delay))
  }, [block?.data?.delay])

  const handleChangeDelay = (e) => {
    if (!regexDecimal.test(e.target.value)) return
    if (!e.target.value)
      return setDelay('0')
    setDelay(e.target.value)
    const _block = cloneDeep(block)
    _block.data.delay = Number(e.target.value)
    updateBlocks(_block)
  }
  return (
    <CardCustom isCopy={true}
                handleGetIndex={handleGetIndex}
                onCopy={onCopy}
                block={block}
                onDelete={onDelete}
                title={'Image'} color={'#3AD1FF'}
                isShowAddButton={isShowAddButton}
                handleMultiCopy={handleMultiCopy}
                className={'border-2 border-solid border-[#3AD1FF] min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px] w-full'}>
      <img src={block?.data?.url} alt={'image'} className={'mt-3 w-36 h-36 object-contain'}/>
      <div className={'-mt-[14%] mb-5  ml-[73%]'}>
        <div className={'flex items-center gap-2'}>
          <CssTextField
            label={'表示時間'}
            InputProps={{
              inputProps: {
                inputMode: "numeric",
                pattern: '[0-9]*[.,]?[0-9]*',
              },
              endAdornment: <InputAdornment position="end">秒</InputAdornment>
            }}
            size={'small'} value={delay ?? '0'}
            onChange={handleChangeDelay}/>
        </div>
      </div>
    </CardCustom>
  );
}

export default ImageTemplate;
