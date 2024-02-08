import {isNil} from "lodash";
import {getId} from "@/app/common/getId";
import {newBlockData} from "@/app/common/newBlockData";
import {
  ENECOLOR_RANK_IMG,
  ENECOLOR_RANK_IMG_V2,
  ENECOLOR_RANK_TEXT,
  ENECOLOR_RANK_TEXT_V2,
  EXIT_IMAGE,
  INPUT_ENECOLOR_IMAGE,
  INPUT_ENECOLOR_TEXT,
  MULTI_PROMPT_INPUT,
  MULTI_PROMPT_INPUT_ANSWER,
  MULTI_PROMPT_INPUT_V2,
  MULTI_PROMPT_INPUT_WITHOUT_CHAR,
  MULTI_PROMPT_INPUT_WITHOUT_CHAR_V2,
  MULTI_PROMPT_WITHOUT_CHAR_ANSWER,
  NO_VARIABLE_TEXT,
  PROMPT_INPUT,
  PROMPT_INPUT_V2,
  PROMPT_INPUT_WITHOUT_CHAR,
  PROMPT_INPUT_WITHOUT_CHAR_V2,
  PROMPT_V2,
  PROMPT_WITHOUT_CHAR_V2,
  QA_DOCS_BLOCK,
  START_IMAGE,
  TEXT,
  TEXT_V2,
  UROID_CHARPROMPT_FOOTER,
  UROID_CHARPROMPT_HEADER,
  UROID_DEFAULT_IMAGE_CHOICE,
  UROID_DEFAULT_IMAGE_RANDOM,
  UROID_DEFAULTIMAGE,
  UROID_DEFAULTVOICE,
  UROID_DES,
  UROID_NAME,
  UROID_THUMB,
  VIDEO,
  VIMEO,
  YOUTUBE
} from "@/app/configs/constants";
import React, {MutableRefObject} from "react";
import {rerenderOutputGroupsTextEnecolor} from "@/app/utils/blockEnecolor";
import {toast} from "react-toastify";
import {CharacterBlock} from "@/app/types/types";
import {
  Block,
  BlockAssociateAI,
  BlockEneColorRankImg,
  BlockEnecolorRankText,
  BlockInputEnecolorImage,
  BlockInputEnecolorText,
  BlockText,
  DataEneColorRankImg,
  DataEnecolorRankText,
  DataInput,
  DataPrompt,
  DataPromptInput,
  SaveSetting
} from "@/app/types/block";
import {VirtuosoHandle} from "react-virtuoso";

interface Props {
  type: string,
  url?: string,
  selectedTextSetting: SaveSetting,
  blocks: Block[],
  blockIndex: number | undefined,
  setDummyAdd: React.Dispatch<React.SetStateAction<number>>,
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>,
  actionCharacter: Array<CharacterBlock>,
  mapDataToAddIndex: (newBlocks: Block[]) => Block[],
  selectedEneColorRankImgSetting?: SaveSetting,
  setSelectedEneColorRankImgSetting?: React.Dispatch<React.SetStateAction<{}>>,
  setSelectedEneColorRankTextSetting?: React.Dispatch<React.SetStateAction<{}>>,
  selectedEneColorRankTextSetting?: SaveSetting,
  blockTexts?: BlockText[],
  addNewBlocks?: Block[]
  setAddNewBlocks?: React.Dispatch<React.SetStateAction<Block[]>>,
  checkTimeTrigger?: boolean
  textInput?: DataInput
  blockInputEnecolor?: BlockInputEnecolorText | BlockInputEnecolorImage
  blockEnecolor?: BlockEnecolorRankText | BlockEneColorRankImg
  qaBlock?: BlockAssociateAI
  imageBlockIndex?: number
  virtuosoRef?: MutableRefObject<VirtuosoHandle>
}

export const handleAddBlock = (props: Props) => {
  const {
    type,
    url,
    selectedTextSetting,
    blocks,
    blockIndex,
    setDummyAdd,
    setBlocks,
    actionCharacter,
    mapDataToAddIndex,
    selectedEneColorRankImgSetting,
    setSelectedEneColorRankImgSetting,
    setSelectedEneColorRankTextSetting,
    selectedEneColorRankTextSetting,
    blockTexts,
    addNewBlocks,
    setAddNewBlocks,
    checkTimeTrigger = false,
    textInput,
    blockInputEnecolor = null,
    blockEnecolor = null,
    qaBlock = null,
    imageBlockIndex,
    virtuosoRef
  } = props
  const newBlocks = [...blocks]
  const setPromptInputData = (selectedTextSetting) => {
    let selected = {...selectedTextSetting}
    const dataGroupText: DataPromptInput = selected.data
    const groupsText = dataGroupText?.groupsText
    selected = {
      ...selected,
      data: {
        ...selected.data,
        groupsText: rerenderOutputGroupsTextEnecolor(selected?.data.output_type, groupsText)
      }
    };
    delete selected.title
    delete selected.userId
    if (blockIndex == undefined) {
      setDummyAdd(prev => prev + 1)
      setBlocks([
        ...blocks,
        {
          ...selected,
          id: getId("block_", 10),
          index: null,
          isShowLog: true,
          characters: actionCharacter,
        }
      ]);
    } else {
      setAddNewBlocks([...addNewBlocks, {
        ...selected,
        id: getId("block_", 10),
        index: null,
        isShowLog: true,
        characters: actionCharacter,
      }])
    }
  }

  const setPromptData = (selectedTextSetting) => {
    let selected = {...selectedTextSetting}
    const dataGroupText: DataPrompt = selected.data
    const groupsText = dataGroupText?.groupsText
    selected = {
      ...selected,
      data: {
        ...selected.data,
        groupsText: rerenderOutputGroupsTextEnecolor(selected?.data.output_type, groupsText)
      }
    };
    delete selected.title
    delete selected.userId
    if (blockIndex == undefined) {
      setDummyAdd(prev => prev + 1)
      setBlocks([
        ...blocks,
        {
          ...selected,
          id: getId("block_", 10),
          index: null,
          isShowLog: false,
          characters: actionCharacter,
        }
      ]);
    } else {
      setAddNewBlocks([...addNewBlocks, {
        ...selected,
        id: getId("block_", 10),
        index: null,
        isShowLog: false,
        characters: actionCharacter,
      }])
    }
  }
  switch (type) {
    case 'addAllText':
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks, ...blockTexts].flat());
      } else {
        newBlocks.splice(blockIndex + 1, 0, ...blockTexts)
        setBlocks(mapDataToAddIndex(newBlocks))
      }
      break;
    case 'addOneText' :
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks, blockTexts].flat());
      } else {
        newBlocks.splice(blockIndex + 1, 0, ...blockTexts)
        setBlocks(mapDataToAddIndex(newBlocks))
      }
      break;
    case TEXT :
    case TEXT_V2:
    case NO_VARIABLE_TEXT:
      if (!isNil(selectedTextSetting) && Object.keys(selectedTextSetting).length > 0) {
        let selected = {...selectedTextSetting}
        const dataGroupText: DataEnecolorRankText = selected.data
        const groupText = dataGroupText?.groupsText
        selected = {
          ...selected,
          data: {
            ...selected.data,
            groupsText: rerenderOutputGroupsTextEnecolor(selected?.data.output_type, groupText)
          }
        };
        delete selected.title
        delete selected.userId
        if (blockIndex == undefined) {
          setDummyAdd(prev => prev + 1)
          setBlocks([
            ...blocks,
            {
              ...selected,
              id: getId("block_", 10),
              index: null,
              isShowLog: false,
              characters: actionCharacter,
            }
          ]);
        } else {
          setAddNewBlocks([...addNewBlocks, {
            ...selected,
            id: getId("block_", 10),
            index: null,
            isShowLog: false,
            characters: actionCharacter,
          }])
        }
        break
      }
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks,
          newBlockData(type, actionCharacter)])
      } else {
        setAddNewBlocks([...addNewBlocks,
          newBlockData(type, actionCharacter)])
      }
      break;
    case 'image' :
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks,
          newBlockData('image', actionCharacter, url)
        ]);
      } else {
        setAddNewBlocks([...addNewBlocks,
          newBlockData('image', actionCharacter, url)
        ])
      }
      break;
    case YOUTUBE :
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks, newBlockData(YOUTUBE, actionCharacter)]);
      } else {
        setAddNewBlocks([...addNewBlocks, newBlockData(YOUTUBE, actionCharacter)])
      }
      break;
    case VIMEO :
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks, newBlockData(VIMEO, actionCharacter)]);
      } else {
        setAddNewBlocks([...addNewBlocks, newBlockData(VIMEO, actionCharacter)])
      }
      break;
    case VIDEO :
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks, newBlockData(VIDEO, actionCharacter)]);
      } else {
        setAddNewBlocks([...addNewBlocks, newBlockData(VIDEO, actionCharacter)])
      }
      break;
    case START_IMAGE:
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks, newBlockData('start_image', actionCharacter)]);
      } else {
        setAddNewBlocks([...addNewBlocks, newBlockData('start_image', actionCharacter)])
      }
      break;
    case EXIT_IMAGE:
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks, newBlockData('exit_image', actionCharacter)]);
      } else {
        setAddNewBlocks([...addNewBlocks, newBlockData('exit_image', actionCharacter)])
      }
      break;
    case  ENECOLOR_RANK_IMG :
      if (!isNil(selectedEneColorRankImgSetting) && Object.keys(selectedEneColorRankImgSetting).length > 0) {
        let selected = {...selectedEneColorRankImgSetting}
        const dataGroupImg: DataEneColorRankImg = selected.data
        const groupsImg = dataGroupImg.groupsImg
        selected = {
          ...selected,
          data: {
            ...selected.data,
            groupsImg: groupsImg
          }
        };
        delete selected.title
        delete selected.userId
        if (blockIndex == undefined) {
          setDummyAdd(prev => prev + 1)
          setBlocks([
            ...blocks,
            {
              ...selected,
              id: getId("block_", 10),
              index: null,
              isShowLog: false,
              characters: actionCharacter,
            }]);
        } else {
          setAddNewBlocks([...addNewBlocks, {
            ...selected,
            id: getId("block_", 10),
            index: null,
            isShowLog: false,
            characters: actionCharacter,
          }])
        }
        setSelectedEneColorRankImgSetting(null)
        break
      }
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([
          ...blocks, newBlockData(ENECOLOR_RANK_IMG, actionCharacter)
        ]);
      } else {
        setAddNewBlocks([...addNewBlocks, newBlockData(ENECOLOR_RANK_IMG, actionCharacter)])
      }
      break;
    case  ENECOLOR_RANK_IMG_V2 :
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([
          ...blocks, {...blockEnecolor, characters: actionCharacter}
        ]);
      } else {
        setAddNewBlocks([...addNewBlocks, {...blockEnecolor, characters: actionCharacter}])
      }
      break;
    case ENECOLOR_RANK_TEXT :
      let rankTextActionCharacter = [];
      actionCharacter.forEach((item, index) => {
        rankTextActionCharacter.push({...item, isAction: actionCharacter?.[index]?.isAction})
      })
      if (!isNil(selectedEneColorRankTextSetting) && Object.keys(selectedEneColorRankTextSetting).length > 0) {
        let selected = {...selectedEneColorRankTextSetting}
        const dataGroupText: DataEnecolorRankText = selected.data
        const groupsText = dataGroupText?.groupsText
        selected = {
          ...selected,
          data: {
            ...selected.data,
            groupsText: groupsText
          }
        };
        delete selected.title
        delete selected.userId
        if (blockIndex == undefined) {
          setDummyAdd(prev => prev + 1)
          setBlocks([
            ...blocks,
            {
              ...selected,
              id: getId("block_", 10),
              characters: rankTextActionCharacter,
              index: null,
              isShowLog: false
            }
          ]);
        } else {
          setAddNewBlocks([...addNewBlocks, {
            ...selected,
            id: getId("block_", 10),
            characters: rankTextActionCharacter,
            index: null,
            isShowLog: false
          }])
        }
        setSelectedEneColorRankTextSetting(null)
        break
      }
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks, newBlockData(ENECOLOR_RANK_TEXT, actionCharacter)])
      } else {
        setAddNewBlocks([...addNewBlocks, newBlockData(ENECOLOR_RANK_TEXT, actionCharacter)])
      }
      break;
    case ENECOLOR_RANK_TEXT_V2 :
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([
          ...blocks, {...blockEnecolor, characters: actionCharacter}
        ]);
      } else {
        setAddNewBlocks([...addNewBlocks, {...blockEnecolor, characters: actionCharacter}])
      }
      break;
    case 'graph_4':
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks, newBlockData('graph_4', actionCharacter)])
      } else {
        setAddNewBlocks([...addNewBlocks, newBlockData('graph_4', actionCharacter)])
      }
      break;
    case 'graph':
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks, newBlockData('graph', actionCharacter)])
      } else {
        setAddNewBlocks([...addNewBlocks, newBlockData('graph', actionCharacter)])
      }
      break;
    case 'textInput' :
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks, newBlockData('textInput', actionCharacter, '', null, '', textInput)]);
      } else {
        setAddNewBlocks([...addNewBlocks, newBlockData('textInput', actionCharacter)])
      }
      break;
    case 'numberInput' :
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks, newBlockData('numberInput', actionCharacter)])
      } else {
        setAddNewBlocks([...addNewBlocks, newBlockData('numberInput', actionCharacter)])
      }
      break;
    case 'choice' :
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks, newBlockData('choice', actionCharacter)])
      } else {
        setAddNewBlocks([...addNewBlocks, newBlockData('choice', actionCharacter)])
      }
      break;
    case 'if':
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks, newBlockData('if_start',
          actionCharacter), newBlockData('if_end', actionCharacter)])
      } else {
        setAddNewBlocks([...addNewBlocks,
          newBlockData('if_start', actionCharacter),
          newBlockData('if_end', actionCharacter)])
      }
      break;
    case 'for' :
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks, newBlockData("for_start", actionCharacter),
          newBlockData("for_end", actionCharacter)])
      } else {
        setAddNewBlocks([...addNewBlocks,
          newBlockData('for_start', actionCharacter),
          newBlockData('for_end', actionCharacter)])
      }
      break;
    case 'record' :
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks,
          newBlockData("record_start", actionCharacter),
          newBlockData("record_end", actionCharacter)])
      } else {
        setAddNewBlocks([...addNewBlocks,
          newBlockData('record_start', actionCharacter),
          newBlockData('record_end', actionCharacter)])
      }
      break;
    case 'delay' :
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks, newBlockData("delay", actionCharacter)])
      } else {
        setAddNewBlocks([...addNewBlocks, newBlockData('delay', actionCharacter)])
      }
      break;
    case 'motion' :
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([
          ...blocks,
          newBlockData("motion", actionCharacter)
        ])
      } else {
        setAddNewBlocks([...addNewBlocks, newBlockData('motion', actionCharacter)])
      }
      break;
    case 'slide' :
      let slide = newBlockData("slide", actionCharacter)
      // let showSlide = newBlockData("show_slide", actionCharacter)
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks, slide])
      } else {
        setAddNewBlocks([...addNewBlocks, slide])
      }
      break;
    case PROMPT_INPUT:
    case PROMPT_INPUT_V2:
      if (!isNil(selectedTextSetting) && Object.keys(selectedTextSetting).length > 0) {
        setPromptInputData(selectedTextSetting)
        break
      }
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks,
          newBlockData(type, actionCharacter),
          newBlockData("chatGPTAnswer", actionCharacter)])
      } else {
        setAddNewBlocks([...addNewBlocks,
          newBlockData(type, actionCharacter),
          newBlockData('chatGPTAnswer', actionCharacter)])
      }
      break;
    case MULTI_PROMPT_INPUT:
    case MULTI_PROMPT_INPUT_V2:
      if (!isNil(selectedTextSetting) && Object.keys(selectedTextSetting).length > 0) {
        setPromptInputData(selectedTextSetting)
        break
      }
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks,
          newBlockData(type, actionCharacter),
          newBlockData(MULTI_PROMPT_INPUT_ANSWER, actionCharacter)
        ])
      } else {
        setAddNewBlocks([...addNewBlocks,
          newBlockData(type, actionCharacter),
          newBlockData(MULTI_PROMPT_INPUT_ANSWER, actionCharacter)
        ])
      }
      break;
    case PROMPT_INPUT_WITHOUT_CHAR:
    case PROMPT_INPUT_WITHOUT_CHAR_V2:
      if (!isNil(selectedTextSetting) && Object.keys(selectedTextSetting).length > 0) {
        setPromptInputData(selectedTextSetting)
        break
      }
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks,
          newBlockData(type, actionCharacter),
          newBlockData("chatGPTAnswer", actionCharacter)
        ])
      } else {
        setAddNewBlocks([...addNewBlocks,
          newBlockData(type, actionCharacter),
          newBlockData('chatGPTAnswer', actionCharacter)
        ])
      }
      break;
    case MULTI_PROMPT_INPUT_WITHOUT_CHAR:
    case MULTI_PROMPT_INPUT_WITHOUT_CHAR_V2:
      if (!isNil(selectedTextSetting) && Object.keys(selectedTextSetting).length > 0) {
        setPromptInputData(selectedTextSetting)
        break
      }
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks,
          newBlockData(type, actionCharacter),
          newBlockData(MULTI_PROMPT_WITHOUT_CHAR_ANSWER, actionCharacter)
        ])
      } else {
        setAddNewBlocks([...addNewBlocks,
          newBlockData(type, actionCharacter),
          newBlockData(MULTI_PROMPT_WITHOUT_CHAR_ANSWER, actionCharacter)
        ])
      }
      break;
    case PROMPT_V2:
      // if (!isNil(selectedTextSetting) && Object.keys(selectedTextSetting).length > 0) {
      //   setPromptData(selectedTextSetting)
      //   break
      // }
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks,
          newBlockData(type, actionCharacter),
          newBlockData("chatGPTAnswer", actionCharacter)])
      } else {
        setAddNewBlocks([...addNewBlocks,
          newBlockData(type, actionCharacter),
          newBlockData('chatGPTAnswer', actionCharacter)])
      }
      break;
    case PROMPT_WITHOUT_CHAR_V2:
      // if (!isNil(selectedTextSetting) && Object.keys(selectedTextSetting).length > 0) {
      //   setPromptData(selectedTextSetting)
      //   break
      // }
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks,
          newBlockData(PROMPT_WITHOUT_CHAR_V2, actionCharacter),
          newBlockData("chatGPTAnswer", actionCharacter)])
      } else {
        setAddNewBlocks([...addNewBlocks,
          newBlockData(PROMPT_WITHOUT_CHAR_V2, actionCharacter),
          newBlockData('chatGPTAnswer', actionCharacter)])
      }
      break;
    case 'chatGPT_Prompt' :
      if (!isNil(selectedTextSetting) && Object.keys(selectedTextSetting).length > 0) {
        setPromptData(selectedTextSetting)
        break
      }
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks,
          newBlockData("prompt", actionCharacter),
          newBlockData("chatGPTAnswer", actionCharacter)])
      } else {
        setAddNewBlocks([...addNewBlocks,
          newBlockData('prompt', actionCharacter),
          newBlockData('chatGPTAnswer', actionCharacter)])
      }
      break;
    case 'withoutChar_prompt':
      if (!isNil(selectedTextSetting) && Object.keys(selectedTextSetting).length > 0) {
        setPromptData(selectedTextSetting)
        break
      }
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks,
          newBlockData("withoutChar_prompt", actionCharacter),
          newBlockData("chatGPTAnswer", actionCharacter)
        ])
      } else {
        setAddNewBlocks([...addNewBlocks,
          newBlockData('withoutChar_prompt', actionCharacter),
          newBlockData('chatGPTAnswer', actionCharacter)])
      }
      break;
    case 'popup':
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([
          ...blocks, newBlockData("popup", actionCharacter)])
      } else {
        setAddNewBlocks([...addNewBlocks, newBlockData('popup', actionCharacter)])
      }
      break;
    case 'control':
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([
          ...blocks, newBlockData("control", actionCharacter)])
      } else {
        setAddNewBlocks([...addNewBlocks, newBlockData('control', actionCharacter)])
      }
      break;
    case 'timer':
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([
          ...blocks,
          newBlockData("timer_start", actionCharacter),
          newBlockData('timer_end', actionCharacter)
        ])
      } else {
        if (checkTimeTrigger) {
          toast.error('タイマスタ-トブロックとエンドブロックの間にタイマトを作成できません。')
          return
        } else {
          setAddNewBlocks([...addNewBlocks,
            newBlockData('timer_start', actionCharacter),
            newBlockData('timer_end', actionCharacter)
          ])
        }
      }
      break;
    case 'time_trigger':
      if (blockIndex == undefined || !checkTimeTrigger) {
        setDummyAdd(prev => prev + 1)
        setBlocks([
          ...blocks,
          // newBlockData("time_trigger", actionCharacter)
        ])
        toast.error('タイマスタ-トブロックとエンドブロックの間にタイマトリガーブロックを作成してください。')
      } else {
        setAddNewBlocks([...addNewBlocks, newBlockData('time_trigger', actionCharacter)])
      }
      break;
    case 'versionUserChoice' :
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks, newBlockData("versionUserChoice", actionCharacter)])
      } else {
        setAddNewBlocks([...addNewBlocks, newBlockData('versionUserChoice', actionCharacter)])
      }
      break;
    case 'versionSetting' :
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks, newBlockData("versionSetting", actionCharacter)])
      } else {
        setAddNewBlocks([...addNewBlocks, newBlockData('versionSetting', actionCharacter)])
      }
      break;
    case 'continuousChat' :
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks, newBlockData("continuousChat", actionCharacter)])
      } else {
        setAddNewBlocks([...addNewBlocks, newBlockData('continuousChat', actionCharacter)])
      }
      break;
    case UROID_NAME :
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks, newBlockData(UROID_NAME, actionCharacter)])
      } else {
        setAddNewBlocks([...addNewBlocks, newBlockData(UROID_NAME, actionCharacter)])
      }
      break;
    case UROID_DES :
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks, newBlockData(UROID_DES, actionCharacter)])
      } else {
        setAddNewBlocks([...addNewBlocks, newBlockData(UROID_DES, actionCharacter)])
      }
      break;
    case UROID_THUMB :
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks, newBlockData(UROID_THUMB, actionCharacter)])
      } else {
        setAddNewBlocks([...addNewBlocks, newBlockData(UROID_THUMB, actionCharacter)])
      }
      break;
    case UROID_DEFAULTIMAGE :
      if (blockIndex == undefined) {
        if (imageBlockIndex) {
          blocks.splice(imageBlockIndex, 1, newBlockData(UROID_DEFAULTIMAGE, actionCharacter))
          setBlocks(blocks)
          virtuosoRef?.current?.scrollToIndex({
            index: imageBlockIndex - 1,
            align: "start",
            behavior: "auto"
          });
        } else {
          setDummyAdd(prev => prev + 1)
          setBlocks([...blocks, newBlockData(UROID_DEFAULTIMAGE, actionCharacter)])
        }
      } else setAddNewBlocks([...addNewBlocks, newBlockData(UROID_DEFAULTIMAGE, actionCharacter)])
      break;
    case UROID_DEFAULT_IMAGE_CHOICE :
      if (blockIndex == undefined) {
        if (imageBlockIndex) {
          blocks.splice(imageBlockIndex, 1, newBlockData(UROID_DEFAULT_IMAGE_CHOICE, actionCharacter))
          setBlocks(blocks)
          virtuosoRef?.current?.scrollToIndex({
            index: imageBlockIndex - 1,
            align: "start",
            behavior: "auto"
          });
        } else {
          setDummyAdd(prev => prev + 1)
          setBlocks([...blocks, newBlockData(UROID_DEFAULT_IMAGE_CHOICE, actionCharacter)])
        }
      } else setAddNewBlocks([...addNewBlocks, newBlockData(UROID_DEFAULT_IMAGE_CHOICE, actionCharacter)])
      break;
    case UROID_DEFAULT_IMAGE_RANDOM :
      if (blockIndex == undefined) {
        if (imageBlockIndex) {
          blocks.splice(imageBlockIndex, 1, newBlockData(UROID_DEFAULT_IMAGE_RANDOM, actionCharacter))
          setBlocks(blocks)
          virtuosoRef?.current?.scrollToIndex({
            index: imageBlockIndex - 1,
            align: "start",
            behavior: "auto"
          });
        } else {
          setDummyAdd(prev => prev + 1)
          setBlocks([...blocks, newBlockData(UROID_DEFAULT_IMAGE_RANDOM, actionCharacter)])
        }
      } else setAddNewBlocks([...addNewBlocks, newBlockData(UROID_DEFAULT_IMAGE_RANDOM, actionCharacter)])
      break;
    case UROID_DEFAULTVOICE :
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks, newBlockData(UROID_DEFAULTVOICE, actionCharacter)])
      } else {
        setAddNewBlocks([...addNewBlocks, newBlockData(UROID_DEFAULTVOICE, actionCharacter)])
      }
      break;
    case UROID_CHARPROMPT_HEADER :
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks, newBlockData(UROID_CHARPROMPT_HEADER, actionCharacter)])
      } else {
        setAddNewBlocks([...addNewBlocks, newBlockData(UROID_CHARPROMPT_HEADER, actionCharacter)])
      }
      break;
    case UROID_CHARPROMPT_FOOTER :
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks, newBlockData(UROID_CHARPROMPT_FOOTER, actionCharacter)])
      } else {
        setAddNewBlocks([...addNewBlocks, newBlockData(UROID_CHARPROMPT_FOOTER, actionCharacter)])
      }
      break;
    case 'createURoid' :
      setDummyAdd(prev => prev + 1)
      setBlocks([...blocks, newBlockData(UROID_NAME, actionCharacter),
        newBlockData(UROID_DES, actionCharacter),
        newBlockData(UROID_DEFAULT_IMAGE_CHOICE, actionCharacter),
        newBlockData(UROID_THUMB, actionCharacter),
        newBlockData(UROID_DEFAULTVOICE, actionCharacter),
        newBlockData(UROID_CHARPROMPT_HEADER, actionCharacter),
        newBlockData(UROID_CHARPROMPT_FOOTER, actionCharacter)
      ])
      break;
    case INPUT_ENECOLOR_TEXT:
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([
          ...blocks, {...blockInputEnecolor, characters: actionCharacter}])
      } else {
        setAddNewBlocks([...addNewBlocks, {...blockInputEnecolor, characters: actionCharacter}])
      }
      break;
    case INPUT_ENECOLOR_IMAGE:
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks, {...blockInputEnecolor, characters: actionCharacter}])
      } else {
        setAddNewBlocks([...addNewBlocks, {...blockInputEnecolor, characters: actionCharacter}])
      }
      break;
    case QA_DOCS_BLOCK:
      if (blockIndex == undefined) {
        setDummyAdd(prev => prev + 1)
        setBlocks([...blocks, {...qaBlock, characters: actionCharacter}])
      } else {
        setAddNewBlocks([...addNewBlocks, {...qaBlock, characters: actionCharacter}])
      }
      break;
    default:
      setBlocks([...blocks]);
      break;
  }
}
