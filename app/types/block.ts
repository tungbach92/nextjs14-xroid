import {CharacterBlock} from "@/app/types/types";

export interface Message {
  japanese?: string
  english?: string
  japaneseMp3?: string
}

export interface GroupText {
  groups?: string[]
  userInput?: string
  rank?: number
  color?: string
  dataStructId?: string
  parentId?: string
}

export interface GroupTextV2 extends GroupText {
  enecolorId?: string
}

export interface GroupStruct {
  userInput?: string
  dataStructId?: string
  parentId?: string
}

export interface DataText {
  output_type?: string,
  message?: Message
  groupsText?: GroupTextV2[],
  groupsStruct?: GroupStruct[]
  dataInput?: string
}

export interface DataInput {
  dataInput: string
  parentId: string
  isEneColorBar?: boolean
  min?: number
  max?: number
  fieldPath?: string
}

export type DataInputValues = DataInput[keyof DataInput]

export interface DataMotion {
  mentoroid_id?: string
  motionType?: string
  flip?: string
  location?: string
  show?: string
}

export interface SlideAction {
  seconds?: number | string
  replay?: boolean
  url?: string
}

export interface Slideshow {
  layer?: string
  position?: string
  url?: string
}

export interface Slides {
  objectId?: string

  [p: string]: unknown
}

export interface DataSlide {
  id?: string
  slides?: Slides[]
  slideId?: string
  pageObjectId?: string
  title?: string
  slideActionType?: SlideAction
  slideShow?: Slideshow
  image?: string
  presentationId?: string
}

export interface ReferenceData {
  dataInput?: string
  parentId?: string
  fixedValue?: string
}

export interface DataImage {
  url: string
  delay: number
}

export interface DataIf {
  condition?: string
}

export interface DataFor {
  counter?: number | null
  condition?: string
}

export interface GroupImg {
  name?: string
  url?: string
}

export interface DataVideo {
  url?: string
  autoPlay?: boolean
  startAt: number
  endAt: number
  isFullScreen: boolean
}

export type DataVideoValues = DataVideo[keyof DataVideo]

export interface DataEneColorRankImg {
  output_type?: string
  groupsImg?: GroupImg[]
  rank?: number
  color?: string
  enecolorId?: string
  userId?: string
  isShare?: boolean
}

export type DataEneColorRankImgValues = DataEneColorRankImg[keyof DataEneColorRankImg]

export interface DataDelay {
  seconds?: number
}

export interface DataChoice {
  answerNumber?: number
  dataInput?: string
  parentId?: string
  referenceData?: ReferenceData[]
}

export type DataChoiceValue = DataChoice[keyof DataChoice]

export interface DataPopup {
  bannerLink?: string
  bannerTitle?: string
  buttonTitle?: string
  bannerDescription?: string
  url?: string
}

export interface DataChapterPurchase {
  userId?: string
  cube?: number
}

export interface DataStartImg {
  delay?: number
  seconds: number
}

export interface DataPrompt extends DataText {
  isNotShowForUser?: boolean
  characterPrompt1?: string
  characterPrompt2?: string
  adminPrompt1?: string
  adminPrompt2?: string
  userInput?: string
  qaId?: string
}


export interface DataPromptInput extends DataPrompt {
}

export interface DataChatGptAnswer {
  isNotShowForUser?: boolean
  promptBlockId?: string
  delayTime?: number
}

export interface DataEnecolorRankText extends Omit<DataText, 'groupsStruct'> {
}

export interface GroupsHourStructure {
  structureId?: string
  userInput?: string
  parentId?: string
}

export interface GroupsMinuteStructure extends GroupsHourStructure {
}

export interface GroupsSecondStructure extends GroupsHourStructure {
}

export interface DataTimerStart {
  countType?: string
  color?: string
  groupsHourStructure?: GroupsHourStructure
  groupsMinuteStructure?: GroupsMinuteStructure
  groupsSecondStructure?: GroupsSecondStructure
}

export interface DataTimerTrigger extends Omit<DataTimerStart, "countType" | "color"> {
  seconds?: number
  minutes?: number
  hours?: number
}

export interface DataVersionSetting {
  modelId?: string
  parentId?: string
  chatTitle?: string
  dataStructureId?: string
}

export interface DataVersionUserChoice extends Omit<DataVersionSetting, 'modelId'> {
  modelIds?: string[]
}

export interface DataContinuousChat {
  dataStructureId?: string
  parentId?: string
  chatTitle?: string
}

export interface DataURoidName {
  name: string
  isUserAction: boolean
}

export interface DataURoidDescription {
  description: string
  isUserAction: boolean
  groupsStruct: GroupStruct[]
  groupsText: GroupTextV2[]
}

export interface DataURoidThumbnail {
  thumbUrl: string
  isUserAction: boolean
  isDefaultImage: boolean
}

export interface DataUroidDefaultImage {
  imageUrl: string
  isUserAction: boolean
}

export interface DataUroidDefaultImageChoice {
  imageUrls: string[]
}

export interface DataUroidDefaultImageRandom {
  folderId: string
  count: number
  isUserAction: boolean
}

export interface DataUroidDefaultVoice {
  voiceName: string
  isUserAction: boolean
}

export interface DataUroidCharPromptHeader {
  characterPrompt: string
  isUserAction: boolean
  isNotShowForUser: boolean
  groupsStruct: GroupStruct[]
  groupsText: GroupTextV2[]
}

export interface DataUroidCharPromptFooter extends DataUroidCharPromptHeader {
}

export interface DataInputEnecolorText extends Omit<DataText, 'dataInput'>, DataInput {
}

export interface DataInputEnecolorImage extends DataInput {
  enecolorId: string
}

type MergeInterfaces<T extends Array<Object>> = T extends [infer First, ...infer Rest]
  ? First extends object
    ? Omit<MergeInterfaces<Rest>, keyof First> & First
    : never
  : {};
//
// type Data =
//     MergeInterfaces<[DataText, DataInput, DataImage, DataPrompt, DataSlide, DataMotion, DataIf, DataFor,
//         DataVideo, DataEneColorRankImg, DataDelay, DataChoice, DataPopup, DataChapterPurchase, DataStartImg, DataPromptInput,
//         DataChatGptAnswer, DataEnecolorRankText, DataTimerStart, DataTimerTrigger, DataVersionSetting,
//         DataVersionUserChoice, DataContinuousChat]>;

export type DataUroid = MergeInterfaces<[DataURoidName,
  DataURoidDescription,
  DataURoidThumbnail,
  DataUroidDefaultImage,
  DataUroidDefaultImageChoice,
  DataUroidDefaultImageRandom,
  DataUroidDefaultVoice,
  DataUroidCharPromptHeader,
  DataUroidCharPromptFooter,]>

export interface Block {
  id: string
  index?: number
  type?: string
  audioUrl: string
  audioName: string
  previewAudioUrl: string
  imageUrl: string
  characters: CharacterBlock[]
  // isAction?: boolean
  motionId?: string
  voiceId?: string
  // isShow?: boolean
  // isVoice?: boolean
  // position?: string
  isDeleted: boolean
  isShowLog: boolean
  showSlideId?: string
  delayTime?: number
  isHidden?: boolean
  data?: Object
}

export interface BlockText extends Block {
  type: string
  data: DataText
}

export interface BlockInput extends Block {
  type: string
  data: DataInput
}

export interface BlockEnecolorRankText extends Block {
  type: string
  data: DataEnecolorRankText
}

export interface BlockImage extends Block {
  type: string
  data: DataImage
}

export interface BlockStartImg extends Block {
  type: string
  data: DataStartImg
}

export interface BlockEndImg extends Block {
  type: string
  data: null
}

export interface BlockEneColorRankImg extends Block {
  type: string
  data: DataEneColorRankImg
}

export interface BlockGraph extends Block {
  type: string
  data: null
}

export interface BlockChoice extends Block {
  type: string
  data: DataChoice
}

export interface BlockIfStart extends Block {
  type: string
  data: DataIf
}

export interface BlockIfEnd extends BlockIfStart {
}

export interface BlockForStart extends Block {
  type: string
  data: DataFor
}

export interface BlockForEnd extends BlockForStart {
}

export interface BlockDelay extends Block {
  type: string
  data: DataDelay
}

export interface BlockRecordStart extends Block {
  type: string
  data: null
}

export interface BlockRecordEnd extends BlockRecordStart {
}

export interface BlockMotion extends Block {
  type: string
  data: DataMotion
}

export interface BlockSlide extends Block {
  type: string
  showSlideId: string
  data: DataSlide
}

export interface BlockShowSlide extends Block {
  type: string
  showSlideId: string
  data: null
}

export interface BlockChatGptAnswer extends Block {
  type: string
  data: DataChatGptAnswer
}

export interface BlockPopup extends Block {
  type: string
  data: DataPopup
}

export interface BlockVideo extends Block {
  type: string
  data: DataVideo
}

export interface BlockControl extends Block {
  type?: string
  data?: null
}

export interface BlockTimerStart extends Block {
  type: string
  data: DataTimerStart
}

export interface BlockTimerEnd extends Block {
  type: string
  data: null
}

export interface BlockTimerTrigger extends Block {
  type: string
  data: DataTimerTrigger
}

export interface BlockPrompt extends Block {
  type: string
  data: DataPrompt
}

export interface BlockWithoutCharPrompt extends Block {
  type: string
  data: DataPrompt
}

export interface BlockWithoutCharPromptInput extends Block {
  type: string
  data: DataPromptInput
}

export interface BlockPromptInput extends Block {
  type: string
  data: DataPromptInput
}

export interface BlockChatGptVersionUserChoice extends Block {
  type: string
  data: DataVersionUserChoice
}

export interface BlockChatGptVersionSetting extends Block {
  type: string
  data: DataVersionSetting
}

export interface BlockContinuousChat extends Block {
  type: string
  data: DataContinuousChat
}

export interface BlockURoidName extends Block {
  type: string
  data: DataURoidName
}

export interface BlockURoidDescription extends Block {
  type: string
  data: DataURoidDescription
}

export interface BlockURoidThumbnail extends Block {
  type: string
  data: DataURoidThumbnail
}

export interface BlockURoidDefaultImage extends Block {
  type: string
  data: DataUroidDefaultImage
}

export interface BlockURoidDefaultImageChoice extends Block {
  type: string
  data: DataUroidDefaultImageChoice
}

export interface BlockURoidDefaultImageRandom extends Block {
  type: string
  data: DataUroidDefaultImageRandom
}

export interface BlockURoidDefaultVoice extends Block {
  type: string
  data: DataUroidDefaultVoice
}

export interface BlockUroidCharPromptHeader extends Block {
  type: string
  data: DataUroidCharPromptHeader
}

export interface BlockUroidCharPromptFooter extends Block {
  type: string
  data: DataUroidCharPromptFooter
}

export interface BlockInputEnecolorText extends Block {
  type: string
  data: DataInputEnecolorText
}

export interface BlockInputEnecolorImage extends Block {
  type: string
  data: DataInputEnecolorImage
}

export interface DataAssociateAI {
  id?: string
}

export interface BlockAssociateAI extends Block {
  type?: string
  data?: DataAssociateAI
}

// export interface BlockText extends Omit<Block, 'data'> {
//   data: DataText
// }
export type AllBlockType =
  Block
  | BlockText
  | BlockInput
  | BlockEnecolorRankText
  | BlockImage
  | BlockStartImg
  | BlockEndImg
  | BlockEneColorRankImg
  | BlockGraph
  | BlockChoice
  | BlockIfStart
  | BlockIfEnd
  | BlockForStart
  | BlockForEnd
  | BlockDelay
  | BlockRecordStart
  | BlockRecordEnd
  | BlockMotion
  | BlockSlide
  | BlockShowSlide
  | BlockChatGptAnswer
  | BlockPopup
  | BlockVideo
  | BlockControl
  | BlockTimerStart
  | BlockTimerEnd
  | BlockTimerTrigger
  | BlockPrompt
  | BlockPromptInput
  | BlockChatGptVersionUserChoice
  | BlockChatGptVersionSetting
  | BlockContinuousChat
  | BlockURoidName
  | BlockURoidDescription
  | BlockURoidThumbnail
  | BlockURoidDefaultImage
  | BlockURoidDefaultImageRandom
  | BlockURoidDefaultImageChoice
  | BlockURoidDefaultVoice
  | BlockUroidCharPromptHeader
  | BlockUroidCharPromptFooter
  | BlockWithoutCharPrompt
  | BlockWithoutCharPromptInput
  | BlockInputEnecolorText
  | BlockInputEnecolorImage | BlockAssociateAI


export type BlockUroid = BlockURoidName
  | BlockURoidDescription
  | BlockURoidThumbnail
  | BlockURoidDefaultImage
  | BlockURoidDefaultImageRandom
  | BlockURoidDefaultImageChoice
  | BlockURoidDefaultVoice
  | BlockUroidCharPromptHeader
  | BlockUroidCharPromptFooter

export interface SaveSetting extends Block {
  title: string
  userId: string
  data: DataText | DataPrompt | DataEnecolorRankText | DataPromptInput | DataEneColorRankImg
}

export interface Enecolor extends Omit<DataText, "groupsStruct" | "groupsText">, DataEneColorRankImg {
  id?: string
  name: string
  groupsText?: GroupTextV2
}

