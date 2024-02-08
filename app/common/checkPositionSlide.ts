import {Block} from "@/app/types/block";
import {cloneDeep, orderBy} from "lodash";

export const checkPositionSlide = (blocksSelection: Block [], _blocks: Block [], result, items: Block []) => {
  let confirmBlocks: Block[] = []
  blocksSelection.forEach((e, idx) => {
    if (e.type === 'slide') {
      //check index position between slide and show slide then change position
      let findPiece = blocksSelection.find(i => i.type === 'show_slide' && e.showSlideId === i.showSlideId)
      // check show slide exits on blocksSelection
      if (findPiece) return confirmBlocks.push(e)
      let find = _blocks.find(i => i.type === 'show_slide' && e.showSlideId === i.showSlideId)
      if (find) {
        let index = result.destination.index + idx
        if (index < find?.index) {
          confirmBlocks.push(e)
        } else {
          let couple = [e, find]
          confirmBlocks.push(...couple)
        }
      }
    } else if (e.type === 'show_slide') {
      //check index position between slide and show slide then change position
      let findPiece = blocksSelection.find(i => i.type === 'slide' && e.showSlideId === i.showSlideId)
      // check slide exits on blocksSelection
      if (findPiece) return confirmBlocks.push(e)
      let find = _blocks.find(i => i.type === 'slide' && e.showSlideId === i.showSlideId)
      if (find) {
        let index = result.destination.index + idx
        if (index > find?.index) {
          confirmBlocks.push(e)
        } else {
          let couple = [find, e]
          confirmBlocks.push(...couple)
        }
      }
    } else {
      confirmBlocks.push(e)
    }
  })
  items = cloneDeep(items).filter(i => !confirmBlocks.find(e => e.id === i.id))
  items.splice(result.destination.index, 0, ...orderBy(confirmBlocks, ['index'], ['asc']));
}
