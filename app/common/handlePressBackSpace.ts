import {getListVarIndex} from "@/app/common/getListVarIndex";
import {cloneDeep} from "lodash";
import {getFieldPath} from "@/app/common/getStructParentId";
import React from "react";
import {DataStructure, DataStructureItem} from "@/app/types/types";
import {BlockText, BlockUroidCharPromptFooter, BlockUroidCharPromptHeader, Enecolor} from "@/app/types/block";

interface Props {
  event: any
  draftText: string
  setDraftText: React.Dispatch<React.SetStateAction<string>>
  draftChapterStructureItems?: DataStructureItem[]
  setDraftChapterStructureItems?: React.Dispatch<React.SetStateAction<DataStructureItem[]>>
  draftSelectedStructItemsPrompt?: DataStructureItem[]
  setDraftSelectedStructItemsPrompt?: React.Dispatch<React.SetStateAction<DataStructureItem[]>>
  structuresInChapter?: DataStructure[]
  draftSelectedEnecolors?: Enecolor[]
  setDraftSelectedEnecolors?: React.Dispatch<React.SetStateAction<Enecolor[]>>
  updateBlockFieldOnBackSpace?: (_block: BlockText | BlockUroidCharPromptHeader | BlockUroidCharPromptFooter, x: {
    startIndex: number,
    endIndex: number,
    value: string
  }, _selectedStructureItems: DataStructureItem[]) => void
  _block?: BlockText | BlockUroidCharPromptFooter | BlockUroidCharPromptHeader
}

export const handlePressBackSpace = ({
                                       event,
                                       draftText,
                                       setDraftText,
                                       draftChapterStructureItems,
                                       setDraftChapterStructureItems,
                                       draftSelectedStructItemsPrompt,
                                       setDraftSelectedStructItemsPrompt,
                                       structuresInChapter,
                                       updateBlockFieldOnBackSpace,
                                       draftSelectedEnecolors,
                                       setDraftSelectedEnecolors,
                                       _block,
                                     }: Props) => {
  const inputElement = event.target;
  const cursorPosition = inputElement.selectionEnd;
  const indices = getListVarIndex(draftText)
  // Xóa value trong text nếu currPos nằm trong list indices
  indices.forEach(x => {
    if ((cursorPosition <= x.endIndex + 1 && cursorPosition >= x.startIndex + 1) && event.key === 'Backspace') {
      // prevent backspace onChange
      event.preventDefault()
      const _draftText = draftText.slice(0, x.startIndex) + draftText.slice(x.endIndex + 1)
      setDraftText(_draftText)
      // remove selected structure item not in draftText
      let _selectedStructureItems = cloneDeep(draftChapterStructureItems)
      let _selectedStructureItemsPrompt = cloneDeep(draftSelectedStructItemsPrompt)
      if (draftChapterStructureItems?.some(x => !_draftText.includes(`{{${getFieldPath(structuresInChapter, x.id)}}}`))) {
        _selectedStructureItems = draftChapterStructureItems?.filter(x => _draftText.includes(`{{${getFieldPath(structuresInChapter, x.id)}}}`))
        _selectedStructureItemsPrompt = draftSelectedStructItemsPrompt?.filter(x => _draftText.includes(`{{${getFieldPath(structuresInChapter, x.id)}}}`))
      }
      if (draftSelectedEnecolors?.some(x => !_draftText.includes(x.groupsText.userInput))) {
        setDraftSelectedEnecolors?.(draftSelectedEnecolors?.filter(x => _draftText.includes(`${x.groupsText.userInput}`)))
      }
      setDraftChapterStructureItems?.(_selectedStructureItems)
      setDraftSelectedStructItemsPrompt?.(_selectedStructureItemsPrompt)

      updateBlockFieldOnBackSpace?.(_block, x, _selectedStructureItems)

      //make cursor at start position of deleted var
      setTimeout(() => {
        inputElement.selectionStart = x.startIndex
        inputElement.selectionEnd = x.startIndex
        inputElement.focus()
      })
    }
  })
}
