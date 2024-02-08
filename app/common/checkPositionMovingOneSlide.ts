import {cloneDeep, orderBy} from "lodash";
import {Block} from "@/app/types/block";

export const checkPositionMovingOneSlide = (_blocks: Block [], result, items: Block[]) => {
  let source = _blocks[result.source.index]
  if (source?.type === 'slide') {
    let showSlide = _blocks.find(i => i?.type === 'show_slide' && source?.showSlideId === i.showSlideId)
    if (showSlide) {
      //check index position between slide and show slide then change position
      if (result.destination.index < showSlide?.index) {
        // items = items.filter(i => i?.id !== template?.id)
        items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, source);
      } else {
        let couple = [source, showSlide]
        items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, ...orderBy(couple, ['index'], ['asc']));
        // delete old show slide in items
        const oldSlideIndex = items.findIndex(i => i?.type === 'show_slide' && source?.showSlideId === i.showSlideId)
        items.splice(oldSlideIndex, 1)
      }
    } else {
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
    }
  } else if (source?.type === 'show_slide') {
    let slide = _blocks.find(i => i?.type === 'slide' && source?.showSlideId === i.showSlideId)
    if (slide) {
      //check index position between slide and show slide then change position
      if (slide?.index < result.destination.index) {
        // items = items.filter(i => i?.id !== template?.id)
        items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, source);
      } else {
        let couple = [slide, source]
        items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, ...orderBy(couple, ['index'], ['asc']));
        // delete old slide in items
        const oldSlideIndex = (items.length - 1) - cloneDeep(items).reverse().findIndex(i => i?.type === 'slide' && source?.showSlideId === i.showSlideId)
        items.splice(oldSlideIndex, 1)
      }
    }
  } else {
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
  }
}
