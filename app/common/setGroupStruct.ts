import {findIndex} from "lodash";
import {BlockText, GroupStruct} from "@/app/types/block";

interface Props {
  block: BlockText
  resultUserInputs: string[]
}

export const setGroupStruct = ({block, resultUserInputs}: Props) => {
  const groupStruct: GroupStruct[] = []
  resultUserInputs?.length && resultUserInputs.forEach((r) => {
    let idx = findIndex(block.data.groupsStruct, {userInput: r})
    if (idx === -1) {
      groupStruct.push({
        userInput: r,
        dataStructId: '',
        parentId: ''
      })
    } else {
      groupStruct.push({
        userInput: block.data.groupsStruct[idx].userInput || '',
        dataStructId: block.data.groupsStruct[idx].dataStructId || '',
        parentId: block.data.groupsStruct[idx].parentId || ''
      })
    }
  })
  block.data.groupsStruct = groupStruct || []
}
