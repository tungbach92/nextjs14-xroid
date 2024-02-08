export const mapDataToAddIndex = (data: any) => {
  return data.map((item: any, index: number) => {
    return {
      ...item,
      index: index
    }
  })
}
