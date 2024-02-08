import {Character, CharacterBlock} from "@/app/types/types";
import React from "react";
import {cloneDeep} from "lodash";
import {DEFAULT_POS} from "@/app/configs/constants";
import {Block} from "@/app/types/block";

export const selectCharLogic = (char: Character, event: React.ChangeEvent<HTMLInputElement>,
                                selectedCharsInContentState: Character[], blocks: Block [],
                                setSelectedCharacterContentState: React.Dispatch<Character[]>,
                                setBlocks: React.Dispatch<Block[]>) => {
  const checked = event.target.checked
  const _selectedCharsInContent = cloneDeep(selectedCharsInContentState)
  const index = _selectedCharsInContent.findIndex((item) => item.id === char?.id)
  if (index !== -1) {
    _selectedCharsInContent[index].isShow = checked
    if (_selectedCharsInContent[index].isAction && _selectedCharsInContent[index].isVoice) {
      _selectedCharsInContent[index].isVoice = false
    }
    setSelectedCharacterContentState(_selectedCharsInContent)
  }
  // merge properties with existing blocks when click showing char
  const _blocks = cloneDeep(blocks)

  const newBlocks = _blocks?.map((block) => {
    const characters = _selectedCharsInContent?.map((c, index) => {
      const newChar: CharacterBlock = {
        id: c.id,
        avatar: c.avatar,
        isAction: c.isShow ? block.characters[index]?.isAction : c.isAction,
        isShow: c?.isShow,
        isVoice: block.characters[index]?.isVoice,
        position: block.characters[index]?.position || DEFAULT_POS,
        motionId: c?.defaultMotion ?? '',
        voiceId: c?.defaultVoice ?? '',
        characterPrompt1: block.characters[index]?.characterPrompt1 || c?.characterPrompt1 || '',
        characterPrompt2: block.characters[index]?.characterPrompt2 || c?.characterPrompt2 || '',
        isURoidTemplate: c?.isURoidTemplate
      }
      return newChar
    })
    return {
      ...block,
      characters
    }
  })

  // set isVoice for first block when click showing char
  newBlocks?.forEach(block => {
    const findVoice = block.characters.find((c: Character) => c.isVoice && c.isShow) //có voice
    const theFirstShowChar = block.characters.find((c: Character) => c.isShow) // nv đầu tiên được show
    const checkBlockNoVoice = block.characters.every((c: Character) => !c.isVoice) // tất cả block đều không có voice
    const charContent = _selectedCharsInContent.find((c: Character) => c.isShow)
    const _arr = _selectedCharsInContent.filter((c: Character) => c.isShow)
    if(!charContent){block.characters = []}
    if(charContent && checkBlockNoVoice){
      theFirstShowChar.isVoice = false
    }
    if (!findVoice && theFirstShowChar && !checkBlockNoVoice) {
      theFirstShowChar.isVoice = true
    }
    if (findVoice && index !== -1) {
      block.characters[index].isVoice = false
    }
    if(block.characters?.length ===  _selectedCharsInContent?.length && (_arr?.length === 1)){
      if(block.type === 'control'){
        block.characters[index].isAction = true
      }
      block.characters[index].isVoice = true
    }
    block.characters.forEach((c: Character) => {
      if (!c.isShow) {
        c.isVoice = false
      }
    })
    setBlocks(newBlocks)
  })
}
