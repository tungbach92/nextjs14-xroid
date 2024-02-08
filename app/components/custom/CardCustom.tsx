import * as React from 'react';
import {ReactNode, useMemo} from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {BaseDeleteModal} from "@/app/components/base";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import {cloneDeep, isFunction} from "lodash";
import ClearIcon from "@mui/icons-material/Clear";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import {useAtomValue, useSetAtom} from "jotai";
import {blocksAtom, readWriteBlocksAtom} from "@/app/store/atom/blocks.atom";
import {InputAdornment} from '@mui/material';
import {Block, BlockPrompt} from "@/app/types/block";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import {twMerge} from "tailwind-merge";
import {isFocusNewBlocks} from "@/app/store/atom/isFocusNewBlocks";
import {selectedBlocksAddAtIndexAtom} from "@/app/store/atom/selectedBlocksAddAtIndex.atom";
import {CssTextField} from "@/app/components/custom/CssTextField";

type props = {
  onDelete?: () => void
  children?: ReactNode
  onCopy?: () => void
  isCopy?: boolean
  className?: string
  title?: string | ReactNode
  color?: string
  isClose?: boolean
  isShowAddButton?: boolean
  handleGetIndex?: () => void
  handleMultiCopy?: (type: string) => void
  block?: Block
  autoPlay?: boolean
  onChangePlayVideo?: (event: any) => void
  isPlay?: boolean
  isDelay?: boolean
  isDataStruct?: boolean
  isPrompt?: boolean
  isShowLogCheckBox?: boolean
  handleChangeDelay?: (event: any) => void
  delayValue?: number | string
}

function CardCustom({
  onDelete,
  children,
  onCopy,
  isCopy = false,
  className = '',
  title = '',
  color = '',
  isClose = true,
  autoPlay = false,
  handleGetIndex,
  handleMultiCopy,
  onChangePlayVideo,
  block,
  isPlay = false,
  isDelay = false,
  isDataStruct = false,
  isPrompt = false,
  isShowLogCheckBox = false,
  handleChangeDelay = () => {
  },
  delayValue = '1'
}: props) {
  const [isDelete, setIsDelete] = React.useState(false)
  const [isHover, setIsHover] = React.useState(false)
  const isFocus = useAtomValue(isFocusNewBlocks)
  const addNewBlocks = useAtomValue(selectedBlocksAddAtIndexAtom)

  const blocks = useAtomValue(blocksAtom);

  const blockIndex = blocks?.findIndex(item => item?.id === block?.id);

  const isCheckBlockNew = useMemo(() => {
    if (addNewBlocks?.length && isFocus) {
      let _addNewBlocks = addNewBlocks.find((item: Block) => item?.id === block?.id);
      return !!_addNewBlocks;
    }
    return false;
  }, [addNewBlocks, isFocus]);

  const promptData = useMemo(() => {
    if (!isPrompt) return null
    const _block = cloneDeep(block) as BlockPrompt
    return _block.data
  }, [block])

  const updateBlocks = useSetAtom(readWriteBlocksAtom)


  const onChangeShowLog = (event, type: string) => {
    if (type === 'isShowLog') {
      const _block = cloneDeep(block)
      _block[type] = event.target.checked
      updateBlocks(_block)
    }
    if (type === 'isNotShowForUser' && promptData) {
      const _block = cloneDeep(block) as BlockPrompt
      _block.data[type] = event.target.checked
      updateBlocks(_block)
    }
    if (type === 'isNotShowForUser' && !promptData) {
      const _block = cloneDeep(block)
      _block[type] = event.target.checked
      updateBlocks(_block)
    }
  }

  return (
    <div className="flex">
      <div className="">
        {title && (
          <Paper variant={'outlined'}
                 className={`w-[100px] rounded-md !rounded-tr-none !rounded-br-none border-r-0 text-right rou mb-1`}
                 style={{backgroundColor: color}}>
            <div className={'p-1 pr-1 flex text-[14px] capitalize text-white'}>
              <div className="border-r-white border-solid pr-1 border-0 border-r-[1px]">
                <div className={'flex items-center justify-center h-full'}>
                  {blockIndex + 1}
                </div>
              </div>
              <div className='pl-1 flex-1 text-center wrap-anywhere'>{title}</div>
            </div>
          </Paper>
        )}
      </div>
      <div
        className={twMerge(`p-2 rounded-md rounded-tl-none relative group ${className} ${(isFocus && isCheckBlockNew) ? 'rounded-md bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 p-1 !border-0' : ''}`)}
        onMouseEnter={() => {
          setIsHover(true)
          if (isFunction(handleGetIndex))
            handleGetIndex()
        }}
        onMouseLeave={() => {
          setIsHover(false)
        }}
      >
        {/*{*/}
        {/*  isHover && index == 0 && isShowAddButton &&*/}
        {/*  <Button className={'absolute right-1/2 top-0 transform translate-x-1/2 -translate-y-1/2 z-50'}*/}
        {/*          variant={'contained'}*/}
        {/*          size={'small'}*/}
        {/*          onClick={() => handleMultiCopy('top')}*/}
        {/*  ><AddIcon/></Button>*/}
        {/*}*/}
        <div className={'bg-white p-2'}>
          <BaseDeleteModal isOpen={isDelete} handleClose={() => setIsDelete(false)}
                           label={`このブロックを削除しますか？`}
                           handleDelete={onDelete}/>
          <div className={'2xl:flex gap-5 items-center'}>

            {block && block.type !== 'promptInput' && (block.type !== 'promptAnswer' && isShowLogCheckBox) &&
              <FormControlLabel control={<Checkbox checked={block?.isShowLog ?? false}
                                                   onChange={(event) => onChangeShowLog(event, 'isShowLog')}/>}
                                label={<Typography className={''}>ログに表示</Typography>}
              />}
            {isPrompt &&
              <FormControlLabel control={<Checkbox checked={promptData?.isNotShowForUser || false}
                                                   onChange={(event) => onChangeShowLog(event, 'isNotShowForUser')}/>}
                                label={<Typography className={''}>ユーザーに表示しない</Typography>}
              />}
          </div>
          {
            autoPlay &&
            <div className={'absolute top-0 right-10'}>
              <span className={'text-xs'}>AutoPlay</span>
              <Checkbox
                checked={isPlay}
                onChange={(event) => onChangePlayVideo(event)}/>
            </div>
          }
          {
            isClose &&
            <div className={'absolute top-0 right-0 opacity-0 transition-300 group-hover:opacity-100'}>
              <IconButton
                className={'w-[30px] h-[30px] cursor-pointer'}
                onClick={() => setIsDelete(true)}
              >
                <ClearIcon/>
              </IconButton>
            </div>
          }

          {
            isCopy &&
            <div className={'absolute bottom-0 right-1 -mb-[6px]'}>
              <ContentCopyIcon className={'w-4 cursor-pointer'} onClick={onCopy}/>
            </div>
          }
          {children}
          {
            isHover && !isDataStruct &&
            <Button className={'absolute right-1/2 -bottom-[30px] transform translate-x-1/2 -translate-y-1/2'}
                    style={{zIndex: 10}}
                    variant={'contained'}
                    size={'small'}
                    onClick={() => handleMultiCopy('bottom')}
            ><AddIcon/></Button>
          }
          {
            isDelay &&
            <div className={'flex flex-wrap items-center gap-2'}>
              <CssTextField
                label={'表示時間'}
                InputProps={{
                  inputProps: {
                    inputMode: "numeric",
                    pattern: '[0-9]*[.,]?[0-9]*',
                  },
                  endAdornment: <InputAdornment position="end">秒</InputAdornment>
                }}
                size={'small'}
                className={'w-1/3  ml-auto'}
                value={delayValue ?? '1'}
                onChange={handleChangeDelay}
              />
              {/*<TextField id="outlined-basic"*/}
              {/*           label="遅れ"*/}
              {/*           onChange={(e)=>handleChangeDelay(e)}*/}
              {/*           variant="outlined" size={'small'}*/}
              {/*           value={convertInputNumber(delayValue || 1)}*/}
              {/*           type='number'*/}
              {/*           className={'w-1/3 my-4'}*/}
              {/*           InputProps={{*/}
              {/*             inputProps: {min: 1},*/}
              {/*             endAdornment: <InputAdornment position="end">秒</InputAdornment>*/}
              {/*           }}*/}
              {/*/>*/}
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default CardCustom;
