import {Block, BlockChatGptVersionSetting, BlockChatGptVersionUserChoice} from "@/app/types/block";
import {DataStructure} from "@/app/types/types";
import {getId} from "@/app/common/getId";

type props = {
  _blocks: Block[],
  contentStructItems: DataStructure[],
}

export const dataStructureItems = ({_blocks, contentStructItems}: props) => {
  const versionBlock = _blocks?.find(item => item.type === 'versionUserChoice' || item.type === 'versionSetting') as (BlockChatGptVersionUserChoice | BlockChatGptVersionSetting)
  if (contentStructItems?.length == 0) {
    return [{
      fieldPath: versionBlock?.data?.chatTitle,
      id: getId('storageItem_', 10),
      type: 'text',
      isDeleted: false,
    }]
  } else {
    if (contentStructItems?.find(item => item?.id === versionBlock?.data?.dataStructureId)) {
      return contentStructItems?.map(item => {
          if (item?.id === versionBlock?.data?.dataStructureId) {
            return {
              ...item,
              fieldPath: versionBlock?.data?.chatTitle,
              type: 'text',
              isDeleted: false,
            }
          } else return item
        }
      )
    } else return [...contentStructItems, {
      fieldPath: versionBlock?.data?.chatTitle,
      id: getId('storageItem_', 10),
      type: 'text',
      isDeleted: false,
    }]
  }
}
