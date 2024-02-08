import React, {useEffect} from 'react';
import CardCustom from "@/app/components/custom/CardCustom";
import ChatGPTChoice from "@/app/components/custom/chapter/ChatGPTChoice";
import {CssTextField} from "@/app/components/custom/CssTextField";
import {useAtomValue, useSetAtom} from "jotai";
import {readWriteBlocksAtom} from "@/app/store/atom/blocks.atom";
import SettingVersion from "@/app/components/custom/chapter/SettingVersion";
import {BlockChatGptVersionSetting, BlockChatGptVersionUserChoice} from "@/app/types/block";
import {cloneDeep} from "lodash";
import {chapterErrorAtom} from "@/app/store/atom/chapterError.atom";

type props = {
  block: BlockChatGptVersionUserChoice | BlockChatGptVersionSetting
  onChange?: (p: any) => void
  onDelete: () => void
  onCopy: () => void
  isShowAddButton: boolean
  handleMultiCopy: (item: any) => void
  handleGetIndex: () => void

}

function ChatGPTVersionUserChoice({
  block,
  onDelete,
  onCopy,
  isShowAddButton,
  handleMultiCopy,
  handleGetIndex
}: props) {
  const updateBlocks = useSetAtom(readWriteBlocksAtom)
  const [chatTitle, setChatTitle] = React.useState('')
  const chapterError = useAtomValue(chapterErrorAtom)

  useEffect(() => {
    if (block?.data) {
      setChatTitle(block.data?.chatTitle)
    }
  }, [block?.data])
  const onChangeChatTitle = (e) => {
    setChatTitle(e.target.value)
    block.data.chatTitle = e.target.value
    updateBlocks(block)
  }
  return (
    <div>
      <CardCustom isCopy={false} onCopy={onCopy}
                  block={block} isShowAddButton={isShowAddButton}
                  handleMultiCopy={handleMultiCopy}
                  handleGetIndex={handleGetIndex}
                  onDelete={onDelete}
                  title={`${block?.type === 'versionUserChoice' ? 'ChatGPT Version User Choice' : 'ChatGPT Version'}`}
                  color={'#74AA9C'}
                  className={`border-2 border-solid border-[#74AA9C] min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px] w-full ${(chapterError.hasVersionUserChoice || chapterError.hasVersionSetting) && 'border-red-500'}`}
      >
        <div className={'pt-3'}>
          <div className={'mr-2 flex flex-col'}>
            Chat Title
            <CssTextField size={'small'} className={'w-full 2xl:w-1/2 pt-2'}
                          value={chatTitle}
                          onChange={(e) => onChangeChatTitle(e)}/>
          </div>
          <div className={'py-3'}>
            {
              block?.type === 'versionUserChoice' ?
                <ChatGPTChoice block={block}/> : <SettingVersion block={block}/>
            }
          </div>
        </div>
      </CardCustom>
    </div>
  );
}

export default ChatGPTVersionUserChoice;
