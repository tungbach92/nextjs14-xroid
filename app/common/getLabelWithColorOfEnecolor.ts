import {Enecolor16Image, Enecolor4Image} from "@/app/common/colorData";

export const getLabelWithColorOfEnecolor = (output_type: string, name: string) => {
  let color = "";
  let label = "";
  switch (output_type) {
    case 'enecolor_4_rank' :
      Enecolor4Image.forEach(item => {
        if (item.name === name) {
          color = item.color;
          label = item.label;
        }
      })
      break
    case 'enecolor_16_rank' :
      Enecolor16Image.forEach(item => {
        if (item.name === name) {
          color = item.color;
          label = item.label;
        }
      })
      break
  }
  return {color, label};
}
