import {findIndex, isArray, isNumber} from "lodash";
import {ContentState, CubeOptions} from "@/app/types/content";
import {Chapter} from "@/app/types/types";

export type PurchaseSetting = {
  energyCube?: number,
  purchaseRequired?: boolean
  waitForFree?: boolean,
  listChanged?: string[]
  changed?: boolean
}

export interface ChapterWithPurChaseSetting extends Chapter {
  purchaseSetting?: PurchaseSetting
}

const chapterPurchaseSetting = (chapters: Array<Chapter>, options: CubeOptions) => {
  let result : Array<ChapterWithPurChaseSetting> = chapters
  if (!options || !chapters?.length) {
    return result
  }
  let total = chapters.length
  let purchaseSetting = {}
  // check basic setting
  if (options.basic.purchaseAll) {
    purchaseSetting = {
      energyCube: options.cube || 0,
      purchaseRequired: true,
      waitForFree: false,
      listChanged: options.chapter?.listChanged,
      changed: options.chapter?.changed
    }
  }
  if (options.basic.freeAll) {
    purchaseSetting = {
      purchaseRequired: false,
      waitForFree: false,
      listChanged: options.chapter?.listChanged,
      changed: options.chapter?.changed
    }
  }
  if (options.basic.waitForFree) {
    purchaseSetting = {
      waitForFree: true,
      listChanged: options.chapter?.listChanged,
      changed: options.chapter?.changed
    }
  }
  result = chapters.map(item => ({
    ...item,
    purchaseSetting
  }))
  // check params custom
  if (isArray(options.chapter.waitForFree) && isNumber(options.chapter.waitForFree[0]) && isNumber(options.chapter.waitForFree[1]) && options.chapter.waitForFree[0] <= options.chapter.waitForFree[1]) {
    const from = options.chapter.waitForFree[0]
    const to = options.chapter.waitForFree[1]
    for (let i = from; i <= to; i++) {
      let idx = findIndex(result, {chapterIndex: i - 1})
      if (idx !== -1)
        result[idx] = {
          ...result[idx],
          purchaseSetting: {
            waitForFree: true,
            listChanged: options.chapter?.listChanged,
            changed: options.chapter?.changed
          }
        }
    }
  }
  if (options.chapter.purchase) {
    const from = total > options.chapter.purchase ? total - options.chapter.purchase : 0
    for (let i = from; i < total; i++) {
      let idx = findIndex(result, {chapterIndex: i});
      if (idx !== -1)
        result[idx] = {
          ...result[idx],
          purchaseSetting: {
            energyCube: options.cube || 0,
            purchaseRequired: true,
            listChanged: options.chapter?.listChanged,
            changed: options.chapter?.changed
          }
        }
    }
  }
  if (isArray(options.chapter.free) && isNumber(options.chapter.free[0]) && isNumber(options.chapter.free[1]) && options.chapter.free[1] >= options.chapter.free[0]) {
    const from = options.chapter.free[0]
    const to = options.chapter.free[1]
    for (let i = from; i <= to; i++) {
      let idx = findIndex(result, {chapterIndex: i - 1});
      if (idx !== -1) {
        result[idx] = {
          ...result[idx],
          purchaseSetting: {
            waitForFree: false,
            purchaseRequired: false,
            listChanged: options.chapter?.listChanged,
            changed: options.chapter?.changed
          }
        }
      }
    }
  }
  return result
}

export const changeStateValueSetting = (field: string, value: any, state: ContentState, chapters: Chapter[]) => {
  let _value: any = value;
  if(field === 'freeData' || field === 'waitForFreeData') {
    if(value[0] > value[1]) {
      if(value[1] < state[field][1]) {
        _value = [value[1], value[1]];
      } else if(value[0] > state[field][0]) {
        _value = [value[0], value[0]];
      }
    }

    if(_value[1] > chapters.length) {
      if(_value[1] < state[field][1]){
        _value = [_value[0], _value[1]];
      } else if(_value[0] < _value[1]) {
        _value = [_value[0], state[field][1]];
      } else {
        return null;
      }
    }
  }

  if(field === 'purchaseData') {
    if(value > chapters.length && value >= state[field]) {
      return null;
    }
  }

  return _value;
}

export default chapterPurchaseSetting
