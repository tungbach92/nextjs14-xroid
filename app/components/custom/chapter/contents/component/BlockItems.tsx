import React from 'react';
import TextTemplate from "@/app/components/custom/chapter/TextTemplate";
import ImageTemplate from "@/app/components/custom/chapter/screnarioContents/ImageTemplate";
import {
  CHAT_GTP_ANSWER,
  ENECOLOR_RANK_IMG,
  ENECOLOR_RANK_IMG_V2,
  ENECOLOR_RANK_TEXT,
  ENECOLOR_RANK_TEXT_V2,
  EXIT_IMAGE,
  FOR_END,
  FOR_START,
  IF_END,
  IF_START,
  INPUT_ENECOLOR_IMAGE,
  INPUT_ENECOLOR_TEXT,
  MULTI_PROMPT_INPUT_ANSWER,
  MULTI_PROMPT_INPUT_V2,
  MULTI_PROMPT_WITHOUT_CHAR_ANSWER,
  NO_VARIABLE_TEXT,
  PROMPT_INPUT_V2,
  PROMPT_INPUT_WITHOUT_CHAR,
  PROMPT_INPUT_WITHOUT_CHAR_V2,
  PROMPT_V2,
  PROMPT_WITHOUT_CHAR_V2, QA_DOCS_BLOCK,
  RECORD_END,
  RECORD_START,
  START_IMAGE,
  TEXT_V2,
  UROID_CHARPROMPT_FOOTER,
  UROID_CHARPROMPT_HEADER,
  UROID_DEFAULT_IMAGE_CHOICE,
  UROID_DEFAULT_IMAGE_RANDOM,
  UROID_DEFAULTIMAGE,
  UROID_DEFAULTVOICE,
  UROID_DES,
  UROID_NAME,
  UROID_THUMB, VIDEO,
  VIMEO,
  YOUTUBE
} from "@/app/configs/constants";
import RangeImageTemplate from "@/app/components/custom/chapter/screnarioContents/RangeImageTemplate";
import EnecolorTemplate from "@/app/components/custom/chapter/screnarioContents/EnecolorTemplate";
import GraphTemplate from "@/app/components/custom/chapter/screnarioContents/GraphTemplate";
import InputTemplate from "@/app/components/custom/chapter/screnarioContents/InputTemplate";
import ChoiceTemplate from "@/app/components/custom/chapter/screnarioContents/ChoiceTemplate";
import If_StartTemplate from "@/app/components/custom/chapter/screnarioContents/If_StartTemplate";
import If_EndTemplate from "@/app/components/custom/chapter/screnarioContents/If_EndTemplate";
import For_StartTemplate from "@/app/components/custom/chapter/screnarioContents/For_StartTemplate";
import For_EndTemplate from "@/app/components/custom/chapter/screnarioContents/For_EndTemplate";
import DelayTemplate from "@/app/components/custom/chapter/screnarioContents/DelayTemplate";
import RecordStartTemplate from "@/app/components/custom/chapter/screnarioContents/Record_StartTemplate";
import Record_EndTemplate from "@/app/components/custom/chapter/screnarioContents/Record_EndTemplate";
import MotionTemplate from "@/app/components/custom/chapter/screnarioContents/MotionTemplate";
import SlideTemplate from "@/app/components/custom/chapter/screnarioContents/SlideTemplate";
import StartShowSlideTemplate from "@/app/components/custom/chapter/screnarioContents/StartShowSlideTemplate";
import {Chapter} from "@/app/types/types";
import PopupTemplate from "@/app/components/custom/chapter/PopupTemplate";
import VideoTemplate from "@/app/components/custom/chapter/screnarioContents/VideoTemplate";
import {ControlTemplate} from "@/app/components/custom/chapter/screnarioContents/ControlTemplate";
import TimerStartTemplate from "@/app/components/custom/chapter/screnarioContents/TimerStartTemplate";
import TimerEndTemplate from "@/app/components/custom/chapter/screnarioContents/TimerEndTemplate";
import ChatGPTAnswer from "@/app/components/custom/chapter/screnarioContents/ChatGPTAnswer";
import Prompt from "@/app/components/custom/chapter/Prompt";
import ChatGPTVersionUserChoice from "@/app/components/custom/chapter/ChatGPTVersionUserChoice";
import ContinuousChat from "@/app/components/custom/chapter/ContinuousChat";
import {
  Block, BlockAssociateAI,
  BlockChatGptAnswer,
  BlockChatGptVersionSetting,
  BlockChatGptVersionUserChoice,
  BlockChoice,
  BlockContinuousChat,
  BlockControl,
  BlockDelay,
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
  BlockVideo
} from "@/app/types/block";
import UroidNameTemplate from "@/app/components/custom/chapter/screnarioContents/UroidNameTemplate";
import UroidDescriptionTemplate from "@/app/components/custom/chapter/screnarioContents/UroidDescriptionTemplate";
import UroidCharPromptHeaderTemplate
  from "@/app/components/custom/chapter/screnarioContents/UroidCharPromptHeaderTemplate";
import UroidThumbTemplate from "@/app/components/custom/chapter/screnarioContents/UroidThumbTemplate";
import UroidDefaultImageTemplate from "@/app/components/custom/chapter/screnarioContents/UroidDefaultImageTemplate";
import UroidDefaultVoiceTemplate from "@/app/components/custom/chapter/screnarioContents/UroidDefaultVoiceTemplate";
import UroidDefaultImageChoiceTemplate
  from "@/app/components/custom/chapter/screnarioContents/UroidDefaultImageChoiceTemplate";
import UroidDefaultImageRandomTemplate
  from "@/app/components/custom/chapter/screnarioContents/UroidDefaultImageRandomTemplate";
import {UroidCommonFunction} from "@/app/components/custom/chapter/screnarioContents/UroidCommonFunction";
import {useAtom, useAtomValue} from "jotai";
import {chapterErrorAtom} from "@/app/store/atom/chapterError.atom";
import {blocksAtom} from "@/app/store/atom/blocks.atom";
import TextTemplateV2 from '../../TextTemplateV2';
import PromptV2 from "@/app/components/custom/chapter/PromptV2";
import QaBlockTemplate from "@/app/components/custom/chapter/screnarioContents/QaBlockTemplate";

type props = {
  block: Block,
  index: number,
  onDelete: (index: number) => void,
  onCopy: (index: number) => void,
  chapter: Chapter,
  ids: Array<string>,
  onDeleteStartEnd: (index: number, type: string) => void,
  isShowAddButton?: boolean
  handleGetIndex?: () => void
  handleMultiCopy?: (type: string) => void
  audio?: HTMLAudioElement
  setAudio?: React.Dispatch<React.SetStateAction<HTMLAudioElement>>
  disableSound?: boolean
  handlePlay?: (player: any) => void
}

function BlockItems({
  block,
  index,
  onDelete,
  onCopy,
  chapter,
  ids,
  onDeleteStartEnd,
  isShowAddButton,
  handleGetIndex,
  handleMultiCopy,
  audio,
  setAudio,
  disableSound,
  handlePlay
}: props) {
  const chapterError = useAtomValue(chapterErrorAtom)
  const [blocks,] = useAtom(blocksAtom)

  const promptHeaderBlock = blocks?.find((item) => item.type === UROID_CHARPROMPT_HEADER) as BlockUroidCharPromptHeader
  const promptFooterBlock = blocks?.find((item) => item.type === UROID_CHARPROMPT_FOOTER) as BlockUroidCharPromptFooter
  const headerBlockCondition = Boolean(chapterError.uRoidPromptHeader &&
    !promptHeaderBlock.data.isUserAction && !promptHeaderBlock.data.characterPrompt && chapter?.chapterType === 'createURoid')
  const footerBlockCondition = Boolean(chapterError.uRoidPromptFooter &&
    !promptFooterBlock.data.isUserAction && !promptFooterBlock.data.characterPrompt && chapter?.chapterType === 'createURoid')
  return (
    block?.type === "text" || block?.type === NO_VARIABLE_TEXT ? (
      <TextTemplate
        handleMultiCopy={handleMultiCopy}
        handleGetIndex={handleGetIndex}
        isShowAddButton={isShowAddButton}
        // key={item.id}
        onDelete={() => onDelete(index)}
        onCopy={() => onCopy(index)}
        block={block as BlockText}
        audio={audio}
        setAudio={setAudio}
        disableSound={disableSound}
      />
    ) : block?.type === ENECOLOR_RANK_TEXT ? (
      <TextTemplate
        handleMultiCopy={handleMultiCopy}
        handleGetIndex={handleGetIndex}
        isShowAddButton={isShowAddButton}
        // key={item.id}
        onDelete={() => onDelete(index)}
        onCopy={() => onCopy(index)}
        block={block as BlockEnecolorRankText}
      />
    ) : block?.type === ENECOLOR_RANK_TEXT_V2 ? (
      <TextTemplateV2
        chapter={chapter}
        handleMultiCopy={handleMultiCopy}
        handleGetIndex={handleGetIndex}
        isShowAddButton={isShowAddButton}
        onDelete={() => onDelete(index)}
        onCopy={() => onCopy(index)}
        block={block as BlockEnecolorRankText}
        audio={audio}
        setAudio={setAudio}
        disableSound={disableSound}
        color={'#FFBFCB'}
        title={<>
          <div>Enecolor</div>
          <div>TextV2</div>
        </>}
      />
    ) : block?.type === "image" ? (
      <ImageTemplate
        handleMultiCopy={handleMultiCopy}
        handleGetIndex={handleGetIndex}
        isShowAddButton={isShowAddButton}
        block={block as BlockImage}
        // key={item.id}
        onDelete={() => onDelete(index)}
        onCopy={() => onCopy(index)}
      />
    ) : block?.type === START_IMAGE || block?.type === EXIT_IMAGE ? (
      <RangeImageTemplate
        type={block?.type}
        handleMultiCopy={handleMultiCopy}
        handleGetIndex={handleGetIndex}
        isShowAddButton={isShowAddButton}
        index={index}
        // key={item.id}
        block={block as BlockStartImg}
        onDelete={() => onDelete(index)}
        onCopy={() => onCopy(index)}
      />
    ) : block?.type === ENECOLOR_RANK_IMG ? (
      <EnecolorTemplate
        handleMultiCopy={handleMultiCopy}
        handleGetIndex={handleGetIndex}
        isShowAddButton={isShowAddButton}
        block={block as BlockEneColorRankImg}
        // key={item.id}
        onDelete={() => onDelete(index)}
        onCopy={() => onCopy(index)}
      />
    ) : block?.type === ENECOLOR_RANK_IMG_V2 ? (
      <TextTemplateV2
        chapter={chapter}
        handleMultiCopy={handleMultiCopy}
        handleGetIndex={handleGetIndex}
        isShowAddButton={isShowAddButton}
        onDelete={() => onDelete(index)}
        onCopy={() => onCopy(index)}
        block={block as BlockEneColorRankImg}
        audio={audio}
        setAudio={setAudio}
        disableSound={disableSound}
        color={'#FFBFCB'}
        title={<>
          <div>Enecolor</div>
          <div>ImageV2</div>
        </>}
      />
    ) : block?.type === "graph_4" ? (
      <GraphTemplate
        block={block as BlockGraph}
        handleMultiCopy={handleMultiCopy}
        handleGetIndex={handleGetIndex}
        isShowAddButton={isShowAddButton}
        is4EneColor={true}
        // key={item.id}
        onDelete={() => onDelete(index)}
        onCopy={() => onCopy(index)}
      />
    ) : block?.type === "graph" ? (
      <GraphTemplate
        block={block as BlockGraph}
        handleMultiCopy={handleMultiCopy}
        handleGetIndex={handleGetIndex}
        isShowAddButton={isShowAddButton}
        is4EneColor={false}
        // key={item.id}
        onDelete={() => onDelete(index)}
        onCopy={() => onCopy(index)}
      />
      // @ts-ignore
    ) : block?.type === "input" && !block?.data?.max && !block?.data?.referenceData ? (
      <InputTemplate
        handleMultiCopy={handleMultiCopy}
        handleGetIndex={handleGetIndex}
        isShowAddButton={isShowAddButton}
        block={block as BlockInput}
        // key={item.id}
        onDelete={() => onDelete(index)}
        onCopy={() => onCopy(index)}
      />
      // @ts-ignore
    ) : block?.type === "input" && block?.data?.max ? (
      <InputTemplate
        handleMultiCopy={handleMultiCopy}
        handleGetIndex={handleGetIndex}
        isShowAddButton={isShowAddButton}
        block={block as BlockInput}
        onDelete={() => onDelete(index)}
        onCopy={() => onCopy(index)}
        isNumberTemplate={true}
        // key={item.id}
      />
    ) : block?.type === "choice" ? (
      <ChoiceTemplate
        handleMultiCopy={handleMultiCopy}
        handleGetIndex={handleGetIndex}
        isShowAddButton={isShowAddButton}
        block={block as BlockChoice}
        // key={item.id}
        onDelete={() => onDelete(index)}
        onCopy={() => onCopy(index)}
        structureIds={chapter?.dataStructureIds?.length ? chapter?.dataStructureIds : ids}
      />
    ) : block?.type === IF_START ? (
      <If_StartTemplate
        handleMultiCopy={handleMultiCopy}
        handleGetIndex={handleGetIndex}
        isShowAddButton={isShowAddButton}
        block={block as BlockIfStart}
        // key={item.id}
        onDelete={() => onDeleteStartEnd(index, block.type)}
        onCopy={() => onCopy(index)}
      />
    ) : block?.type === IF_END ? (
      <If_EndTemplate
        handleMultiCopy={handleMultiCopy}
        handleGetIndex={handleGetIndex}
        isShowAddButton={isShowAddButton}
        block={block as BlockIfEnd}
        // key={item.id}
        onDelete={() => onDeleteStartEnd(index, block.type)}
        onCopy={() => onCopy(index)}
      />
    ) : block?.type === FOR_START ? (
      <For_StartTemplate
        handleMultiCopy={handleMultiCopy}
        handleGetIndex={handleGetIndex}
        isShowAddButton={isShowAddButton}
        block={block as BlockForStart}
        // key={item.id}
        onDelete={() => onDeleteStartEnd(index, block.type)}
        onCopy={() => onCopy(index)}
      />
    ) : block?.type === FOR_END ? (
      <For_EndTemplate
        handleMultiCopy={handleMultiCopy}
        handleGetIndex={handleGetIndex}
        isShowAddButton={isShowAddButton}
        block={block as BlockForEnd}
        // key={item.id}
        onDelete={() => onDeleteStartEnd(index, block.type)}
        onCopy={() => onCopy(index)}
      />
    ) : block?.type === "delay" ? (
      <DelayTemplate
        handleMultiCopy={handleMultiCopy}
        handleGetIndex={handleGetIndex}
        isShowAddButton={isShowAddButton}
        block={block as BlockDelay}
        // key={item.id}
        onDelete={() => onDelete(index)}
        onCopy={() => onCopy(index)}
      />
    ) : block?.type === RECORD_START ? (
      <RecordStartTemplate
        block={block as BlockRecordStart}
        handleMultiCopy={handleMultiCopy}
        handleGetIndex={handleGetIndex}
        isShowAddButton={isShowAddButton}
        // key={item.id}
        onDelete={() => onDeleteStartEnd(index, block.type)}
        onCopy={() => onCopy(index)}
      />
    ) : block?.type === RECORD_END ? (
      <Record_EndTemplate
        block={block as BlockRecordEnd}
        handleMultiCopy={handleMultiCopy}
        handleGetIndex={handleGetIndex}
        isShowAddButton={isShowAddButton}
        // key={item.id}
        onDelete={() => onDeleteStartEnd(index, block.type)}
        onCopy={() => onCopy(index)}
      />
    ) : block?.type === "motion" ? (
      <MotionTemplate
        handleMultiCopy={handleMultiCopy}
        handleGetIndex={handleGetIndex}
        isShowAddButton={isShowAddButton}
        // key={item.id}
        block={block as BlockMotion}
        onDelete={() => onDelete(index)}
        onCopy={() => onCopy(index)}
      />
    ) : block?.type === "slide" ? (
      <SlideTemplate
        handleMultiCopy={handleMultiCopy}
        handleGetIndex={handleGetIndex}
        isShowAddButton={isShowAddButton}
        // key={item.id}
        block={block as BlockSlide}
        onDelete={() => onDelete(index)}
        onCopy={() => onCopy(index)}
      />
    ) : block?.type === "show_slide" ? (
      <StartShowSlideTemplate
        block={block as BlockShowSlide}
        handleMultiCopy={handleMultiCopy}
        handleGetIndex={handleGetIndex}
        isShowAddButton={isShowAddButton}
        // key={item.id}
        showSlideId={block.showSlideId}
        onDelete={() => onDelete(index)}
        onCopy={() => onCopy(index)}
      />
    ) : block?.type === CHAT_GTP_ANSWER ||
    block?.type === MULTI_PROMPT_INPUT_ANSWER ||
    block?.type === MULTI_PROMPT_WITHOUT_CHAR_ANSWER ? (
      <ChatGPTAnswer
        block={block as BlockChatGptAnswer}
        index={index}
        title={block?.type === CHAT_GTP_ANSWER ? 'ChatGPT Answer' :
          block?.type === MULTI_PROMPT_INPUT_ANSWER ?
            'Multi Prompt Input Answer' : 'Without Char Multi Prompt Answer'}
        handleMultiCopy={handleMultiCopy}
        handleGetIndex={handleGetIndex}
        isShowAddButton={isShowAddButton}
        // key={item.id}
        onDelete={() => onDeleteStartEnd(index, block.type)}
        onCopy={() => onCopy(index)}
      />
    ) : block?.type === "popup" ? (
      <PopupTemplate
        handleMultiCopy={handleMultiCopy}
        handleGetIndex={handleGetIndex}
        block={block as BlockPopup}
        // key={item.id}
        onDelete={() => onDelete(index)}
        onCopy={() => onCopy(index)}
      />
    ) : block?.type === YOUTUBE || block?.type === VIMEO ? (
      <VideoTemplate
        handleMultiCopy={handleMultiCopy}
        handleGetIndex={handleGetIndex}
        isShowAddButton={isShowAddButton}
        id={block.id}
        block={block as BlockVideo}
        onDelete={() => onDelete(index)}
        onCopy={() => onCopy(index)}
        handlePlay={handlePlay}
      />) : block?.type === VIDEO ? (
      <VideoTemplate
        handleMultiCopy={handleMultiCopy}
        handleGetIndex={handleGetIndex}
        isShowAddButton={isShowAddButton}
        id={block.id}
        block={block as BlockVideo}
        onDelete={() => onDelete(index)}
        onCopy={() => onCopy(index)}
        handlePlay={handlePlay}
      />
    ) : block?.type === "control" ? (
      <ControlTemplate
        handleMultiCopy={handleMultiCopy}
        handleGetIndex={handleGetIndex}
        isShowAddButton={isShowAddButton}
        index={index}
        block={block as BlockControl}
        // key={item.id}
        onDelete={() => onDelete(index)}
        onCopy={() => onCopy(index)}
      />) : block?.type === "timer_start" ? (
      <TimerStartTemplate
        blockType={'timer'}
        block={block as BlockTimerStart}
        handleMultiCopy={handleMultiCopy}
        handleGetIndex={handleGetIndex}
        isShowAddButton={isShowAddButton}
        onDelete={() => onDeleteStartEnd(index, block.type)}
        onCopy={() => onCopy(index)}
      />) : block?.type === "timer_end" ? (
      <TimerEndTemplate
        block={block as BlockTimerEnd}
        handleMultiCopy={handleMultiCopy}
        handleGetIndex={handleGetIndex}
        isShowAddButton={isShowAddButton}
        onDelete={() => onDeleteStartEnd(index, block.type)}
        onCopy={() => onCopy(index)}
      />) : block?.type === "time_trigger" ? (
        <TimerStartTemplate
          blockType={'time_trigger'}
          block={block as BlockTimerTrigger}
          handleMultiCopy={handleMultiCopy}
          handleGetIndex={handleGetIndex}
          isShowAddButton={isShowAddButton}
          onDelete={() => onDelete(index)}
          onCopy={() => onCopy(index)}
        />)
      : block?.type === "prompt" || block?.type === 'withoutChar_prompt' ? (
          <Prompt
            chapterId={chapter?.id}
            noCharacterPrompt={block.type === 'withoutChar_prompt'}
            isPrompt={true}
            isShowLogCheckBox={true}
            title={`${block?.type === 'prompt' ? 'Prompt' : 'Without Char Prompt'} `}
            handleMultiCopy={handleMultiCopy}
            handleGetIndex={handleGetIndex}
            isShowAddButton={isShowAddButton}
            onDelete={() => onDeleteStartEnd(index, block.type)}
            onCopy={() => onCopy(index)}
            block={block as BlockPrompt}
          />)
        : block?.type === PROMPT_V2 || block?.type === PROMPT_WITHOUT_CHAR_V2 ? (
            <PromptV2
              chapterId={chapter?.id}
              noCharacterPrompt={block.type === PROMPT_WITHOUT_CHAR_V2}
              isPrompt={true}
              isShowLogCheckBox={true}
              title={`${block?.type === PROMPT_V2 ? 'Prompt V2' : 'Without Char Prompt V2'} `}
              handleMultiCopy={handleMultiCopy}
              handleGetIndex={handleGetIndex}
              isShowAddButton={isShowAddButton}
              onDelete={() => onDeleteStartEnd(index, block.type)}
              onCopy={() => onCopy(index)}
              block={block as BlockPrompt}
            />)
          : block?.type === "promptInput" || block.type === PROMPT_INPUT_WITHOUT_CHAR ? (
            <Prompt
              chapterId={chapter?.id}
              noCharacterPrompt={block.type === PROMPT_INPUT_WITHOUT_CHAR}
              isPrompt={false}
              title={`${block?.type === 'promptInput' ? 'Prompt Input' : 'Without Char Prompt Input'} `}
              handleMultiCopy={handleMultiCopy}
              handleGetIndex={handleGetIndex}
              isShowAddButton={isShowAddButton}
              onDelete={() => onDeleteStartEnd(index, block.type)}
              onCopy={() => onCopy(index)}
              block={block as BlockPromptInput}
            />
          ) : block?.type === PROMPT_INPUT_V2 || block.type === PROMPT_INPUT_WITHOUT_CHAR_V2 ? (
              <PromptV2
                chapterId={chapter?.id}
                noCharacterPrompt={block.type === PROMPT_INPUT_WITHOUT_CHAR_V2}
                isPrompt={false}
                title={`${block?.type === PROMPT_INPUT_V2 ? 'Prompt Input V2' : 'Without Char Prompt Input V2'} `}
                handleMultiCopy={handleMultiCopy}
                handleGetIndex={handleGetIndex}
                isShowAddButton={isShowAddButton}
                onDelete={() => onDeleteStartEnd(index, block.type)}
                onCopy={() => onCopy(index)}
                block={block as BlockPromptInput}
              />
            )
            : block?.type === 'multiPromptInput' || block?.type === 'withoutChar_multiPromptInput' ? (
                <Prompt
                  chapterId={chapter?.id}
                  noCharacterPrompt={block.type === 'withoutChar_multiPromptInput'}
                  isPrompt={false}
                  title={`${block?.type === 'multiPromptInput' ? 'Multi Prompt Input' : 'Without Char Multi Prompt Input'} `}
                  handleMultiCopy={handleMultiCopy}
                  handleGetIndex={handleGetIndex}
                  isShowAddButton={isShowAddButton}
                  onDelete={() => onDeleteStartEnd(index, block.type)}
                  onCopy={() => onCopy(index)}
                  block={block as BlockPromptInput}
                />)
              : block?.type === MULTI_PROMPT_INPUT_V2 || block?.type === 'withoutChar_multiPromptInputV2' ? (
                  <PromptV2
                    chapterId={chapter?.id}
                    noCharacterPrompt={block.type === 'withoutChar_multiPromptInputV2'}
                    isPrompt={false}
                    title={`${block?.type === MULTI_PROMPT_INPUT_V2 ? 'Multi Prompt Input V2' : 'Without Char Multi Prompt Input V2'} `}
                    handleMultiCopy={handleMultiCopy}
                    handleGetIndex={handleGetIndex}
                    isShowAddButton={isShowAddButton}
                    onDelete={() => onDeleteStartEnd(index, block.type)}
                    onCopy={() => onCopy(index)}
                    block={block as BlockPromptInput}
                  />)
                : block?.type === "versionUserChoice" ? (
                  <ChatGPTVersionUserChoice
                    isShowAddButton={isShowAddButton}
                    handleMultiCopy={handleMultiCopy}
                    block={block as BlockChatGptVersionUserChoice}
                    handleGetIndex={handleGetIndex}
                    onDelete={() => onDelete(index)}
                    onCopy={() => onCopy(index)}
                  />
                ) : block?.type === "versionSetting" ? (
                  <ChatGPTVersionUserChoice
                    isShowAddButton={isShowAddButton}
                    handleMultiCopy={handleMultiCopy}
                    block={block as BlockChatGptVersionSetting}
                    handleGetIndex={handleGetIndex}
                    onDelete={() => onDelete(index)}
                    onCopy={() => onCopy(index)}
                  />) : block?.type === "continuousChat" ? (
                  <ContinuousChat
                    block={block as BlockContinuousChat}
                    isShowAddButton={isShowAddButton}
                    handleMultiCopy={handleMultiCopy}
                    handleGetIndex={handleGetIndex}
                    onDelete={() => onDelete(index)}
                    onCopy={() => onCopy(index)}
                  />) : block?.type === UROID_NAME ? (
                  <UroidCommonFunction
                    block={block as BlockURoidName}
                    render={({handleChangeField, handleCheckField}) =>
                      <UroidNameTemplate
                        chapter={chapter}
                        handleChangeField={handleChangeField}
                        handleCheckField={handleCheckField}
                        handleMultiCopy={handleMultiCopy}
                        handleGetIndex={handleGetIndex}
                        isShowAddButton={isShowAddButton}
                        block={block as BlockURoidName}
                        onDelete={() => onDelete(index)}
                        onCopy={() => onCopy(index)}/>
                    }
                  />) : block?.type === UROID_DES ? (
                  <UroidCommonFunction
                    block={block as BlockURoidDescription}
                    render={({handleChangeField, handleCheckField}) =>
                      <UroidDescriptionTemplate
                        chapter={chapter}
                        handleChangeField={handleChangeField}
                        handleCheckField={handleCheckField}
                        handleMultiCopy={handleMultiCopy}
                        handleGetIndex={handleGetIndex}
                        isShowAddButton={isShowAddButton}
                        block={block as BlockURoidDescription}
                        onDelete={() => onDelete(index)}
                        onCopy={() => onCopy(index)}/>
                    }
                  />) : block?.type === UROID_CHARPROMPT_HEADER ? (
                  <UroidCommonFunction
                    block={block as BlockUroidCharPromptHeader}
                    render={({handleChangeField, handleCheckField}) =>
                      <UroidCharPromptHeaderTemplate
                        chapter={chapter}
                        condition={headerBlockCondition}
                        title={'Prompt Header'}
                        handleChangeField={handleChangeField}
                        handleCheckField={handleCheckField}
                        handleMultiCopy={handleMultiCopy}
                        handleGetIndex={handleGetIndex}
                        isShowAddButton={isShowAddButton}
                        block={block as BlockUroidCharPromptHeader}
                        onDelete={() => onDelete(index)}
                        onCopy={() => onCopy(index)}
                      />
                    }
                  />) : block?.type === UROID_CHARPROMPT_FOOTER ? (
                  <UroidCommonFunction
                    block={block as BlockUroidCharPromptFooter}
                    render={({handleChangeField, handleCheckField}) =>
                      <UroidCharPromptHeaderTemplate
                        chapter={chapter}
                        condition={footerBlockCondition}
                        title={'Prompt Footer'}
                        handleChangeField={handleChangeField}
                        handleCheckField={handleCheckField}
                        handleMultiCopy={handleMultiCopy}
                        handleGetIndex={handleGetIndex}
                        isShowAddButton={isShowAddButton}
                        block={block as BlockUroidCharPromptFooter}
                        onDelete={() => onDelete(index)}
                        onCopy={() => onCopy(index)}
                      />
                    }
                  />) : block?.type === UROID_THUMB ? (
                  <UroidCommonFunction
                    block={block as BlockURoidThumbnail}
                    render={({handleCheckField, handleUploadImage, loading}) =>
                      <UroidThumbTemplate
                        chapter={chapter}
                        handleCheckField={handleCheckField}
                        handleUploadImage={handleUploadImage}
                        handleMultiCopy={handleMultiCopy}
                        handleGetIndex={handleGetIndex}
                        isShowAddButton={isShowAddButton}
                        block={block as BlockURoidThumbnail}
                        onDelete={() => onDelete(index)}
                        onCopy={() => onCopy(index)}
                        loading={loading}
                      />
                    }
                  />) : block?.type === UROID_DEFAULTIMAGE ? (
                  <UroidCommonFunction
                    block={block as BlockURoidDefaultImage}
                    render={({handleCheckField, handleUploadImage, loading}) =>
                      <UroidDefaultImageTemplate
                        chapter={chapter}
                        handleCheckField={handleCheckField}
                        handleUploadImage={handleUploadImage}
                        handleMultiCopy={handleMultiCopy}
                        handleGetIndex={handleGetIndex}
                        isShowAddButton={isShowAddButton}
                        block={block as BlockURoidDefaultImage}
                        onDelete={() => onDelete(index)}
                        onCopy={() => onCopy(index)}
                        loading={loading}
                      />
                    }
                  />) : block?.type === UROID_DEFAULT_IMAGE_CHOICE ? (
                  <UroidDefaultImageChoiceTemplate
                    chapter={chapter}
                    handleMultiCopy={handleMultiCopy}
                    handleGetIndex={handleGetIndex}
                    isShowAddButton={isShowAddButton}
                    block={block as BlockURoidDefaultImageChoice}
                    onDelete={() => onDelete(index)}
                    onCopy={() => onCopy(index)}
                    // key={item.id}
                  />) : block?.type === UROID_DEFAULT_IMAGE_RANDOM ? (
                  <UroidCommonFunction
                    block={block as BlockURoidDefaultImageRandom}
                    render={({handleCheckField}) =>
                      <UroidDefaultImageRandomTemplate
                        chapter={chapter}
                        handleCheckField={handleCheckField}
                        handleMultiCopy={handleMultiCopy}
                        handleGetIndex={handleGetIndex}
                        isShowAddButton={isShowAddButton}
                        block={block as BlockURoidDefaultImageRandom}
                        onDelete={() => onDelete(index)}
                        onCopy={() => onCopy(index)}
                      />
                    }
                  />) : block?.type === UROID_DEFAULTVOICE ? (
                  <UroidCommonFunction
                    block={block as BlockURoidDefaultVoice}
                    render={({handleCheckField, handleChangeField}) =>
                      <UroidDefaultVoiceTemplate
                        chapter={chapter}
                        handleChangeField={handleChangeField}
                        handleCheckField={handleCheckField}
                        handleMultiCopy={handleMultiCopy}
                        handleGetIndex={handleGetIndex}
                        isShowAddButton={isShowAddButton}
                        block={block as BlockURoidDefaultVoice}
                        onDelete={() => onDelete(index)}
                        onCopy={() => onCopy(index)}
                      />
                    }
                  />) : block?.type === TEXT_V2 ? (
                  <TextTemplateV2
                    chapter={chapter}
                    handleMultiCopy={handleMultiCopy}
                    handleGetIndex={handleGetIndex}
                    isShowAddButton={isShowAddButton}
                    onDelete={() => onDelete(index)}
                    onCopy={() => onCopy(index)}
                    block={block as BlockText}
                    audio={audio}
                    setAudio={setAudio}
                    disableSound={disableSound}
                  />) : block?.type === INPUT_ENECOLOR_TEXT ? (
                  <TextTemplateV2
                    chapter={chapter}
                    handleMultiCopy={handleMultiCopy}
                    handleGetIndex={handleGetIndex}
                    isShowAddButton={isShowAddButton}
                    onDelete={() => onDelete(index)}
                    onCopy={() => onCopy(index)}
                    block={block as BlockInputEnecolorText}
                    audio={audio}
                    setAudio={setAudio}
                    disableSound={disableSound}
                    color={'#FFBFCB'}
                    title={<>
                      <div>Input</div>
                      <div>Enecolor</div>
                      <div>Text</div>
                    </>}
                  />) : block?.type === INPUT_ENECOLOR_IMAGE ? (
                  <TextTemplateV2
                    chapter={chapter}
                    handleMultiCopy={handleMultiCopy}
                    handleGetIndex={handleGetIndex}
                    isShowAddButton={isShowAddButton}
                    onDelete={() => onDelete(index)}
                    onCopy={() => onCopy(index)}
                    block={block as BlockInputEnecolorImage}
                    audio={audio}
                    setAudio={setAudio}
                    disableSound={disableSound}
                    color={'#FFBFCB'}
                    title={<>
                      <div>Input</div>
                      <div>Enecolor</div>
                      <div>Image</div>
                    </>}
                  />) :
                //   block?.type === QA_DOCS_BLOCK ? (
                //     <QaBlockTemplate
                //       chapter={chapter}
                //       block={block as BlockAssociateAI}
                //       handleMultiCopy={handleMultiCopy}
                //       handleGetIndex={handleGetIndex}
                //       isShowAddButton={isShowAddButton}
                //       onDelete={() => onDelete(index)}
                //       onCopy={() => onCopy(index)}
                //     />
                // ) :
                  null
  );
}

export default React.memo(BlockItems);
