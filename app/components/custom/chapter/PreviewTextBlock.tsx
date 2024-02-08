import {Button} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {CssTextField} from "@/app/components/custom/CssTextField";
import React, {SetStateAction, useEffect} from "react";
import {DataStructure, DataStructureItem} from "@/app/types/types";
import {BlockText, Enecolor} from "@/app/types/block";
import {useSetAtom} from "jotai";
import {readWriteBlocksAtom} from "@/app/store/atom/blocks.atom";
import {getSelectedStructureItems} from "@/app/common/getSelectedStructureItems";
import {handleChangeDraftText} from "@/app/common/handleChangeDraftText";
import {handlePressBackSpace} from "@/app/common/handlePressBackSpace";
import CardCustom from "@/app/components/custom/CardCustom";

const regexGetVar = /{{([^}]*)}}/g;

interface Props {
  draftText?: string;
  setDraftText?: React.Dispatch<SetStateAction<string>>
  draftChapterStructureItems?: DataStructureItem[]
  setDraftChapterStructureItems?: React.Dispatch<SetStateAction<DataStructureItem[]>>
  draftSelectedStructItemsPrompt?: DataStructureItem[]
  setDraftSelectedStructItemsPrompt?: React.Dispatch<SetStateAction<DataStructureItem[]>>
  structuresInChapter?: DataStructure[]
  draftSelectedEnecolors?: Enecolor[]
  setDraftSelectedEnecolors?: React.Dispatch<SetStateAction<Enecolor[]>>
  block?: BlockText
  type?: string
}

const PreviewTextBlock = ({
                            draftText,
                            setDraftText,
                            draftChapterStructureItems,
                            setDraftChapterStructureItems,
                            draftSelectedStructItemsPrompt,
                            setDraftSelectedStructItemsPrompt,
                            structuresInChapter,
                            draftSelectedEnecolors,
                            setDraftSelectedEnecolors,
                            block,
                            type,
                          }: Props, ref) => {
  const updateBlocks = useSetAtom(readWriteBlocksAtom)

  //set focus on end of preview text
  useEffect(() => {
    if (!ref?.current) return
    ref.current.selectionStart += ref.current.value.length
    ref.current.focus()
  }, [])

  const addSpecialText = () => {
    const inputElement = ref.current;
    if (inputElement) {
      const specialText = '{name}'
      const {selectionStart, selectionEnd} = inputElement;
      const currentValue = inputElement.value;
      inputElement.value = `${currentValue.slice(0, selectionStart)}${specialText}${currentValue.slice(selectionEnd)}`;
      inputElement.selectionStart = selectionStart + specialText.length
      inputElement.selectionEnd = selectionStart + specialText.length
      inputElement.focus();
      setDraftText(inputElement.value)
    }
  }

  const handleSelectStructItem = (event) => {
    const inputValue = event.target.value
    const _selectedStructureItems = getSelectedStructureItems({
      inputValue,
      structuresInChapter
    })
    setDraftChapterStructureItems?.(_selectedStructureItems)
    setDraftSelectedStructItemsPrompt?.(_selectedStructureItems)
  }

  const onChangeDraftText = (event) => {
    handleChangeDraftText({event, setDraftText, draftText})
    handleSelectStructItem(event)
  }

  const onPressBackSpace = (event) => {
    handlePressBackSpace({
      structuresInChapter,
      event,
      setDraftText,
      draftText,
      draftChapterStructureItems,
      setDraftChapterStructureItems,
      draftSelectedStructItemsPrompt,
      setDraftSelectedStructItemsPrompt,
      draftSelectedEnecolors,
      setDraftSelectedEnecolors,
    })
  }

  return (
    <div className={'mx-auto'}>
      <CardCustom
        title={'text'}
        color={'#74AA9C'}
        className={`border-2 border-solid border-[#74AA9C] min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px] w-full`}
        isDataStruct={true}
        isClose={false}
      >
        <div className={'flex items-start gap-2'}>
          <Button variant="contained"
                  size={'small'}
                  onClick={addSpecialText}
                  startIcon={<AddIcon/>}
          >ユーザー名</Button>
        </div>

        <div className={'py-4 text-xs flex flex-col'}>
          <CssTextField
            inputRef={ref}
            InputLabelProps={{shrink: true}}
            id="outlined-basic"
            label="出力テキスト"
            multiline={true}
            variant="outlined"
            size={'small'}
            className={'pb-2'}
            value={draftText}
            onChange={onChangeDraftText}
            onKeyDown={onPressBackSpace}
          />
        </div>
      </CardCustom>
    </div>
  )
}
export default React.forwardRef(PreviewTextBlock)
