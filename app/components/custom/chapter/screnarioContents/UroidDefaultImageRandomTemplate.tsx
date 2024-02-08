import React, {useEffect, useState} from 'react';
import CardCustom from "@/app/components/custom/CardCustom";
import TextField from "@mui/material/TextField";
import {useAtomValue,useAtom} from "jotai";
import {BlockURoidDefaultImageRandom, DataUroidDefaultImageRandom} from "@/app/types/block";
import {InputAdornment, OutlinedInput} from "@mui/material";
import useGetImageFolders from "@/app/hooks/useGetImageFolders";
import {imageFoldersAtom} from "@/app/store/atom/folders.atom";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {chapterErrorAtom} from "@/app/store/atom/chapterError.atom";
import {Chapter} from "@/app/types/types";
import {useImageByFolderId} from '@/app/hooks/useImageByFolderId';
import {blocksAtom} from "@/app/store/atom/blocks.atom";
import {cloneDeep, toNumber} from "lodash";

type props = {
  onDelete: () => void
  onCopy: () => void
  block: BlockURoidDefaultImageRandom
  isShowAddButton?: boolean
  handleGetIndex?: () => void
  handleMultiCopy?: (type: string) => void
  handleCheckField: (e) => void
  chapter: Chapter
}

function UroidDefaultImageTemplate({
                                     onCopy,
                                     onDelete,
                                     block,
                                     isShowAddButton,
                                     handleGetIndex,
                                     handleMultiCopy,
                                     chapter
                                   }: props) {
  useGetImageFolders()
  const imageFolders = useAtomValue(imageFoldersAtom)
  const chapterError = useAtomValue(chapterErrorAtom)
  const condition = chapterError.uRoidDefaultImageRandom && !block.data.isUserAction && !block.data.folderId && chapter?.chapterType === 'createURoid'
  const {listImages} = useImageByFolderId(block?.data?.folderId)
  const [value, setValue] = useState<number>(1);
  const [blocks, setBlocks] = useAtom(blocksAtom)
  const [folderId, setFolderId] = useState<string>('')

  useEffect(() => {
    setFolderId(block?.data?.folderId)
  }, [block?.data?.folderId])

  useEffect(() => {
    setValue(block?.data?.count)
  }, [block?.data?.count])
  const handleChangeNumOfImages = (e) => {
    const inputValue = e.target.value.replace(/^0+/, '');
    const _block = cloneDeep(block);
    const data = _block?.data as DataUroidDefaultImageRandom;
    if (inputValue > listImages?.length) {
      data.count = toNumber(listImages?.length || 1);
      _block.data = data;
      setBlocks(blocks.map((item) => item.id === _block.id ? _block : item));
    } else {
      data.count = toNumber(inputValue || 1);
      _block.data = data;
      setBlocks(blocks.map((item) => item.id === _block.id ? _block : item));
    }
  }

  const handleChangeFolder = (e) => {
    const _block = cloneDeep(block);
    const data = _block?.data;
    data.folderId = e.target.value;
    data.count = 1;
    _block.data = data;
    setFolderId(e.target.value);
    setBlocks(blocks.map((item) => item.id === _block.id ? _block : item));
  }

  return (
    <div className={'h-full'}>
      <CardCustom isCopy={false} onCopy={onCopy} onDelete={onDelete}
                  block={block}
                  title={'Random Choose Default Image'} color={`${condition ? 'red' : '#1976D2'}`}
                  handleMultiCopy={handleMultiCopy}
                  handleGetIndex={handleGetIndex}
                  isShowAddButton={isShowAddButton}
                  className={`border-2 border-solid ${condition ? 'border-red-500' : 'border-[#1976D2]'}  min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px] h-full relative text-white`}>
        {/*<FormControlLabel control={<Checkbox checked={block?.data?.isUserAction}*/}
        {/*                                     onChange={handleCheckField}/>}*/}
        {/*                  label="ユーザー選択" className={'2xl:absolute 2xl:top-2 2xl:right-[50px] text-black'}/>*/}
        <div className={'flex flex-col gap-3 my-3'}>
          <FormControl className={'w-[320px]'} size={'small'}>
            <InputLabel id="select-label">フォルダ</InputLabel>
            <Select
              name={'folderId'}
              labelId="select-label"
              id="demo-select"
              value={folderId}
              onChange={handleChangeFolder}
              input={<OutlinedInput label="folder"/>}
            >
              {imageFolders.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField id="outlined-basic"
                     name={'count'}
                     label="表示"
                     onChange={(e) => handleChangeNumOfImages(e)}
                     variant="outlined" size={'small'}
                     value={value || 1}
                     type='number'
                     className={'w-1/3'}
                     InputProps={{
                       inputProps: {min: 1, max: listImages?.length || 1},
                       endAdornment: <InputAdornment position="end">画像</InputAdornment>
                     }}
          />
        </div>
      </CardCustom>
    </div>
  );
}

export default UroidDefaultImageTemplate;
