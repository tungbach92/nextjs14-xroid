import {
  Block,
  BlockChatGptVersionSetting,
  BlockChatGptVersionUserChoice,
  BlockContinuousChat,
  BlockPrompt,
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
  DataPrompt
} from "@/app/types/block";
import {Chapter} from "@/app/types/types";
import {MutableRefObject, SetStateAction} from "react";
import {VirtuosoHandle} from "react-virtuoso";
import {ChapterError} from "@/app/store/atom/chapterError.atom";
import {patternVimeo, patternYoutube} from "@/app/components/custom/chapter/screnarioContents/VideoTemplate";
import {PROMPT_TYPES} from "@/app/configs/constants";

export const catchErrorWhenSaveChapter = (chapter: Chapter,
  _blocks: Block[],
  virtuosoRef: MutableRefObject<VirtuosoHandle>,
  updateChapterError: React.Dispatch<SetStateAction<ChapterError>>,
  collapse: boolean,
  setCollapse: React.Dispatch<SetStateAction<boolean>>) => {
  // const uRoidBlockTypes = [UROID_NAME, UROID_DES, UROID_THUMB, UROID_DEFAULTVOICE, UROID_CHARPROMPT_HEADER, UROID_CHARPROMPT_FOOTER]
  // const uRoidImageBlockTypes = [UROID_DEFAULTIMAGE, UROID_DEFAULT_IMAGE_CHOICE, UROID_DEFAULT_IMAGE_RANDOM]
  const hasVersionUserChoice = _blocks?.find(item => item.type === 'versionUserChoice') as BlockChatGptVersionUserChoice
  const hasContinuousChat = _blocks?.find(item => item.type === 'continuousChat') as BlockContinuousChat
  const hasVersionSetting = _blocks?.find(item => item.type === 'versionSetting') as BlockChatGptVersionSetting
  const checkPrompt = _blocks?.filter(item => item.type === 'prompt' || item.type === 'withoutChar_prompt') as BlockPrompt[]
  const blockYoutube = _blocks?.find(item => item.type === 'youtube') as BlockVideo
  const blockVimeo = _blocks?.find(item => item.type === 'vimeo') as BlockVideo
  const uRoidNameBlock = _blocks?.find(item => item.type === 'uRoid_name') as BlockURoidName
  const uRoidDescriptionBlock = _blocks?.find(item => item.type === 'uRoid_description') as BlockURoidDescription
  const uRoidDefaultVoice = _blocks?.find(item => item.type === 'uRoid_defaultVoice') as BlockURoidDefaultVoice
  const uRoidThumbnail = _blocks?.find(item => item.type === 'uRoid_thumbnail') as BlockURoidThumbnail
  const uRoidPromptHeader = _blocks?.find(item => item.type === 'uRoid_characterPromptHeader') as BlockUroidCharPromptHeader
  const uRoidPromptFooter = _blocks?.find(item => item.type === 'uRoid_characterPromptFooter') as BlockUroidCharPromptFooter
  const uRoidDefaultImage = _blocks?.find(item => item.type === 'uRoid_defaultImage') as BlockURoidDefaultImage
  const uRoidDefaultImageChoice = _blocks?.find(item => item.type === 'uRoid_defaultImageChoice') as BlockURoidDefaultImageChoice
  const uRoidDefaultImageRandom = _blocks?.find(item => item.type === 'uRoid_defaultImageRandom') as BlockURoidDefaultImageRandom
  const allSlides = _blocks.filter(item => item.type === 'slide')
  const allShowSlides = _blocks.filter(item => item.type === 'show_slide')
  const errShowSlide = _blocks?.find(item => item.type === 'show_slide' && !allSlides.map(x => x.showSlideId).includes(item.showSlideId))
  const errSlide = _blocks?.find(item => item.type === 'slide' && !allShowSlides.map(x => x.showSlideId).includes(item.showSlideId))
  const chatGPTs = _blocks?.filter(item => PROMPT_TYPES.includes(item.type))
  const checkErrChatGPT = () => {
    return chatGPTs.some(x => {
      const data = x.data as DataPrompt
      return !data.userInput && !data.adminPrompt1 && !data.adminPrompt2
    })
  }
  const errChatGPTs = () => {
    return chatGPTs.filter(x => {
      const data = x.data as DataPrompt
      return !data.userInput && !data.adminPrompt1 && !data.adminPrompt2
    })
  }

  const checkMissingShowSlide = () => {
    let showSlides = []
    if (allSlides.length > 0) {
      showSlides = _blocks.filter(item => item.type === 'show_slide' && allSlides.map(x => x.showSlideId).includes(item.showSlideId))
    }
    return showSlides.length === allSlides.length
  }
  const checkMissingSlide = () => {
    let slides = []
    if (allShowSlides.length > 0) {
      slides = _blocks.filter(item => item.type === 'slide' && allShowSlides.map(x => x.showSlideId).includes(item.showSlideId))
    }
    return slides.length === allShowSlides.length
  }
  const missingCoupleSlide = !checkMissingShowSlide() || !checkMissingSlide()

  const blockTypes = _blocks?.map(item => item.type)
  // const hasAllURoidBlock = uRoidBlockTypes.every(item => blockTypes.includes(item))
  // const hasURoidBlock = blockTypes.find(item => uRoidBlockTypes.includes(item))
  // const hasURoidImageBlock = blockTypes.find(item => uRoidImageBlockTypes.includes(item))


  // if (hasURoidBlock && !hasURoidImageBlock ||
  //   hasAllURoidBlock && !hasURoidImageBlock ||
  //   hasURoidBlock && !hasAllURoidBlock ||
  //   hasURoidImageBlock && !hasAllURoidBlock
  // ) {
  //   throw new Error('add all uRoid block Please');
  // }
  // if (checkPrompt?.length > 0) {
  //   checkPrompt.forEach(item => {
  //     if (item?.data?.userInput == '') {
  //       throw new Error('入力欄を入力してください');
  //     }
  //   })
  // }
  if (missingCoupleSlide) {
    virtuosoRef.current.scrollToIndex({
      index: !checkMissingShowSlide() ? errSlide.index - 1 : !checkMissingSlide() ? errShowSlide.index - 1 : null,
      align: "start",
      behavior: "auto"
    });
    throw new Error('スライドとショースライドのブロックを入力してください。!');
  }
  if (!chapter?.title) {
    // setChapterError(prev => ({...prev, title: 'タイトルを入力してください'}))
    if (!collapse) setCollapse(true)
    updateChapterError({title: 'タイトルを入力してください'})
    virtuosoRef.current.scrollToIndex({
      // @ts-ignore
      index: _blocks[0],
      align: "start",
      behavior: "auto"
    });
    throw new Error('タイトルを入力してください');
  }
  if (hasVersionSetting && !hasVersionSetting?.data?.modelId) {
    updateChapterError({hasVersionSetting: 'バージョンを設定してください。'})
    virtuosoRef.current.scrollToIndex({
      index: hasVersionSetting.index || _blocks.indexOf(hasVersionSetting),
      align: "start",
      behavior: "auto"
    });
    throw new Error('バージョンを設定してください。');
  }
  if (hasVersionUserChoice && hasVersionUserChoice?.data?.modelIds?.length === 0) {
    updateChapterError({hasVersionUserChoice: 'バージョンを設定してください。'})
    virtuosoRef.current.scrollToIndex({
      index: hasVersionUserChoice.index || _blocks.indexOf(hasVersionUserChoice),
      align: "start",
      behavior: "auto"
    });
    throw new Error('バージョンを選択してください。');
  }
  if (hasContinuousChat && !hasContinuousChat?.data?.parentId || hasContinuousChat && !hasContinuousChat?.data?.dataStructureId) {
    updateChapterError({hasContinuousChat: 'チャットタイトルを選択してください'})
    virtuosoRef.current.scrollToIndex({
      index: hasContinuousChat.index || _blocks.indexOf(hasContinuousChat),
      align: "start",
      behavior: "auto"
    });
    throw new Error('チャットタイトルを選択してください');
  }
  if (blockYoutube && !new RegExp(patternYoutube).test(blockYoutube?.data?.url?.trim())) {
    updateChapterError({youtubeUrl: 'Youtube のURLを入力してください'})
    virtuosoRef.current.scrollToIndex({
      index: blockYoutube.index || _blocks.indexOf(blockYoutube),
      align: "start",
      behavior: "auto"
    });
    throw new Error('Youtube のURLを入力してください');
  }

  if (blockVimeo && !new RegExp(patternVimeo).test(blockVimeo?.data?.url?.trim())) {
    updateChapterError({vimeoUrl: 'Vimeo のURLを入力してください'})
    virtuosoRef.current.scrollToIndex({
      index: blockVimeo.index || _blocks.indexOf(blockVimeo),
      align: "start",
      behavior: "auto"
    });
    throw new Error('Vimeo のURLを入力してください');
  }
  if (chapter?.chapterType === 'createURoid' && uRoidNameBlock && !uRoidNameBlock.data.isUserAction && !uRoidNameBlock.data.name) {
    updateChapterError({uRoidName: '名前入力またはユーザー入力を選択してください'})
    virtuosoRef.current.scrollToIndex({
      index: uRoidNameBlock.index ? uRoidNameBlock.index - 1 : _blocks.indexOf(uRoidNameBlock) - 1,
      align: "start",
      behavior: "auto"
    });
    throw new Error('名前入力またはユーザー入力を選択してください。');
  }
  // if (chapter?.chapterType === 'createURoid' && uRoidDescriptionBlock && !uRoidDescriptionBlock.data.isUserAction && !uRoidDescriptionBlock.data.description) {
  //   updateChapterError({uRoidDescription: '説明入力またはユーザー入力を選択してください。'})
  //   virtuosoRef.current.scrollToIndex({
  //     index: uRoidDescriptionBlock.index ? uRoidDescriptionBlock.index - 1 : _blocks.indexOf(uRoidDescriptionBlock) - 1,
  //     align: "start",
  //     behavior: "auto"
  //   });
  //   throw new Error('説明入力またはユーザー入力を選択してください。');
  // }
  if (chapter?.chapterType === 'createURoid' && uRoidDefaultVoice && !uRoidDefaultVoice.data.isUserAction && !uRoidDefaultVoice.data.voiceName) {
    updateChapterError({uRoidDefaultVoice: '音声またはユーザー選択を選択してください。'})
    virtuosoRef.current.scrollToIndex({
      index: uRoidDefaultVoice.index ? uRoidDefaultVoice.index - 1 : _blocks.indexOf(uRoidDefaultVoice) - 1,
      align: "start",
      behavior: "auto"
    });
    throw new Error('音声またはユーザー選択を選択してください。');
  }
  if (chapter?.chapterType === 'createURoid' && uRoidThumbnail && (!uRoidThumbnail.data.isUserAction && !uRoidThumbnail.data.thumbUrl && !uRoidThumbnail.data.isDefaultImage)) {
    updateChapterError({uRoidThumbnail: 'サムネイルまたはユーザーアップロードを選択してください。'})
    virtuosoRef.current.scrollToIndex({
      index: uRoidThumbnail.index ? uRoidThumbnail.index - 1 : _blocks.indexOf(uRoidThumbnail) - 1,
      align: "start",
      behavior: "auto"
    });
    throw new Error('サムネイルまたはユーザーアップロードを選択してください。');
  }
  // if (chapter?.chapterType === 'createURoid' && uRoidPromptHeader && !uRoidPromptHeader.data.isUserAction && !uRoidPromptHeader.data.characterPrompt) {
  //   updateChapterError({uRoidPromptHeader: '文頭入力してまたはユーザー入力選択してください。'})
  //   virtuosoRef.current.scrollToIndex({
  //     index: uRoidPromptHeader.index ? uRoidPromptHeader.index - 1 : _blocks.indexOf(uRoidPromptHeader) - 1,
  //     align: "start",
  //     behavior: "auto"
  //   });
  //   throw new Error('文頭入力してまたはユーザー入力選択してください。');
  // }
  // if (chapter?.chapterType === 'createURoid' && uRoidPromptFooter && !uRoidPromptFooter.data.isUserAction && !uRoidPromptFooter.data.characterPrompt) {
  //   updateChapterError({uRoidPromptFooter: '文末入力またはユーザー入力選択してください。'})
  //   virtuosoRef.current.scrollToIndex({
  //     index: uRoidPromptFooter.index ? uRoidPromptFooter.index - 1 : _blocks.indexOf(uRoidPromptFooter) - 1,
  //     align: "start",
  //     behavior: "auto"
  //   });
  //   throw new Error('文末入力またはユーザー入力選択してください。');
  // }
  if (chapter?.chapterType === 'createURoid' && uRoidDefaultImage && !uRoidDefaultImage.data.isUserAction && !uRoidDefaultImage.data.imageUrl) {
    updateChapterError({uRoidDefaultImage: '画像またはユーザー入力選択を選択してください。'})
    virtuosoRef.current.scrollToIndex({
      index: uRoidDefaultImage.index ? uRoidDefaultImage.index - 1 : _blocks.indexOf(uRoidDefaultImage) - 1,
      align: "start",
      behavior: "auto"
    });
    throw new Error('画像またはユーザー入力選択を選択してください。');
  }
  if (chapter?.chapterType === 'createURoid' && uRoidDefaultImageChoice && uRoidDefaultImageChoice.data.imageUrls?.length === 0) {
    updateChapterError({uRoidDefaultImageChoice: '画像をアップロードしてください。'})
    virtuosoRef.current.scrollToIndex({
      index: uRoidDefaultImageChoice.index ? uRoidDefaultImageChoice.index - 1 : _blocks.indexOf(uRoidDefaultImageChoice) - 1,
      align: "start",
      behavior: "auto"
    });
    throw new Error('画像をアップロードしてください。');
  }
  if (chapter?.chapterType === 'createURoid' && uRoidDefaultImageRandom && !uRoidDefaultImageRandom.data.folderId) {
    updateChapterError({uRoidDefaultImageRandom: 'フォルダまたはユーザー選択を選択してください。'})
    virtuosoRef.current.scrollToIndex({
      index: uRoidDefaultImageRandom.index ? uRoidDefaultImageRandom.index - 1 : _blocks.indexOf(uRoidDefaultImageRandom) - 1,
      align: "start",
      behavior: "auto"
    });
    throw new Error('フォルダを選択してください。');
  }
  if (chapter?.chapterType === 'createURoid' && !chapter?.uRoidName) {
    updateChapterError({uRoidName: 'Uroid名を入力してください'})
    virtuosoRef.current.scrollToIndex({
      index: 0,
      align: "start",
      behavior: "auto"
    });
    throw new Error('Uroid名を入力してください');
  }
  if (!chapter?.embedData?.isResponsive &&
    (chapter?.embedData?.embedWidth === '100%' ||
      chapter?.embedData?.embedHeight === '100%' ||
      !chapter?.embedData?.embedWidth ||
      !chapter?.embedData?.embedHeight)) {
    updateChapterError({embedData: '幅または高さを入力してください'})
    throw new Error('幅または高さを入力してください');
  }
  if (checkErrChatGPT()) {
    updateChapterError({chatGPT: 'テキスト入力のうち少なくとも 1 つを入力してください。'})
    virtuosoRef.current.scrollToIndex({
      index: errChatGPTs()[0].index ? errChatGPTs()[0].index - 1 : _blocks.indexOf(errChatGPTs()[0]) - 1,
      align: "start",
      behavior: "auto"
    });
    throw new Error('テキスト入力のうち少なくとも 1 つを入力してください。');
  }
}
