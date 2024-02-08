import React, {useCallback, useEffect, useState} from "react";
import {Content, ContentState} from "@/app/types/content";
import useSelectedDataStructContent from "@/app/hooks/useSelectedDataStructContent";
import {genId} from "cf-gen-id";
import {getDeeplink} from "@/app/common/deeplink";
import {initialState} from "@/app/components/Content/data/data";
import {isNil} from "lodash";

interface UseSetFieldContentProps {
  content: Content
  setState: React.Dispatch<React.SetStateAction<ContentState>>
  setDeeplink: React.Dispatch<React.SetStateAction<string>>,
  setContentId: React.Dispatch<React.SetStateAction<string>>,
  id: string
}

export default function useSetFieldContent({
  content,
  setState,
  setDeeplink,
  setContentId,
  id
}: UseSetFieldContentProps) {

  useEffect(() => {
    let newId = genId({prefix: "content_", size: 10})
    if (id === "create" && !content?.id && !content?.deeplink) {
      handleDeeplink(newId).then(({deeplink}) => {
        setContentId(newId)
        setDeeplink(deeplink)
        setState(prev => ({...prev}))
      })
    }
  }, [!content?.id, id])
  const handleDeeplink = async (contentId) => {
    try {
      return await getDeeplink({contentId})
    } catch (err) {
      console.log(err);
      return {deeplink: ''}
    }
  }

  const setFieldContent = useCallback(() => {
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
      categoriesId: content?.categoriesId || initialState.categoriesId,
      isAbleComment: isNil(content?.isAbleComment) ? initialState.isAbleComment : content?.isAbleComment,
      schoolAI: isNil(content?.schoolAI) ? initialState.schoolAI : content.schoolAI,
      adviceC: isNil(content?.adviceC) ? initialState.adviceC : content.adviceC,
      businessB: isNil(content?.businessB) ? initialState.businessB : content.businessB,
      withFriend: isNil(content?.withFriend) ? initialState.withFriend : content.withFriend,
      changed: false,
      listChanged: [],
      id: content?.id || initialState.id,
      embedData: content?.embedData || initialState.embedData,
    }
    setState(item => ({
        ...item,
        ..._state
    }));
  }, [content])

  useEffect(() => {
    setContentId(content?.id)
    setFieldContent()
    setDeeplink(content?.deeplink)
  }, [content])

  useSelectedDataStructContent({content})

  return {setFieldContent}
}
