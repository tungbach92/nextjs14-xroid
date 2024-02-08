import {cloneDeep, toNumber} from "lodash";
import {Block} from "@/app/types/block";
import React from "react";

interface Props {
  blocks: Block[]
  end: string
  start: string
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>,
  setIsTimelineAudioSetting: React.Dispatch<React.SetStateAction<boolean>>
  previewAudioUrl: string
  audioName: string
  audioUrl: string
}

const handleSubmitAudioSetting = (props: Props) => {
  const {
    blocks,
    end,
    start,
    audioUrl,
    setIsTimelineAudioSetting,
    previewAudioUrl,
    audioName,
    setBlocks
  } = props
  const _blocks = cloneDeep(blocks)
  if (end === "") {
    _blocks[start].audioUrl = audioUrl
    _blocks[start].previewAudiosUrl = previewAudioUrl
    _blocks[start].audioName = audioName
  }
  if (start === "") {
    _blocks[end].audioUrl = audioUrl
    _blocks[end].previewAudioUrl = previewAudioUrl
    _blocks[end].audioName = audioName
  }
  if (start !== "" && end !== "") {
    for (let index = toNumber(start); index <= toNumber(end); index++) {
      _blocks[index].audioUrl = audioUrl
      _blocks[index].previewAudioUrl = previewAudioUrl
      _blocks[index].audioName = audioName
    }
  }
  setBlocks(_blocks)
  setIsTimelineAudioSetting(false)
}
