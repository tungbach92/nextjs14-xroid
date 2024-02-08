import {PurchaseSetting} from "@/app/common/chapterPurchaseSetting";
import {Block} from "@/app/types/block";
import {plans} from "@/app/configs/constants";
import {separateSettings} from "@/app/types/commonType";

export interface TextVoice extends Motion {
  id?: any;
  isDefault?: boolean;
  isDeleted?: boolean;
  voiceName?: string;
  displayName?: string
  key?: string;
  source?: string;
  emotion?: string;
  txtText?: string,
  volume?: number;
  speed?: number;
  pitch?: number;
  txtTest?: string,
  emotion_level?: number;
}

export interface CharacterBlock {
  id: string
  avatar: string
  isAction: boolean
  motionId: string
  voiceId: string
  isShow: boolean
  isVoice: boolean
  position: string
  characterPrompt1?: string
  characterPrompt2?: string
  isURoidTemplate?: boolean
}

export interface Image {
  id?: string;
  createdAt?: any;
  isDeleted?: boolean;
  createdAtDate?: any;
  folderId?: string;
  userId?: string;
  url?: string;
}

export interface Character extends Omit<CharacterBlock, "motionId" | "voiceId"> {
  isSelect?: boolean
  isChecked?: boolean
  adminPrompt1?: string
  adminPrompt2?: string
  name?: string;
  description?: string;
  defaultVoice?: string;
  defaultMotion?: string;
  voices?: string[];
  textVoices?: TextVoice[];
  pose?: Pose[];
  motion?: Motion[];
  isSystem?: boolean
  userId?: string
  motionId?: string
  voiceId?: string
  isTemplate?: boolean
  updatedAt?: any
}


//dataStructures
export interface DataStructureItem {
  type?: "text" | "number" | "array" | "image" | "data" | "";
  id?: string;
  fieldPath?: string;
  blockId?: string;
  isDeleted?: boolean;
}

export interface DataStructure {
  id?: string;
  name?: string;
  items?: Array<DataStructureItem>;
  userId?: string;
  isDeleted?: boolean;
  contentId?: string;
  index?: number;
  dataStructureId?: string;
  blockId?: string;
  folderId?: string
  isEnecolor?: boolean;
  // data?: any;
}

export interface NewDataStructure extends DataStructure {
  isCheck?: boolean;
  isCheckInChapter?: boolean;
}

export interface ViewOptionsForm {
  id: number;
  content: JSX.Element;
  name: string;
  check: boolean;
}

export interface ViewOptionForm {
  id: number;
  label: string;
  value: string;
  checked: boolean
}

export interface EmbedData {
  embedWidth?: string
  embedHeight?: string
  embedHtml?: string
  isResponsive?: boolean
  src?: string
}

export interface Chapter {
  id?: string;
  contentId?: string;
  title?: string;
  deeplink?: string;
  thumbnail?: string;
  thumbnailPopup?: string,
  chapterIndex?: number;
  actionCharacterIds?: string[];
  publishedDate?: Date;
  isTool?: boolean;
  isBanner?: boolean;
  cube?: number;
  isDeleted?: boolean;
  dataStructureIds?: Array<string>;
  viewOptions?: Array<string>;
  blocks?: Block[] | undefined;
  purchaseSetting?: PurchaseSetting;
  bannerLink?: string;
  bannerTitle?: string
  buttonTitle?: string,
  url?: string,
  bannerDescription?: string
  createdAt?: any
  updatedAt?: any
  uRoidTemplateId?: string
  isPublicByContent?: boolean
  isAbleComment?: boolean
  chapterType?: string
  isShowBanner?: boolean
  mentoroids?: string[]
  uRoidTemplateIds?: string[]
  uRoidName?: string
  separateSettings?: separateSettings,
  embedData?: EmbedData
}

export interface Category {
  id?: string;
  name?: string;
  isDeleted?: boolean;
  parentId?: string;
  index?: number;
}

export interface BannerData {
  createdAt?: any;
  id?: string;
  isDeleted?: boolean;
  isHidden?: boolean;
  pageUrl?: string;
  url?: string;
  index?: number;
}

export interface PopupData extends BannerData {
  title?: string;
  text?: string;
  titleButton?: string;
}

export interface ContentCategory extends Category {
  isSelected?: boolean;
}

export interface Size {
  width: number | undefined;
  height: number | undefined;
}

export interface Voice {
  id?: string;
  isDefault?: boolean;
  isDeleted?: boolean;
  voiceName?: string;
  displayName?: string
  key?: string;
  volume?: number;
  speed?: number;
  pitch?: number;
  source?: string;
  emotion?: string;
  txtText?: string,
  emotion_level?: number;
  createdAt?: number
}

export interface Motion {
  id?: string;
  name?: string,
  url?: string,
  isDefault?: boolean,
}

export interface Pose extends Motion {
}


export interface TextList {
  id?: string,
  category: string,
  comment: string,
  japanese: string,
  english?: string,
  index?: number,
  isDeleted?: boolean
  createdAt?: any,
}

export interface ErrorsVideo {
  url: string,
  startHours: string,
  startMinutes: string,
  startSeconds: string,
  endHours: string,
  endMinutes: string,
  endSeconds: string,
}

export interface ExtraChapter {
  id?: string,
  createdAt?: any,
  isDeleted?: boolean,
  updatedAt?: any,
  contentId?: string,
  chapterIndex?: number,
  extraChapterType?: string,
  url?: string,
  title?: string,
  description?: string,
  thumbnail?: string,
}

export interface TimeStartEnd { //for youtube/vimeo
  startHour: number,
  startMinute: number,
  startSecond: number,
  endHour: number,
  endMinute: number,
  endSecond: number,
}

export interface YoutubeChapter extends ExtraChapter {
  duration?: number,
  timeStartEnd?: TimeStartEnd,
}

export interface VimeoChapter extends YoutubeChapter {
  isSettingCube?: boolean,
}

export interface LinkAndSlideChapter extends ExtraChapter {
  buttonTitle?: string,
  isSettingCube?: boolean,
}

export interface Studio {
  id?: string,
  userId?: string,
  name?: string,
  authorName?: string,
  avatar?: string,
}

export interface Model {
  id?: string
  name?: string
  context?: string
  isDeleted?: boolean
}

export interface VersionChatGpt extends Model {
  selected?: boolean

  [p: string]: unknown
}

interface ContentCheckData {
  id: string,
  title?: string,
  thumbnail?: string,
}

interface ChapterCheckData {
  id: string,
  title?: string,
  thumbnail?: string,
  contentId?: string,
}


export interface DataCheck {
  checkedUseChapter: boolean,
  checkedVoiceBlock?: boolean,
  contentData?: ContentCheckData[],
  chapterData: ChapterCheckData[],
}

export type Plan = typeof plans[number]
