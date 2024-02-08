import {DataStructure} from "@/app/types/types";

export const getStructParentId = (structure: DataStructure[], id: string) => {
  let parentId = ''
  structure?.forEach((item) => {
    item?.items?.forEach((i) => {
      if (i.id === id)
        parentId = item.id
    })
  })
  return parentId
}

export const getFieldPath = (structure: DataStructure[], id: string) => {
  let value = ''
  structure?.forEach((item) => {
    item?.items?.forEach((i) => {
      if (i.id === id)
        value = item.name + ":" + i.fieldPath || ''
    })
  })
  return value
}
