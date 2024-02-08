import {getListVarIndex} from "@/app/common/getListVarIndex";
import React from "react";
import {BlockText, BlockUroidCharPromptFooter, BlockUroidCharPromptHeader} from "@/app/types/block";

interface Props {
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  draftText: string
  setDraftText: React.Dispatch<React.SetStateAction<string>>
  updateBlockField?: (_block: BlockText | BlockUroidCharPromptHeader | BlockUroidCharPromptFooter, inputValue: string) => void
  block?: BlockText | BlockUroidCharPromptHeader | BlockUroidCharPromptFooter
}

export const handleChangeDraftText = ({event, setDraftText, draftText, updateBlockField, block}: Props) => {
  const inputElement = event.target;
  const inputValue = event.target.value;
  // @ts-ignore
  const cursorPosition = inputElement.selectionEnd;
  const indices = getListVarIndex(draftText)
  // Bỏ qua nếu currPos nằm trong list indices
  indices.forEach(x => {
    if ((cursorPosition <= x.endIndex && cursorPosition > x.startIndex + 1)) {
      return
    } else {
      setDraftText(inputValue)
      updateBlockField?.(block, inputValue)
    }
  })
  if (indices.length === 0) {
    setDraftText(inputValue)
    updateBlockField?.(block, inputValue)
  }
}
