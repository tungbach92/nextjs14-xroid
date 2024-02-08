import {AllBlockType} from "@/app/types/block";
import {isEmpty} from "lodash";

export const isBlockNoVoice = (block: AllBlockType, voiceName?: string) => {
  if (!block) return false
  if (block?.characters.every(c => !c?.isVoice) || isEmpty(block?.characters)) return true
  if (voiceName === 'noVoice') return true
}
