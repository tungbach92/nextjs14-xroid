import React from 'react';
import {useVersionChat} from "@/app/hooks/useVersionChat";
import {useAtom, useSetAtom} from "jotai";
import {readWriteBlocksAtom} from "@/app/store/atom/blocks.atom";
import BoltIcon from "@mui/icons-material/Bolt";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import {cloneDeep} from "lodash";
import {BlockChatGptVersionSetting} from "@/app/types/block";
import {chapterErrorAtom, clearChapterErrorAtom} from "@/app/store/atom/chapterError.atom";

type props = {
  block: BlockChatGptVersionSetting
}

function SettingVersion({block}: props) {
  const {newVersionData, setNewVersionData} = useVersionChat()
  const updateBlocks = useSetAtom(readWriteBlocksAtom)
  const [chapterError] = useAtom(chapterErrorAtom)
  const clearChapterError = useSetAtom(clearChapterErrorAtom)

  const handleSelect = (item, index: number) => {
    const _block = cloneDeep(block)
    const newData = newVersionData.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          selected: !(block?.data?.modelId === item.id) ? true : !item.selected,
        }
      } else {
        return {...item, selected: false}
      }
    })
    setNewVersionData(newData)

    _block.data = {
      ...block?.data,
      modelId: newData.find(item => item.selected)?.id
    }
    updateBlocks(_block)
    clearChapterError('hasVersionSetting')
  }
  return (
    <div className={'flex flex-col w-full'}>
      <div
        className={`flex gap-1 bg-[#E1EAEF] rounded-xl ${chapterError.hasVersionSetting && 'border border-solid border-red-500'}`}>
        {
          newVersionData?.map((item, index: number) => {
            return (
              <div key={index} className={'w-full flex flex-col gap-1 p-1 m-auto'}>
                <div
                  onClick={() => handleSelect(item, index)}
                  className={`text-[10px] 2xl:text-[16px] items-center flex ${item?.selected || block?.data?.modelId === item.id ? 'bg-white p-2 rounded-xl text-[#4AA181]' : 'bg-[#E1EAEF] p-2'}`}>
                  {item.name === 'GPT-3.5' ? <BoltIcon className={'mr-1'}/> : <AutoAwesomeIcon className={'mr-1'}/>}
                  {item.name}
                </div>
              </div>
            )
          })
        }
      </div>
      <div className={'flex gap-2'}>
        {
          newVersionData?.map((item, index: number) => {
            return (
              <div key={index}
                   className={`items-center w-full flex flex-col font-bold my-1 ${(block?.data?.modelId === item.id) ? 'text-[#4AA181]' : ''}`}>
                {item.context}
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

export default SettingVersion;
