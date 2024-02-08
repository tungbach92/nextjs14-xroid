import {isEqual, orderBy, uniqWith} from "lodash";

export const addCoupleSlideToBlockSelection = (selectedItem, cloneBlock, setBlocksSelection) => {
  if (selectedItem.type === 'show_slide') {
    const slide = cloneBlock.find(item => item.type === 'slide' && item.showSlideId === selectedItem.showSlideId)
    setBlocksSelection(prev => orderBy(uniqWith([...prev, slide, selectedItem], isEqual), ['index'], ['asc']));
    return;
  }
  if (selectedItem.type === 'slide') {
    const showSlide = cloneBlock.find(item => item.type === 'show_slide' && item.showSlideId === selectedItem.showSlideId)
    setBlocksSelection(prev => orderBy(uniqWith([...prev, showSlide, selectedItem], isEqual), ['index'], ['asc']));
    return;
  }
}
