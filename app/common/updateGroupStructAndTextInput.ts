import {TEXT_V2} from "@/app/configs/constants";
import {cloneDeep} from "lodash";
import {Block, BlockText} from "@/app/types/block";
import {getFieldPath} from "@/app/common/getStructParentId";
import {DataStructure} from "@/app/types/types";
import {SetStateAction} from "react";

interface Props {
  blocks: Block[]
  updateBlocks: React.Dispatch<SetStateAction<Block>>
  structureInChapter: DataStructure[]
  draftStructInChapter: DataStructure[]
}

export const updateGroupStructAndTextInput = ({
  blocks,
  updateBlocks,
  draftStructInChapter,
  structureInChapter,
}: Props) => {
  const draftStructInChapterIds = draftStructInChapter.map(item => item.id)
  const unselectedStructures = structureInChapter?.filter(x => !draftStructInChapterIds.includes(x.id))
  const unselectedStructureItems = unselectedStructures.map(x => x.items).flat()

  blocks.forEach(block => {
    if (block.type === TEXT_V2) {
      const _block = cloneDeep(block) as BlockText
      let previewText = _block.data.message.japanese

      const listFieldPath = unselectedStructureItems.map(x => `{{${getFieldPath(structureInChapter, x.id)}}}`)
      listFieldPath.forEach(x => {
        previewText = previewText.replace(x, '')
      })
      _block.data.message.japanese = previewText
      _block.data.message.english = previewText
      _block.data.groupsStruct = _block.data.groupsStruct.filter(x => draftStructInChapterIds.includes(x.parentId))
      updateBlocks(_block)
    }
  })
}
