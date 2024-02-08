import {cloneDeep} from "lodash";
import {
  CHAT_GTP_ANSWER,
  FOR_END,
  FOR_START,
  IF_END,
  IF_START,
  MULTI_PROMPT_INPUT,
  MULTI_PROMPT_INPUT_ANSWER,
  MULTI_PROMPT_INPUT_V2,
  MULTI_PROMPT_INPUT_WITHOUT_CHAR,
  MULTI_PROMPT_INPUT_WITHOUT_CHAR_V2,
  MULTI_PROMPT_WITHOUT_CHAR_ANSWER,
  PROMPT,
  PROMPT_INPUT,
  PROMPT_INPUT_V2,
  PROMPT_INPUT_WITHOUT_CHAR,
  PROMPT_INPUT_WITHOUT_CHAR_V2,
  PROMPT_V2,
  PROMPT_WITHOUT_CHAR,
  PROMPT_WITHOUT_CHAR_V2,
  RECORD_END,
  RECORD_START,
  TIMER_END,
  TIMER_START
} from "@/app/configs/constants";

const deleteStart = (arr: any, index: any, endType: string) => {
  for (let i = index; i < arr.length; i++) {
    if (arr[i]?.type === endType) {
      arr.splice(i, 1)
      break
    }
  }
  arr.splice(index, 1);
}

const deleteEnd = (arr: any, index: any, startType: string) => {
  if (!startType) return arr.splice(index, 1);
  for (let i = index; i >= 0; i--) {
    if (arr[i]?.type === startType) {
      arr.splice(i, 1)
      break
    }
  }
  arr.splice(index - 1, 1);
}

export const onDeleteCouple = (index: any, type: string, blocks, setBlocks) => {
  const arr = cloneDeep(blocks);
  const prevBlock = () => {
    if (index === 0) return null
    if ([PROMPT_INPUT, PROMPT_INPUT_V2, PROMPT, PROMPT_V2, PROMPT_WITHOUT_CHAR, PROMPT_WITHOUT_CHAR_V2, PROMPT_INPUT_WITHOUT_CHAR, PROMPT_INPUT_WITHOUT_CHAR_V2].includes(arr[index - 1]?.type)) return arr[index - 1]
    return null
  }
  switch (type) {
    case PROMPT_INPUT :
    case PROMPT_INPUT_V2 :
    case PROMPT :
    case PROMPT_V2 :
    case PROMPT_WITHOUT_CHAR :
    case PROMPT_WITHOUT_CHAR_V2 :
    case PROMPT_INPUT_WITHOUT_CHAR :
    case PROMPT_INPUT_WITHOUT_CHAR_V2 :
      deleteStart(arr, index, CHAT_GTP_ANSWER)
      break
    case MULTI_PROMPT_INPUT :
    case MULTI_PROMPT_INPUT_V2 :
      deleteStart(arr, index, MULTI_PROMPT_INPUT_ANSWER)
      break
    case MULTI_PROMPT_INPUT_WITHOUT_CHAR :
    case MULTI_PROMPT_INPUT_WITHOUT_CHAR_V2 :
      deleteStart(arr, index, MULTI_PROMPT_WITHOUT_CHAR_ANSWER)
      break
    case CHAT_GTP_ANSWER :
      deleteEnd(arr, index, prevBlock()?.type || null)
      break
    case MULTI_PROMPT_INPUT_ANSWER :
      deleteEnd(arr, index, MULTI_PROMPT_INPUT)
      break
    case MULTI_PROMPT_WITHOUT_CHAR_ANSWER :
      deleteEnd(arr, index, MULTI_PROMPT_INPUT_WITHOUT_CHAR)
    case IF_START:
      deleteStart(arr, index, IF_END)
      break
    case FOR_START:
      deleteStart(arr, index, FOR_END)
      break
    case RECORD_START:
      deleteStart(arr, index, RECORD_END)
      break
    case IF_END:
      deleteEnd(arr, index, IF_START)
      break
    case FOR_END:
      deleteEnd(arr, index, FOR_START)
      break
    case RECORD_END:
      deleteEnd(arr, index, RECORD_START)
      break
    case TIMER_START:
      deleteStart(arr, index, TIMER_END)
      break
    case TIMER_END:
      deleteEnd(arr, index, TIMER_START)
      break
    default:
      break
  }
  const _arr = arr.map((item, index) => {
    return {...item, index: index};
  })
  setBlocks(_arr);
}
