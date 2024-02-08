import React from 'react';
import CardCustom from "@/app/components/custom/CardCustom";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import {BlockURoidName} from "@/app/types/block";
import {CssTextField} from "@/app/components/custom/CssTextField";
import {useAtomValue} from "jotai";
import {chapterErrorAtom} from "@/app/store/atom/chapterError.atom";
import {Chapter} from "@/app/types/types";

type props = {
  onDelete: () => void
  onCopy: () => void
  block: BlockURoidName
  isShowAddButton?: boolean
  handleGetIndex?: () => void
  handleMultiCopy?: (type: string) => void
  handleChangeField: (e) => void,
  handleCheckField: (e) => void,
  chapter : Chapter
}

function UroidNameTemplate({
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
  const condition = chapterError.uRoidName && !block.data.isUserAction && !block.data.name && chapter?.chapterType === 'createURoid'

  return (
    <div className={'h-full'}>
      <CardCustom isCopy={false} onCopy={onCopy} onDelete={onDelete}
                  block={block}
                  title={'Name'} color={`${condition ? 'red' : '#1976D2'} `}
                  handleMultiCopy={handleMultiCopy}
                  handleGetIndex={handleGetIndex}
                  isShowAddButton={isShowAddButton}
                  className={`border-2 border-solid ${condition ? 'border-red-500' : 'border-[#1976D2]'}  min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px] h-full relative text-white`}>
        <FormControlLabel name={'isUserAction'} control={<Checkbox checked={block.data.isUserAction}
                                                                   onChange={handleCheckField}/>}
                          label="ユーザー入力" className={'text-black'}/>
        <div className={'flex gap-3 my-3'}>
          <CssTextField
            maxRows={5}
            name={'name'}
            InputLabelProps={{shrink: true}}
            id="outlined-basic"
            className={'w-full'}
            multiline={true}
            placeholder={`${block.data.isUserAction ? 'ユーザー入力' : '入力してください。'}`}
            variant="outlined"
            size={'small'}
            value={block.data.name}
            onChange={handleChangeField}
            disabled={block.data.isUserAction}
          ></CssTextField>
        </div>
      </CardCustom>
    </div>
  );
}

export default UroidNameTemplate;
