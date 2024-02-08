import React from 'react';
import BoltIcon from '@mui/icons-material/Bolt';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Checkbox from "@mui/material/Checkbox";
import {useVersionChat} from "@/app/hooks/useVersionChat";
import {readWriteBlocksAtom} from "@/app/store/atom/blocks.atom";
import {useAtom, useSetAtom} from "jotai";
import {cloneDeep} from "lodash";
import {BlockChatGptVersionUserChoice} from "@/app/types/block";
import {chapterErrorAtom, clearChapterErrorAtom} from "@/app/store/atom/chapterError.atom";

type props = {
  block: BlockChatGptVersionUserChoice
}

function ChatGPTChoice({block}: props) {
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
          selected: !Boolean(block?.data?.modelIds?.includes(item.id)),
        }
      } else {
        return {...item}
      }
    })
    setNewVersionData(newData)

    _block.data = {
      ...block?.data,
      modelIds: newData.filter(item => item.selected).map(item => item.id)
    }
    updateBlocks(_block)
    clearChapterError('hasVersionUserChoice')
  }
  return (
    <div className={'flex flex-col w-full'}>
      <div
        className={`flex gap-1 bg-[#E1EAEF] rounded-xl`}>
        {
          newVersionData?.map((item, index: number) => {
            return (
              <div key={index} className={'w-full flex flex-col gap-1 p-1 m-auto'}>
                <div
                  className={`text-[10px] 2xl:text-[16px] items-center flex ${item?.selected || Boolean(block?.data?.modelIds?.includes(item.id)) ? 'bg-white p-2 rounded-xl text-[#4AA181]' : 'bg-[#E1EAEF] p-2'}`}>
                  {item.name === 'GPT-3.5' ? <BoltIcon className={'mr-1'}/> : <AutoAwesomeIcon className={'mr-1'}/>}
                  {item.name}
                </div>
              </div>
            )
          })
        }
      </div>
      <div className={`flex gap-2 ${chapterError.hasVersionUserChoice && 'border border-solid border-red-500'}`}>
        {
          newVersionData?.map((item, index: number) => {
            return (
              <div key={index}
                   className={`items-center w-full flex flex-col font-bold my-1 ${Boolean(block?.data?.modelIds?.includes(item.id)) ? 'text-[#4AA181]' : ''}`}>
                {item.context}
                <Checkbox checked={Boolean(block?.data?.modelIds?.includes(item.id))} className={'-mt-2'}
                          onChange={() => handleSelect(item, index)}/>
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

export default ChatGPTChoice;
