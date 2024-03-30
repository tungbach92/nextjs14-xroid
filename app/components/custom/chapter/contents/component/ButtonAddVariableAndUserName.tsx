import React from 'react';
import {Button} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {cloneDeep} from "lodash";
import {useSetAtom} from "jotai";
import {readWriteBlocksAtom} from "@/app/store/atom/blocks.atom";
import {
  BlockPrompt,
  BlockText,
  BlockUroidCharPromptFooter,
  BlockUroidCharPromptHeader,
  BlockURoidDescription, Enecolor,
  GroupStruct,
  GroupTextV2
} from "@/app/types/block";
import {
  ENECOLOR_RANK_IMG_V2, ENECOLOR_RANK_TEXT, ENECOLOR_RANK_TEXT_V2,
  INPUT_ENECOLOR_IMAGE, INPUT_ENECOLOR_TEXT,
  PROMPT_TYPES,
  TEXT_V2,
  UROID_CHARPROMPT_FOOTER,
  UROID_CHARPROMPT_HEADER,
  UROID_DES
} from "@/app/configs/constants";
import {DataStructure, DataStructureItem} from "@/app/types/types";
import {useAtom} from "jotai";
import {typeOfNewEnecolorBlockAtom} from "@/app/store/atom/typeOfNewEnecolorBlock.atom";

type Props = {
  inputRef: React.MutableRefObject<HTMLInputElement> | null
  block: BlockText | BlockUroidCharPromptHeader | BlockUroidCharPromptFooter | BlockURoidDescription
  structuresInChapter: DataStructure[]
  setChapterStructItems: (items: DataStructureItem[]) => void
  setDraftText: (text: string) => void
  setOpenDialogStructDetail: (open: boolean) => void
  type?: string
  disabled?: boolean
  selectedGroupsStruct: GroupStruct[]
  selectedGroupsText: GroupTextV2[]
  focusInput?: string
  setFocusInput?: React.Dispatch<React.SetStateAction<string>>
  setDummyOutputText?: React.Dispatch<React.SetStateAction<{
    characterPrompt1: string
    adminPrompt1: string
    userInput: string
    adminPrompt2: string
    characterPrompt2: string
  }>>
  setIsOnchangePrompt1?: React.Dispatch<React.SetStateAction<boolean>>
  setIsOnchangePrompt2?: React.Dispatch<React.SetStateAction<boolean>>
  selectedEnecolors?: Enecolor[]
  setDraftEnecolors?: React.Dispatch<React.SetStateAction<Enecolor[]>>
}

function ButtonAddVariableAndUserName({
                                        inputRef, block,
                                        setDraftText,
                                        setOpenDialogStructDetail,
                                        type,
                                        disabled = false,
                                        focusInput,
                                        setDummyOutputText,
                                        setIsOnchangePrompt1,
                                        setIsOnchangePrompt2,
                                        selectedEnecolors,
                                        setDraftEnecolors
                                      }: Props) {
  const updateBlocks = useSetAtom(readWriteBlocksAtom)
  const [, setNewEnecolorBlockType] = useAtom(typeOfNewEnecolorBlockAtom)
  const addSpecialText = () => {
    if (focusInput === 'characterPrompt1') setIsOnchangePrompt1(true);
    if (focusInput === 'characterPrompt2') setIsOnchangePrompt2(true);
    const inputElement = inputRef.current;
    if (inputElement) {
      const specialText = '{name}'
      const {selectionStart, selectionEnd} = inputElement;
      const currentValue = inputElement.value;
      inputElement.value = `${currentValue.slice(0, selectionStart)}${specialText}${currentValue.slice(selectionEnd)}`;

      if (type === TEXT_V2) {
        const _block = cloneDeep(block) as BlockText
        _block.data.message.japanese = inputElement.value
        _block.data.message.english = inputElement.value
        updateBlocks(_block)
      }
      if (type === UROID_DES) {
        const _block = cloneDeep(block) as BlockURoidDescription
        _block.data.description = inputElement.value
        updateBlocks(_block)
      }
      if (type === UROID_CHARPROMPT_HEADER || type === UROID_CHARPROMPT_FOOTER) {
        const _block = cloneDeep(block) as BlockUroidCharPromptHeader | BlockUroidCharPromptFooter
        _block.data.characterPrompt = inputElement.value
        updateBlocks(_block)
      }
      if (PROMPT_TYPES.includes(type)) {
        if (!focusInput)
          return;
        const _block = cloneDeep(block) as BlockPrompt
        _block.data[focusInput] = inputElement.value
        updateBlocks(_block)
        setDummyOutputText?.(prev => ({...prev, [focusInput]: inputElement.value}))
      }

      setTimeout(() => {
        inputElement.selectionStart = selectionStart + specialText.length
        inputElement.selectionEnd = selectionEnd + specialText.length
        inputElement.focus();
      })
    }
  }

  const handleOpenDialogStructDetail = () => {
    // const _selectedStructureItemIds = selectedGroupsStruct?.map(x => x.dataStructId)?.concat(selectedGroupsText?.map(x => x.dataStructId))
    // const _selectedStructureItems = structuresInChapter?.map(x => x.items)?.flat()?.filter(y => _selectedStructureItemIds.includes(y.id))
    // setChapterStructItems(_selectedStructureItems)
    // setDraftChapterStructureItems(_selectedStructureItems)
    if (focusInput === 'characterPrompt1') setIsOnchangePrompt1(true);
    if (focusInput === 'characterPrompt2') setIsOnchangePrompt2(true);
    if (type === TEXT_V2) {
      const _block = cloneDeep(block) as BlockText
      setDraftText(_block?.data?.message?.japanese)
    }
    if (type === UROID_DES) {
      const _block = cloneDeep(block) as BlockURoidDescription
      setDraftText(_block?.data?.description)
    }
    if (type === UROID_CHARPROMPT_HEADER || type === UROID_CHARPROMPT_FOOTER) {
      const _block = cloneDeep(block) as BlockUroidCharPromptHeader | BlockUroidCharPromptFooter
      setDraftText(_block?.data?.characterPrompt)
    }
    if (PROMPT_TYPES.includes(type)) {
      const _block = cloneDeep(block) as BlockPrompt
      setDraftText(_block.data[focusInput])
    }
    if (block.type === INPUT_ENECOLOR_IMAGE) {
      setNewEnecolorBlockType(INPUT_ENECOLOR_IMAGE)
    }
    if (block.type === ENECOLOR_RANK_IMG_V2) {
      setNewEnecolorBlockType(ENECOLOR_RANK_IMG_V2)
    }
    if (block.type === INPUT_ENECOLOR_TEXT || block.type === ENECOLOR_RANK_TEXT_V2) {
      setDraftEnecolors?.(selectedEnecolors || [])
    }
    setOpenDialogStructDetail(true)
  }

  const getText = () => {
    let text = '変数'
    if (block.type === INPUT_ENECOLOR_IMAGE || block.type === ENECOLOR_RANK_IMG_V2) {
      text = 'エネカラー画像'
    }
    return text
  }

  return (
    <div className={'flex gap-2'}>
      <Button
        disabled={disabled}
        onClick={handleOpenDialogStructDetail}
        className={'h-8 text-sx min-w-max'}
        size={'small'}
        startIcon={<AddIcon/>}
        variant={'contained'}>{getText()}</Button>
      {(block.type !== INPUT_ENECOLOR_IMAGE && block.type !== ENECOLOR_RANK_IMG_V2) &&
        <Button
          disabled={disabled}
          onClick={addSpecialText}
          className={'h-8 text-sx min-w-max'}
          size={'small'}
          startIcon={<AddIcon/>}
          variant="contained">ユーザー名</Button>
      }
    </div>
  );
}

export default ButtonAddVariableAndUserName;
