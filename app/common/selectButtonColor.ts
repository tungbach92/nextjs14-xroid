import {cloneDeep} from "lodash";

export const handleLayer = (e, layers, setLayer) => {
  let newLayer = cloneDeep(layers)
  newLayer.forEach((i: any) => {
    if (i.value === e) {
      i.color = '#F5BA15'
      setLayer(newLayer)
    } else {
      i.color = 'white'
    }
  })
}
