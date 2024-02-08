import {getFieldPath, getStructParentId} from "@/app/common/getStructParentId";
import {
  Block,
  BlockInputEnecolorText,
  BlockPrompt,
  BlockPromptInput,
  BlockText,
  Enecolor,
  GroupStruct
} from "@/app/types/block";
import {DataStructure, DataStructureItem} from "@/app/types/types";
import React from "react";

interface Props {
  text?: string;
  selectedStructureItems: DataStructureItem[]
  block: BlockText | BlockInputEnecolorText
  listDataStructure: DataStructure[]
  enecolors: Enecolor[]
  updateBlocks: React.Dispatch<React.SetStateAction<Block>>
  field?: string
  listVar?: string[]
  getListTotalVar?: (block: BlockText | BlockInputEnecolorText | BlockPrompt | BlockPromptInput) => string[]
}

export const handleUpdateBlockFields = ({
  text = '',
  selectedStructureItems,
  block,
  updateBlocks,
  listDataStructure,
  enecolors,
  field,
  listVar, getListTotalVar
}: Props) => {
  // block.data.message.japanese = text
  // block.data.message.english = text
  if (field)
    field === 'japanese' ? (block.data.message[field] = text) : (block.data[field] = text)
  block.data.groupsStruct = selectedStructureItems.map(x => ({
    dataStructId: x.id,
    parentId: getStructParentId(listDataStructure, x.id),
    userInput: `{{${getFieldPath(listDataStructure, x.id)}}}`
  } satisfies GroupStruct))
  const selectedEnecolors = enecolors.filter(x => (listVar ?? getListTotalVar(block)).find(y => y === x.groupsText?.userInput))
  const newGroupText = selectedEnecolors.map(x => ({enecolorId: x.id, userInput: x.groupsText.userInput})) // user input wont be updated by cloud function
  block.data.groupsText = [...newGroupText]
  updateBlocks?.(block)
}
