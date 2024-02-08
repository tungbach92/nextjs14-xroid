import {Block, BlockVideo} from "@/app/types/block";
import {VIMEO, YOUTUBE} from "@/app/configs/constants";
import {patternVimeo, patternYoutube} from "@/app/components/custom/chapter/screnarioContents/VideoTemplate";

export const getIdInValidVideo = (blocks: Block []) => {
  let idInValids = []
  const regexYoutube = new RegExp(patternYoutube)
  const regexVimeo = new RegExp(patternVimeo)
  blocks?.forEach(block => {
    if (block.type !== YOUTUBE && block.type !== VIMEO) return
    const _block = {...block} as BlockVideo
    if (!regexYoutube.test(_block.data.url) || !regexVimeo.test(_block.data.url)) {
      idInValids.push(_block.id)
    }
  })
  return idInValids[0]
}
