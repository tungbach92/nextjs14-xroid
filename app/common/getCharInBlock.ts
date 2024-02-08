import {Character, CharacterBlock} from "@/app/types/types";

export const getCharInBlock = (data: Character[]): CharacterBlock[] => {
  // set first show char, isVoice = true
  let dummy = 0
  return data?.map((i) => {
    if (i.isShow) dummy++;
    return {
      id: i.id,
      isAction: i.isAction,
      isShow: i.isShow,
      isVoice: dummy === 1,
      avatar: i.avatar,
      position: i.position,
      voiceId: i.voiceId ?? '',
      motionId: i.motionId ?? '',
      characterPrompt1: i.characterPrompt1 ?? '',
      characterPrompt2: i.characterPrompt2 ?? ''
    } satisfies CharacterBlock
  })
}
