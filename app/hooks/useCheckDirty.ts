import {useEffect, useState} from "react";
import {Content, ContentState} from "@/app/types/content";
import {initialState} from "@/app/components/Content/data/data";
import isEqual from "react-fast-compare";
import {useAtomValue} from "jotai";
import {dataStructIdContentAtom} from "@/app/store/atom/structureData.atom";

interface Props {
  content: Content,
  state: ContentState,

}

export default function useCheckDirty({content, state}: Props) {
  const [isDirty, setIsDirty] = useState<boolean>(false)
  const dataStructIdContent = useAtomValue(dataStructIdContentAtom)

  useEffect(() => {
    setIsDirty(false)
    const _state: ContentState = {
      cube: content?.cubeOptions?.cube || initialState.cube,
      waitForFree: content?.cubeOptions?.basic?.waitForFree || initialState.waitForFree,
      freeAll: content?.cubeOptions?.basic?.freeAll || initialState.freeAll,
      purchaseAll: content?.cubeOptions?.basic?.purchaseAll || initialState.purchaseAll,
      freeData: content?.cubeOptions?.chapter?.free || initialState.freeData,
      purchaseData: content?.cubeOptions?.chapter?.purchase || initialState.purchaseData,
      waitForFreeData: content?.cubeOptions?.chapter?.waitForFree || initialState.waitForFreeData,
      thumb: content?.thumbnail || initialState.thumb,
      mentoroid: content?.mentoroids || initialState.mentoroid,
      title: content?.title || initialState.title,
      imageTitle: content?.imageTitle || initialState.imageTitle,
      description: content?.description || initialState.description,
      viewOptions: content?.viewOptions || initialState.viewOptions,
      releaseOptions: content?.releaseOptions || initialState.releaseOptions,
      isAbleComment: content?.isAbleComment || initialState.isAbleComment
    }
    const dataStructId = content?.dataStructureIds || []
    if (!isEqual(state, _state) || !isEqual(dataStructId, dataStructIdContent))
      setIsDirty(true)

  }, [state, content, dataStructIdContent])
  return {isDirty}
}
