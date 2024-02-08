import {Enecolor16Image, Enecolor16ImageText, Enecolor4Image, Enecolor4ImageText} from "@/app/common/colorData";
import {GroupImg, GroupTextV2} from "@/app/types/block";

export const rerenderOutputGroupsTextEnecolor = (outputType: string, groupText: GroupTextV2[]): GroupTextV2[] => {
  let newData: GroupTextV2[] = [];
  groupText?.forEach((item: any) => {
    let newGroup: string[] = [];
    if (outputType === "enecolor_16_rank") {
      Enecolor16ImageText.forEach((i) => {
        newGroup.push(item?.groups[i.stt - 1] ?? '')
      })
    } else if (outputType === "enecolor_4_rank") {
      Enecolor4ImageText.forEach((i) => {
        newGroup.push(item?.groups[i.stt - 1] ?? '')
      })
    } else {
      newGroup = item.groups;
    }
    newData.push({...item, groups: newGroup});
  })
  return newData;
}

export const rerenderInputGroupsTextEnecolor = (outputType: string, groupText: GroupTextV2[]): GroupTextV2[] => {
  let newData: GroupTextV2[] = [];
  groupText?.forEach((item) => {
    let newGroup: string[] = [];
    if (outputType === "enecolor_16_rank") {
      Enecolor16ImageText?.forEach((i, index) => {
        newGroup[i.stt - 1] = item?.groups[index] ?? ''
      })
    } else if (outputType === "enecolor_4_rank") {
      Enecolor4ImageText?.forEach((i, index) => {
        newGroup[i.stt - 1] = item?.groups[index] ?? ''
      })
    } else {
      newGroup = item.groups;
    }
    newData.push({...item, groups: newGroup});
  })
  return newData;
}

export const rerenderOutputGroupsImageEnecolor = (outputType: string, groupImg: GroupImg[]): GroupImg[] => {
  let newGroupImg: GroupImg[] = [];
  if (outputType === "enecolor_16_rank") {
    Enecolor16Image.forEach((i) => {
      newGroupImg.push(groupImg[groupImg.findIndex(it => it.name === i.name)])
    })
  } else if (outputType === "enecolor_4_rank") {
    Enecolor4Image.forEach((i) => {
      newGroupImg.push(groupImg[groupImg.findIndex(it => it.name === i.name)])
    })
  } else {
    newGroupImg = groupImg;
  }
  return newGroupImg;
}
