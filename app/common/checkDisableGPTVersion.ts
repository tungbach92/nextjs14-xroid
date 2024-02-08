import {Block} from "@/app/types/block";

export const disableChatGPTVersion = (blocks: Block[]) => {
  if (!blocks) return
  return Boolean(blocks?.find(block => block.type === 'versionUserChoice' ||
    block.type === 'versionSetting' ||
    block.type === 'continuousChat'))
}
