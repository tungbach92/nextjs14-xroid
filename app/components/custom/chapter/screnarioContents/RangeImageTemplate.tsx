import React, {useMemo} from 'react';
import CardCustom from "@/app/components/custom/CardCustom";
import {EXIT_IMAGE, START_IMAGE} from "@/app/configs/constants";
import {useAtomValue, useSetAtom} from "jotai";
import {blocksAtom, readWriteBlocksAtom} from "@/app/store/atom/blocks.atom";
import {BlockEndImg, BlockStartImg} from "@/app/types/block";
import {CssTextField} from "@/app/components/custom/CssTextField";
import {cloneDeep} from "lodash";
import {convertInputNumber} from "@/app/common/convertNumber";
import {InputAdornment} from "@mui/material";

type Props = {
  onDelete: () => void
  type: string
  onCopy: () => void
  isShowAddButton?: boolean
  handleGetIndex?: () => void
  handleMultiCopy?: (type: string) => void
  block: BlockStartImg | BlockEndImg
  index: number
}

function RangeImageTemplate({
  index,
  type,
  onCopy,
  onDelete,
  isShowAddButton,
  handleGetIndex,
  handleMultiCopy,
  block
}: Props) {
  const blocks = useAtomValue(blocksAtom)
  const updateBlocks = useSetAtom(readWriteBlocksAtom)

  const isDelay = useMemo(() => {
    let isDelay = false
    if (!blocks && blocks?.length === 0) return
    for (let i = index; i < blocks.length; i++) {
      if (blocks[i].type === EXIT_IMAGE) break
      blocks[i]?.type === 'image' && (isDelay = true)
      blocks[i]?.type === 'show_slide' && (isDelay = true)
    }
    return isDelay
  }, [blocks, index])


  const handleChangeSeconds = (e) => {
    const _block = cloneDeep(block)
    _block.data.seconds = e.target.value
    updateBlocks(_block)
  }
  const handleChangeDelay = (e) => {
    const value = e.target.value
    const _block = cloneDeep(block) as BlockStartImg
    _block.data.delay = value
    updateBlocks(_block)
  }

  const delayData = useMemo(() => {
    if (!isDelay) return null
    const _block = cloneDeep(block) as BlockStartImg
    return _block.data
  }, [block])

  return (
    <CardCustom isCopy={false}
                isShowAddButton={isShowAddButton}
                handleGetIndex={handleGetIndex}
                handleMultiCopy={handleMultiCopy}
                onCopy={onCopy}
                delayValue={delayData?.delay}
                handleChangeDelay={handleChangeDelay}
                onDelete={onDelete}
                title={type === EXIT_IMAGE ? 'Exit Image' : 'Start Image'}
                color={'red'}
                className={'border-2 border-solid border-red-500 min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px] w-full pb-8 h-full'}
                isDelay={isDelay}
                block={block}
    >
      {type === START_IMAGE &&
        <div className={'mt-2'}>
          <span>画像連続した場合の表示時間:</span>
          <div className={'flex items-center gap-2 mt-1'}>
            <CssTextField size={'small'} type={'number'}
                          value={convertInputNumber(block?.data?.seconds)}
                          className={'w-1/4'}
                          onChange={handleChangeSeconds}
                          InputProps={{
                            inputProps: {min: 0},
                            endAdornment: <InputAdornment position="end">秒</InputAdornment>
                          }}
            />
          </div>
        </div>}
    </CardCustom>
  );
}

export default RangeImageTemplate;
