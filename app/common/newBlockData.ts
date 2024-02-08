import {getId} from "@/app/common/getId";
import {
  AllBlockType,
  Block,
  BlockAssociateAI,
  BlockChatGptAnswer,
  BlockChatGptVersionSetting,
  BlockChatGptVersionUserChoice,
  BlockChoice,
  BlockContinuousChat,
  BlockControl,
  BlockDelay,
  BlockEndImg,
  BlockEneColorRankImg,
  BlockEnecolorRankText,
  BlockForEnd,
  BlockForStart,
  BlockGraph,
  BlockIfEnd,
  BlockIfStart,
  BlockImage,
  BlockInput,
  BlockInputEnecolorImage,
  BlockInputEnecolorText,
  BlockMotion,
  BlockPopup,
  BlockPrompt,
  BlockPromptInput,
  BlockRecordEnd,
  BlockRecordStart,
  BlockShowSlide,
  BlockSlide,
  BlockStartImg,
  BlockText,
  BlockTimerEnd,
  BlockTimerStart,
  BlockTimerTrigger,
  BlockUroidCharPromptFooter,
  BlockUroidCharPromptHeader,
  BlockURoidDefaultImage,
  BlockURoidDefaultImageChoice,
  BlockURoidDefaultImageRandom,
  BlockURoidDefaultVoice,
  BlockURoidDescription,
  BlockURoidName,
  BlockURoidThumbnail,
  BlockVideo,
  DataAssociateAI,
  DataChatGptAnswer,
  DataChoice,
  DataContinuousChat,
  DataDelay,
  DataEneColorRankImg,
  DataEnecolorRankText,
  DataFor,
  DataIf,
  DataImage,
  DataInput,
  DataInputEnecolorImage,
  DataInputEnecolorText,
  DataMotion,
  DataPopup,
  DataPrompt,
  DataPromptInput,
  DataSlide,
  DataStartImg,
  DataText,
  DataTimerStart,
  DataTimerTrigger,
  DataUroidCharPromptFooter,
  DataUroidCharPromptHeader,
  DataUroidDefaultImage,
  DataUroidDefaultImageChoice,
  DataUroidDefaultImageRandom,
  DataUroidDefaultVoice,
  DataURoidDescription,
  DataURoidName,
  DataURoidThumbnail,
  DataVersionSetting,
  DataVersionUserChoice,
  DataVideo
} from "@/app/types/block";
import {CharacterBlock} from "@/app/types/types";
import {
  CHAT_GTP_ANSWER,
  ENECOLOR_RANK_IMG,
  ENECOLOR_RANK_IMG_V2,
  ENECOLOR_RANK_TEXT,
  ENECOLOR_RANK_TEXT_V2,
  INPUT_ENECOLOR_IMAGE,
  INPUT_ENECOLOR_TEXT,
  MULTI_PROMPT_INPUT_ANSWER,
  MULTI_PROMPT_INPUT_V2,
  MULTI_PROMPT_INPUT_WITHOUT_CHAR,
  MULTI_PROMPT_INPUT_WITHOUT_CHAR_V2,
  MULTI_PROMPT_WITHOUT_CHAR_ANSWER,
  NO_VARIABLE_TEXT,
  PROMPT_INPUT_V2,
  PROMPT_INPUT_WITHOUT_CHAR,
  PROMPT_INPUT_WITHOUT_CHAR_V2,
  PROMPT_V2,
  PROMPT_WITHOUT_CHAR_V2,
  QA_DOCS_BLOCK,
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

export const newBlockData = (type: string, actionCharacter: CharacterBlock[], url?: string, slideData?: DataSlide, showSlideId?: string, textInput?: DataInput): AllBlockType => {
  const findVoice = actionCharacter.find((c: CharacterBlock) => c.isVoice)
  const block: Block = {
    id: '',
    index: null,
    audioUrl: '',
    audioName: '',
    previewAudioUrl: '',
    imageUrl: '',
    isDeleted: false,
    characters: actionCharacter,
    isShowLog: false,
    delayTime: 1,
    isHidden: false,
  }
  const characterForPromptInput = actionCharacter?.map(c => ({...c, isVoice: false}))
  switch (type) {
    case TEXT:
    case TEXT_V2:
      return {
        ...block,
        type: type,
        id: getId("block_", 10),
        data: {
          output_type: "text",
          groupsText: [],
          groupsStruct: [],
          message: {
            english: '',
            japanese: '',
            japaneseMp3: ''
          },
        } satisfies DataText
      } satisfies BlockText
    case NO_VARIABLE_TEXT:
      return {
        ...block,
        type: NO_VARIABLE_TEXT,
        id: getId("block_", 10),
        data: {
          output_type: "text",
          groupsText: [],
          groupsStruct: [],
          message: {
            english: '',
            japanese: '',
            japaneseMp3: ''
          },
        } satisfies DataText
      } satisfies BlockText
    case PROMPT_V2:
    case PROMPT_WITHOUT_CHAR_V2 :
      return {
        ...block,
        type,
        id: getId("block_", 10),
        data: {
          output_type: "text",
          groupsText: [],
          groupsStruct: [],
          adminPrompt1: '',
          adminPrompt2: '',
          characterPrompt1: findVoice?.characterPrompt1 ?? '',
          characterPrompt2: findVoice?.characterPrompt2 ?? '',
          userInput: '',
          isNotShowForUser: false
        } satisfies DataPrompt
      } satisfies BlockPrompt
    case "prompt":
    case 'withoutChar_prompt' :
      return {
        ...block,
        type: `${type === 'prompt' ? 'prompt' : 'withoutChar_prompt'}`,
        id: getId("block_", 10),
        data: {
          output_type: "text",
          groupsText: [],
          groupsStruct: [],
          adminPrompt1: '',
          adminPrompt2: '',
          characterPrompt1: findVoice?.characterPrompt1 ?? '',
          characterPrompt2: findVoice?.characterPrompt2 ?? '',
          userInput: '',
          isNotShowForUser: false
        } satisfies DataPrompt
      } satisfies BlockPrompt
    case 'promptInput':
    case PROMPT_INPUT_V2:
    case PROMPT_INPUT_WITHOUT_CHAR :
    case PROMPT_INPUT_WITHOUT_CHAR_V2:
      return {
        ...block,
        characters: (type === 'promptInput' || type === PROMPT_INPUT_V2) ? block?.characters : characterForPromptInput,
        type: type,
        id: getId("block_", 10),
        isShowLog: true,
        data: {
          output_type: "text",
          groupsText: [],
          groupsStruct: [],
          adminPrompt1: '',
          adminPrompt2: '',
          characterPrompt1: '',
          characterPrompt2: '',
          userInput: '',
          isNotShowForUser: false
        } satisfies DataPromptInput
      } satisfies BlockPromptInput
    case 'multiPromptInput':
    case MULTI_PROMPT_INPUT_V2:
    case MULTI_PROMPT_INPUT_WITHOUT_CHAR:
    case MULTI_PROMPT_INPUT_WITHOUT_CHAR_V2:
      return {
        ...block,
        characters: (type === 'multiPromptInput' || type === MULTI_PROMPT_INPUT_V2) ? block?.characters : characterForPromptInput,
        type,
        id: getId("block_", 10),
        isShowLog: true,
        data: {
          output_type: "text",
          groupsText: [],
          groupsStruct: [],
          adminPrompt1: '',
          adminPrompt2: '',
          characterPrompt1: findVoice?.characterPrompt1 ?? '',
          characterPrompt2: findVoice?.characterPrompt2 ?? '',
          userInput: '',
          isNotShowForUser: false
        } satisfies DataPromptInput
      } satisfies BlockPromptInput
    case"versionSetting":
      return {
        ...block,
        type: 'versionSetting',
        id: getId("block_", 10),
        data: {
          modelId: "",
          parentId: "",
          chatTitle: "",
          dataStructureId: "",
        } satisfies DataVersionSetting
      } satisfies BlockChatGptVersionSetting
    case 'versionUserChoice':
      return {
        ...block,
        type: 'versionUserChoice',
        id: getId("block_", 10),
        data: {
          chatTitle: "",
          modelIds: [],
          parentId: "",
          dataStructureId: "",
        } satisfies DataVersionUserChoice
      } satisfies  BlockChatGptVersionUserChoice
    case 'continuousChat':
      return {
        ...block,
        type: 'continuousChat',
        id: getId("block_", 10),
        data: {
          dataStructureId: "",
          parentId: "",
        } satisfies DataContinuousChat
      } satisfies BlockContinuousChat
    case YOUTUBE:
    case VIMEO:
      return {
        ...block,
        type: type === YOUTUBE ? YOUTUBE : VIMEO,
        id: getId("block_", 10),
        data: {
          url: "",
          autoPlay: false,
          startAt: 0,
          endAt: 0,
          isFullScreen: false
        } satisfies DataVideo
      } satisfies BlockVideo
    case VIDEO:
      return {
        ...block,
        type: VIDEO,
        id: getId("block_", 10),
        data: {
          url: "",
          autoPlay: false,
          startAt: 0,
          endAt: 0,
          isFullScreen: false
        } satisfies DataVideo
      } satisfies BlockVideo
    case "image":
      return {
        ...block,
        type: 'image',
        id: getId("block_", 10),
        data: {
          url: url,
          delay: 0
        } satisfies DataImage,
      } satisfies BlockImage
    case "start_image":
      return {
        ...block,
        type: 'start_image',
        id: getId("block_", 10),
        data: {
          delay: 0,
          seconds: 0,
        } satisfies DataStartImg
      } satisfies BlockStartImg
    case "exit_image":
      return {
        ...block,
        type: 'exit_image',
        id: getId("block_", 10),
        data: null
      } satisfies BlockEndImg
    case ENECOLOR_RANK_IMG:
      return {
        ...block,
        type,
        id: getId("block_", 10),
        data: {
          output_type: "enecolor_4",
          color: 'Y',
          rank: 1,
          groupsImg: [
            {name: "1位", url: ""},
            {name: "2位", url: ""},
            {name: "3位", url: ""},
            {name: "4位", url: ""}
          ]
        } satisfies DataEneColorRankImg,
      } satisfies BlockEneColorRankImg
    case ENECOLOR_RANK_IMG_V2:
      return {
        ...block,
        type,
        id: getId("block_", 10),
        data: {
          enecolorId: ''
        } satisfies DataEneColorRankImg,
      } satisfies BlockEneColorRankImg
    case ENECOLOR_RANK_TEXT:
      return {
        ...block,
        type,
        id: getId("block_", 10),
        data: {
          output_type: "text",
          groupsText: [],
          message: {
            english: '',
            japanese: '',
            japaneseMp3: ''
          }
        } satisfies DataEnecolorRankText
      } satisfies BlockEnecolorRankText
    case ENECOLOR_RANK_TEXT_V2:
      return {
        ...block,
        type,
        id: getId("block_", 10),
        data: {
          output_type: "text",
          groupsText: [],
          message: {
            english: '',
            japanese: '',
            japaneseMp3: ''
          }
        } satisfies DataEnecolorRankText
      } satisfies BlockEnecolorRankText
    case "graph_4":
      return {
        ...block,
        type: 'graph_4',
        id: getId("block_", 10),
        data: null
      } satisfies BlockGraph
    case "graph":
      return {
        ...block,
        type: 'graph',
        id: getId("block_", 10),
        data: null
      } satisfies BlockGraph
    case 'numberInput' :
      return {
        ...block,
        type: 'input',
        id: getId("block_", 10),
        data: {dataInput: "", parentId: "", fieldPath: "", isEneColorBar: false, min: 0, max: 1} satisfies DataInput,
      } satisfies BlockInput;
    case 'textInput' :
      return {
        ...block,
        type: 'input',
        id: getId("block_", 10),
        data: {
          dataInput: textInput?.dataInput ?? '',
          parentId: textInput?.parentId ?? '',
          fieldPath: textInput?.fieldPath ?? '',
          isEneColorBar: false
        } satisfies DataInput,
      } satisfies BlockInput;
    case 'choice' :
      return {
        ...block,
        type: 'choice',
        id: getId("block_", 10),
        data: {
          dataInput: "",
          referenceData: [{
            fixedValue: "",
            dataInput: ""
          }],
          answerNumber: 0,
          parentId: '',
        } satisfies DataChoice,
      } satisfies BlockChoice;
    case 'if_start':
      return {
        ...block,
        type: 'if_start',
        id: getId("block_", 10),
        data: {condition: ""} satisfies DataIf,
      } satisfies BlockIfStart
    case 'if_end':
      return {
        ...block,
        type: 'if_end',
        data: {condition: ""} satisfies DataIf,
        id: getId("block_", 10),
      } satisfies BlockIfEnd
    case 'for_start' :
      return {
        ...block,
        type: 'for_start',
        id: getId("block_", 10),
        data: {condition: "", counter: null} satisfies DataFor,
      } satisfies BlockForStart
    case 'for_end' :
      return {
        ...block,
        type: 'for_end',
        id: getId("block_", 10),
        data: {condition: "", counter: null} satisfies DataFor,
      } satisfies BlockForEnd
    case 'record_start' :
      return {
        ...block,
        type: 'record_start',
        id: getId("block_", 10),
        data: null
      } satisfies BlockRecordStart
    case 'record_end' :
      return {
        ...block,
        type: 'record_end',
        id: getId("block_", 10),
        data: null
      } satisfies BlockRecordEnd
    case 'delay' :
      return {
        ...block,
        type: 'delay',
        id: getId("block_", 10),
        data: {seconds: 0} satisfies DataDelay,
      } satisfies BlockDelay
    case 'motion' :
      return {
        ...block,
        type: 'motion',
        id: getId("block_", 10),
        data: {
          motionType: "そのまま",
          flip: "そのまま",
          location: "そのまま",
          show: "そのまま",
          mentoroid_id: "ena_character_id"
        } satisfies DataMotion,
      } satisfies BlockMotion
    // not used when create block slide
    case 'slide' :
      return {
        ...block,
        type: 'slide',
        id: getId("block_", 10),
        showSlideId,
        data: slideData
      } satisfies BlockSlide;
    case 'show_slide' :
      return {
        ...block,
        type: 'show_slide',
        id: getId("block_", 10),
        showSlideId,
        data: null
      } satisfies BlockShowSlide;
    case CHAT_GTP_ANSWER:
    case MULTI_PROMPT_INPUT_ANSWER :
    case MULTI_PROMPT_WITHOUT_CHAR_ANSWER :
      return {
        ...block,
        type: `${type === CHAT_GTP_ANSWER ? CHAT_GTP_ANSWER :
          type === MULTI_PROMPT_INPUT_ANSWER ? MULTI_PROMPT_INPUT_ANSWER : MULTI_PROMPT_WITHOUT_CHAR_ANSWER}`,
        id: getId("block_", 10),
        data: {promptBlockId: '', isNotShowForUser: false} satisfies DataChatGptAnswer
      } satisfies BlockChatGptAnswer;
    case 'popup':
      return {
        ...block,
        type: 'popup',
        id: getId("block_", 10),
        data: {
          bannerTitle: "",
          url: "",
          bannerDescription: "",
          buttonTitle: "",
          bannerLink: "",
        } satisfies DataPopup,
      } satisfies BlockPopup;
    case 'control':
      return {
        ...block,
        type: 'control',
        id: getId("block_", 10),
        data: null
      } satisfies BlockControl
    case 'timer_start' :
      return {
        ...block,
        type: 'timer_start',
        id: getId("block_", 10),
        data: {
          color: "#E1CB02",
          countType: "countDown",
          groupsHourStructure: {},
          groupsMinuteStructure: {},
          groupsSecondStructure: {},
        } satisfies DataTimerStart,
      } satisfies BlockTimerStart;
    case 'timer_end' :
      return {
        ...block,
        type: 'timer_end',
        id: getId("block_", 10),
        data: null
      } satisfies BlockTimerEnd
    case UROID_NAME :
      return {
        ...block,
        type: UROID_NAME,
        id: getId("block_", 10),
        data: {
          name: '',
          isUserAction: true
        } satisfies DataURoidName,
      } satisfies BlockURoidName;
    case UROID_DES :
      return {
        ...block,
        type: UROID_DES,
        id: getId("block_", 10),
        data: {
          description: '',
          isUserAction: false,
          groupsStruct: [],
          groupsText: [],
        } satisfies DataURoidDescription,
      } satisfies BlockURoidDescription;
    case UROID_THUMB :
      return {
        ...block,
        type: UROID_THUMB,
        id: getId("block_", 10),
        data: {
          thumbUrl: '',
          isUserAction: false,
          isDefaultImage: false
        } satisfies DataURoidThumbnail,
      } satisfies BlockURoidThumbnail;
    case UROID_DEFAULTIMAGE :
      return {
        ...block,
        type: UROID_DEFAULTIMAGE,
        id: getId("block_", 10),
        data: {
          imageUrl: '',
          isUserAction: false
        } satisfies DataUroidDefaultImage,
      } satisfies BlockURoidDefaultImage;
    case UROID_DEFAULT_IMAGE_CHOICE :
      return {
        ...block,
        type: UROID_DEFAULT_IMAGE_CHOICE,
        id: getId("block_", 10),
        data: {
          imageUrls: [],
        } satisfies DataUroidDefaultImageChoice,
      } satisfies BlockURoidDefaultImageChoice;
    case UROID_DEFAULT_IMAGE_RANDOM :
      return {
        ...block,
        type: UROID_DEFAULT_IMAGE_RANDOM,
        id: getId("block_", 10),
        data: {
          count: 0,
          folderId: '',
          isUserAction: false
        } satisfies DataUroidDefaultImageRandom,
      } satisfies BlockURoidDefaultImageRandom;
    case UROID_DEFAULTVOICE :
      return {
        ...block,
        type: UROID_DEFAULTVOICE,
        id: getId("block_", 10),
        data: {
          voiceName: '',
          isUserAction: false
        } satisfies DataUroidDefaultVoice,
      } satisfies BlockURoidDefaultVoice;
    case UROID_CHARPROMPT_HEADER:
      return {
        ...block,
        type: UROID_CHARPROMPT_HEADER,
        id: getId("block_", 10),
        data: {
          characterPrompt: '',
          isUserAction: false,
          isNotShowForUser: true,
          groupsStruct: [],
          groupsText: []
        } satisfies DataUroidCharPromptHeader
      } satisfies BlockUroidCharPromptHeader;
    case 'time_trigger' :
      return {
        ...block,
        type: 'time_trigger',
        id: getId("block_", 10),
        data: {
          groupsHourStructure: {},
          groupsMinuteStructure: {},
          groupsSecondStructure: {},
        } satisfies DataTimerTrigger,
      } satisfies BlockTimerTrigger;
    case UROID_CHARPROMPT_FOOTER:
      return {
        ...block,
        type: UROID_CHARPROMPT_FOOTER,
        id: getId("block_", 10),
        data: {
          characterPrompt: '',
          isUserAction: false,
          isNotShowForUser: true,
          groupsStruct: [],
          groupsText: [],
        } satisfies DataUroidCharPromptFooter
      } satisfies BlockUroidCharPromptFooter;
    case INPUT_ENECOLOR_TEXT:
      return {
        ...block,
        type,
        id: getId("block_", 10),
        data: {
          output_type: "text",
          groupsText: [],
          groupsStruct: [],
          message: {
            english: '',
            japanese: '',
            japaneseMp3: ''
          },
          dataInput: '',
          parentId: '',
        } satisfies DataInputEnecolorText
      } satisfies BlockInputEnecolorText
    case INPUT_ENECOLOR_IMAGE:
      return {
        ...block,
        type,
        id: getId("block_", 10),
        data: {
          dataInput: '',
          parentId: '',
          enecolorId: '',
        } satisfies DataInputEnecolorImage
      } satisfies BlockInputEnecolorImage
    case QA_DOCS_BLOCK:
      return {
        ...block,
        type,
        id: getId("block_", 10),
        data: {
          id: '',
        } satisfies DataAssociateAI
      } satisfies BlockAssociateAI
    default:
      return null;
  }
}
