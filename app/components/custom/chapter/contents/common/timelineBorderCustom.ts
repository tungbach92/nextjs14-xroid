export const isTimeLineMusicColor = (arraySameMusic, index) => {
  return arraySameMusic.includes(index)
}
export const isTimeLineImageColor = (arraySameImage, index) => {
  return arraySameImage.includes(index)
}
export const isHiddenImage = (blocks, index) => {
  return index !== length - 1 && index !== 0 && blocks[index - 1]?.imageUrl === blocks[index]?.imageUrl && blocks[index + 1]?.imageUrl === blocks[index]?.imageUrl
}
export const isHiddenMusic = (blocks, index) => {
  return index !== length - 1 && index !== 0 && blocks[index - 1]?.audioUrl === blocks[index]?.audioUrl && blocks[index + 1]?.audioUrl === blocks[index]?.audioUrl
}
export const isBorderTopImg = (blocks, index) => {
  return index !== length - 1 && index !== 0 && blocks[index - 1]?.imageUrl !== blocks[index]?.imageUrl && blocks[index]?.imageUrl
}
export const isBorderBottomImg = (blocks, index) => {
  return index !== length - 1 && index !== 0 && blocks[index + 1]?.imageUrl !== blocks[index]?.imageUrl && blocks[index]?.imageUrl
}
export const isBorderTopMusic = (blocks, index) => {
  return index !== length - 1 && index !== 0 && blocks[index - 1]?.audioUrl !== blocks[index]?.audioUrl && blocks[index]?.audioUrl
}
export const isBorderBottomMusic = (blocks, index) => {
  return index !== length - 1 && index !== 0 && blocks[index + 1]?.audioUrl !== blocks[index]?.audioUrl && blocks[index]?.audioUrl
}
