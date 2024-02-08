import React from 'react';
import CardCustom from "@/app/components/custom/CardCustom";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import {BlockURoidDefaultVoice} from "@/app/types/block";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import {OutlinedInput} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import {OptionSpeaker} from "@/app/configs/constants";
import {useAtomValue} from "jotai";
import {chapterErrorAtom} from "@/app/store/atom/chapterError.atom";
import {Chapter} from "@/app/types/types";

type props = {
  onDelete: () => void
  onCopy: () => void
  block: BlockURoidDefaultVoice
  isShowAddButton?: boolean
  handleGetIndex?: () => void
  handleMultiCopy?: (type: string) => void
  handleChangeField: (e) => void,
  handleCheckField: (e) => void
  chapter: Chapter
}

function UroidDefaultVoiceTemplate({
  onCopy,
  onDelete,
  block,
  isShowAddButton,
  handleGetIndex,
  handleMultiCopy,
  handleChangeField,
  handleCheckField,
  chapter
}: props) {
  const chapterError = useAtomValue(chapterErrorAtom)
  const condition = chapterError.uRoidDefaultVoice && !block.data.isUserAction && !block.data.voiceName && chapter?.chapterType === 'createURoid'

  return (
    <div className={'h-full'}>
      <CardCustom isCopy={false} onCopy={onCopy} onDelete={onDelete}
                  block={block}
                  title={'Default Voice'}
                  color={`${condition ? 'red' : '#1976D2'}`}
                  handleMultiCopy={handleMultiCopy}
                  handleGetIndex={handleGetIndex}
                  isShowAddButton={isShowAddButton}
                  className={`border-2 border-solid ${condition ? 'border-red-500' : 'border-[#1976D2]'} min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px] h-full relative text-white`}>
        <FormControlLabel name={'isUserAction'} control={<Checkbox checked={block.data.isUserAction}
                                                                   onChange={handleCheckField}/>}
                          label="ユーザー選択" className={'text-black'}/>
        <div className={'flex gap-3 my-3'}>
          <FormControl className={'w-full 2xl:w-1/2'} size={'small'}>
            <InputLabel id="select-label">ヴォイス</InputLabel>
            <Select
              labelId="select-label"
              id="demo-select"
              name={'voiceName'}
              value={block?.data?.voiceName}
              onChange={handleChangeField}
              input={<OutlinedInput label="voice"/>}
              disabled={block?.data?.isUserAction}
            >
              {OptionSpeaker.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </CardCustom>
    </div>
  );
}

export default UroidDefaultVoiceTemplate;
