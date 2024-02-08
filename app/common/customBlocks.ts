import {rerenderInputGroupsTextEnecolor} from "@/app/utils/blockEnecolor";
import {cloneDeep} from "lodash";
import {
  Block,
  BlockChatGptAnswer,
  BlockEnecolorRankText,
  BlockPrompt,
  BlockPromptInput,
  BlockText
} from "@/app/types/block";
import {
  CHAT_GTP_ANSWER,
  MULTI_PROMPT_INPUT_ANSWER,
  MULTI_PROMPT_INPUT_V2,
  MULTI_PROMPT_INPUT_WITHOUT_CHAR_V2,
  MULTI_PROMPT_WITHOUT_CHAR_ANSWER,
  PROMPT_INPUT_V2,
  PROMPT_INPUT_WITHOUT_CHAR_V2,
  PROMPT_TYPES,
  PROMPT_V2,
  PROMPT_WITHOUT_CHAR_V2
} from "@/app/configs/constants";

export const customBlocks = (blocks: Block[]): Block[] => {
  if (!blocks?.length) return [];
  const newBlocks = cloneDeep(blocks)

  return newBlocks.map((item, idx) => {

      switch (item.type) {
        case "text":
          const blockText = {...item, index: idx} as BlockText
          const groupText = rerenderInputGroupsTextEnecolor(blockText.data.output_type, blockText?.data.groupsText) ?? []
          return {
            ...blockText,
            data: {
              ...blockText.data,
              groupsText: groupText,
            },
          } satisfies BlockText
        case "prompt":
        case PROMPT_V2:
        case 'withoutChar_prompt' :
        case PROMPT_WITHOUT_CHAR_V2:
          const blockPrompt = {...item, index: idx} as BlockPrompt
          const groupTextPrompt = rerenderInputGroupsTextEnecolor(blockPrompt.data.output_type, blockPrompt?.data.groupsText) ?? []
          delete blockPrompt.data.message
          return {
            ...blockPrompt,
            characters: blockPrompt?.characters?.map(c => {
              if (c.isVoice) {
                if (blockPrompt.type === 'withoutChar_prompt' || blockPrompt.type === PROMPT_WITHOUT_CHAR_V2) {
                  return {
                    ...c,
                    characterPrompt1: '',
                    characterPrompt2: ''
                  }
                } else return {
                  ...c,
                  characterPrompt1: blockPrompt.data.characterPrompt1,
                  characterPrompt2: blockPrompt.data.characterPrompt2
                }
              }
              return c
            }),
            data: {
              ...blockPrompt.data,
              groupsText: groupTextPrompt,
            },
          } satisfies BlockPrompt
        case "promptInput":
        case PROMPT_INPUT_V2:
        case 'multiPromptInput' :
        case MULTI_PROMPT_INPUT_V2:
        case 'withoutChar_promptInput' :
        case PROMPT_INPUT_WITHOUT_CHAR_V2:
        case 'withoutChar_multiPromptInput' :
        case MULTI_PROMPT_INPUT_WITHOUT_CHAR_V2:
          const blockPromptInput = {...item, index: idx} as BlockPromptInput
          const groupTextPromptInput = rerenderInputGroupsTextEnecolor(blockPromptInput.data.output_type, blockPromptInput?.data.groupsText) ?? []
          delete blockPromptInput.data.message
          return {
            ...blockPromptInput,
            characters: blockPromptInput?.characters?.map(c => {
              if (c.isVoice) {
                if (blockPromptInput.type === 'withoutChar_promptInput' || blockPromptInput.type === PROMPT_INPUT_WITHOUT_CHAR_V2 || blockPromptInput.type === MULTI_PROMPT_INPUT_WITHOUT_CHAR_V2 ||
                  blockPromptInput.type === 'withoutChar_multiPromptInput') {
                  return {
                    ...c,
                    characterPrompt1: '',
                    characterPrompt2: ''
                  }
                } else return {
                  ...c,
                  characterPrompt1: blockPromptInput.data.characterPrompt1,
                  characterPrompt2: blockPromptInput.data.characterPrompt2
                }
              }
              return c
            }),
            data: {
              ...blockPromptInput.data,
              groupsText: groupTextPromptInput,
            },
          }

        case "enecolor_rank_text":
          const blockEnecolorRankText = {...item, index: idx} as BlockEnecolorRankText
          let groupsTextEnecolor = rerenderInputGroupsTextEnecolor(blockEnecolorRankText?.data.output_type, blockEnecolorRankText?.data.groupsText)
          return {
            ...blockEnecolorRankText,
            data: {
              ...blockEnecolorRankText.data,
              groupsText: groupsTextEnecolor,
            },
          }
        case CHAT_GTP_ANSWER :
        case MULTI_PROMPT_INPUT_ANSWER :
        case MULTI_PROMPT_WITHOUT_CHAR_ANSWER :
          const blockChatGptAnswer = {...item, index: idx} as BlockChatGptAnswer
          const index = blocks.findIndex((block) => block?.id === item.id);
          if (index <= 0) return blockChatGptAnswer
          const prevBlockType = blocks[index - 1].type;
          const getIsShowLog = () => {
            if (prevBlockType === 'prompt') {
              return blocks[index - 1].isShowLog || false;
            } else {
              return true;
            }
          }
          const nearListPrompt = () => {
            for (let i = index; i >= 0; i--) {
              if (PROMPT_TYPES.includes(blocks[i].type)) {
                return blocks[i].id;
              }
            }
          }
          return {
            ...blockChatGptAnswer,
            type: item.type,
            data: {
              ...blockChatGptAnswer.data,
              promptBlockId: nearListPrompt() || blockChatGptAnswer?.data?.promptBlockId || null,
            },
            isShowLog: getIsShowLog(),
          }
        default:
          return {...item, index: idx}
      }
    }
  )
}
