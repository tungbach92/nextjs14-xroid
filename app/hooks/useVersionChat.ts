import React, {useEffect} from "react";
import {useAtom} from "jotai";
import {blocksAtom} from "@/app/store/atom/blocks.atom";
import {VersionChatGpt} from "@/app/types/types";
import {BlockChatGptVersionUserChoice} from "@/app/types/block";
import {useGetAllModels} from "@/app/hooks/useGetAllModels";

export const useVersionChat = () => {
  const [newVersionData, setNewVersionData] = React.useState<VersionChatGpt[]>([])
  const [blocks, setBlocks] = useAtom(blocksAtom)
  const blockItem = blocks?.find((item) => item.type === 'versionUserChoice') as BlockChatGptVersionUserChoice
  const {modelList, loadingModels} = useGetAllModels()

  useEffect(() => {
    const modelsData = () => {
      if (modelList) setNewVersionData(modelList.map((item) => {
        if (item?.isDeleted) return null;
        if (blockItem?.data?.modelIds?.includes(item.id)) {
          return {
            ...item,
            selected: true
          }
        }
        return {
          ...item,
          selected: false
        }
      }))
    }
    modelsData()
  }, [modelList])


  return {newVersionData, setNewVersionData};
}
