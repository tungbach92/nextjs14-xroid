import React, {useEffect, useMemo} from 'react';
import CardCustom from "@/app/components/custom/CardCustom";
import Dropdown from "@/app/components/custom/Dropdown";
import {cloneDeep, includes} from "lodash";
import {useAtom, useSetAtom} from "jotai";
import {structureIdInnChapterAtom} from "@/app/store/atom/structureIdsInChapter.atom";
import {useStructureDataAtom} from "@/app/store/atom/structureData.atom";
import {readWriteBlocksAtom} from "@/app/store/atom/blocks.atom";
import {BlockContinuousChat} from "@/app/types/block";
import {chapterErrorAtom, clearChapterErrorAtom} from "@/app/store/atom/chapterError.atom";

type props = {
  block: BlockContinuousChat
  onChange?: (p: any) => void
  onDelete: () => void
  onCopy: () => void
  isShowAddButton: boolean
  handleMultiCopy: (item: any) => void
  handleGetIndex: () => void

}

function ContinuousChat({
                          block,
                          onDelete,
                          onCopy,
                          isShowAddButton,
                          handleMultiCopy,
                          handleGetIndex
                        }: props) {
  const updateBlocks = useSetAtom(readWriteBlocksAtom)
  const [ids] = useAtom(structureIdInnChapterAtom)
  const [structureDataAtom] = useStructureDataAtom();
  const [selectedStructId, setSelectedStructId] = React.useState<string>('')
  const [chapterError] = useAtom(chapterErrorAtom)
  const clearChapterError = useSetAtom(clearChapterErrorAtom)

  useEffect(() => {
    setSelectedStructId(block?.data?.dataStructureId ?? '')
  }, [block?.data?.dataStructureId])

  const structure = structureDataAtom?.map((struct) => {
    if (includes(ids, struct.id))
      return struct
  }).filter((item) => item !== undefined && item?.contentId) || []

  const dataStructIds = useMemo(() => {
    let data = []
    structure?.forEach((item) => {
      item.items.forEach((i) => {
        if (!i.fieldPath) return;
        data.push({
          value: i.id,
          label: `${item.name} : ${i.fieldPath}`,
        })
      })
    })
    return data
  }, [structure])

  const onChangeStruct = (value: string) => {
    setSelectedStructId(value)

    const _block = cloneDeep(block)
    const parentId = structure.find((item) => item.items.find((i) => i.id === value))?.id
    const structItem = structure.find((item) => item.items.find((i) => i.id === value))
    const chatTitle = structItem?.items.find((i) => i.id === value)
    _block.data.dataStructureId = value
    _block.data.parentId = parentId
    _block.data.chatTitle = chatTitle?.fieldPath
    updateBlocks(_block)
    clearChapterError('hasContinuousChat')
  }

  return (
    <div>
      <CardCustom isCopy={false} onCopy={onCopy}
                  block={block}
                  isShowAddButton={isShowAddButton}
                  handleMultiCopy={handleMultiCopy}
                  handleGetIndex={handleGetIndex}
                  onDelete={onDelete} title={'ChatGPT chatID'}
                  color={'#74AA9C'}
                  className={`border-2 border-solid border-[#74AA9C] min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px] w-full ${chapterError.hasContinuousChat && 'border border-solid border-red-500'}`}
      >
        <div className={'flex flex-col text-xs 2xl:text-[16px]'}>
          <div className={'text-left w-full pb-3'}>
            継続チャット
          </div>
          <div className={'flex flex-col mr-[10%]'}>
            ChatTitle
            <Dropdown dataSelect={dataStructIds}
                      onChange={(e) => onChangeStruct(e.target.value)}
                      value={selectedStructId} minWidth={250}
                      className={`${chapterError.hasContinuousChat && 'border border-solid border-red-500'}`}/>
          </div>
        </div>
      </CardCustom>
    </div>
  );
}

export default ContinuousChat;
