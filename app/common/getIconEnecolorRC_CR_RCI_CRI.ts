import {iconImg} from "@/app/components/assets/image/icon";
import {Enecolor} from "@/app/types/block";

const getIconEnecolor4_16 = (x: Enecolor) => {
  if (x.output_type === 'enecolor_4' || x.output_type === 'enecolor_4_rank') return iconImg.enecolor4
  if (x.output_type === 'enecolor_16' || x.output_type === 'enecolor_16_rank') return iconImg.enecolor16
  return iconImg.enecolor4
}

const getIconEnecolorCR_CI = (color) => {
  switch (color) {
    case 'Y':
      return iconImg.enecolorY
    case 'R':
      return iconImg.enecolorR
    case 'G':
      return iconImg.enecolorG
    case 'B':
      return iconImg.enecolorB
    case 'YCS' :
    case'YOS' :
    case'YCG' :
    case'YOG':
      return iconImg.enecolor16_Y
    case 'RCS' :
    case 'ROS' :
    case 'RCG' :
    case 'ROG':
      return iconImg.enecolor16_R
    case 'GCS':
    case 'GOS':
    case 'GCG':
    case 'GOG':
      return iconImg.enecolor16_G
    case 'BCS' :
    case 'BOS' :
    case 'BCG' :
    case 'BOG':
      return iconImg.enecolor16_B
    default:
      return ""
  }
}
export const getIconEnecolorRC_CR_RCI_CRI = (x: Enecolor, isModalEnecolor?: boolean) => {
  //CRI
  if (x?.groupsImg && x?.color && isModalEnecolor) {
    return getIconEnecolor4_16(x)
  }
  if (x?.groupsImg && x?.color && !isModalEnecolor) {
    return getIconEnecolorCR_CI(x?.color)
  }

  //RCI
  if (x?.groupsImg && x?.rank) {
    return iconImg.enecolorImg
  }
  //CR
  if (x?.groupsText && x?.groupsText?.color && isModalEnecolor) {
    return getIconEnecolor4_16(x)
  }
  if (x?.groupsText && x?.groupsText?.color && !isModalEnecolor) {
    return getIconEnecolorCR_CI(x?.groupsText?.color)
  }

  //RC
  if (x?.groupsText && x?.groupsText?.rank) {
    return getIconEnecolor4_16(x)
  }
}
