export const chapterIndex = (chapters) => {
  if (chapters?.length == 0) return 0
  const indexArr = chapters?.map((i: any) => {
    return i?.chapterIndex
  })
  if (indexArr) {
    const maxIndex = Math.max(...indexArr)
    return maxIndex + 1
  }
}
