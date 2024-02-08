import {cloneDeep, difference} from "lodash";
import {Block, BlockChatGptVersionSetting, BlockChatGptVersionUserChoice} from "@/app/types/block";
import isEqual from "react-fast-compare";
import {createDataStructureList, updateDataStructureList} from "@/app/common/commonApis/dataStructure";
import {DataStructure} from "@/app/types/types";
import {dataStructureItems} from "@/app/components/custom/chapter/customDataStructureItems";

type props = {
  _blocks: Block[],
  block: Block,
  dataStructures: DataStructure[],
  storage: DataStructure,
  oldVersionUserChoiceBlock: BlockChatGptVersionUserChoice,
  contentId: string
  contentStructItems: DataStructure[],
}

export const createAndUpdateDataStructureAtChapter = async ({
                                                              _blocks,
                                                              block,
                                                              dataStructures,
                                                              storage,
                                                              oldVersionUserChoiceBlock,
                                                              contentId,
                                                              contentStructItems
                                                            }: props) => {
  const diff = difference(dataStructures[0]?.items, storage?.items) as DataStructure
  const versionBlock = _blocks?.find(item => item.type === 'versionUserChoice' || item.type === 'versionSetting') as (BlockChatGptVersionUserChoice | BlockChatGptVersionSetting)
  if (block.type === 'versionUserChoice' || block.type === 'versionSetting' && versionBlock?.data?.chatTitle) {
    const _block = cloneDeep(block) as BlockChatGptVersionUserChoice | BlockChatGptVersionSetting
    const checkUpdate = isEqual(oldVersionUserChoiceBlock?.data, _block?.data)
    if (storage) {
      if (!checkUpdate)
        await updateDataStructureList(dataStructures)
      _block.data.dataStructureId = diff[0]?.id || dataStructureItems({_blocks, contentStructItems})[0]?.id
      _block.data.parentId = storage?.id
      block = {..._block}
    } else {
      await createDataStructureList(dataStructures)
      const parentId = dataStructures?.find(item => item?.contentId === contentId)?.id
      _block.data.dataStructureId = diff[0]?.id
      _block.data.parentId = parentId
      block = {..._block}
    }
    return block
  }
  return block
}
