import {Enumerate} from "@/app/types/computedRange";
import {EmbedData} from "@/app/types/types";
import {separateSettings} from "@/app/types/commonType";

export interface Basic {
  freeAll?: boolean,
  purchaseAll?: boolean,
  waitForFree?: boolean
}

interface Chapter {
  free?: number[],
  purchase?: number,
  waitForFree?: number[],
  listChanged?: string[],
  changed?: boolean
}

export interface CubeOptions {
  cube?: number,
  basic?: Basic,
  chapter?: Chapter
}

export type ReleaseOptionsType = 'none' | 'weekly' | 'biweekly' | 'monthly'

export interface ReleaseOptions {
  type?: ReleaseOptionsType,
  day?: Enumerate<7>,
  week?: Enumerate<6>
}

export interface Content {
  categories?: { id: string, index: number }[],
  id?: string,
  userId?: string,
  title?: string,
  deeplink?: string,
  imageTitle?: string,
  thumbnail?: string,
  dataStructureIds?: string[],
  mentoroids?: string[],
  folderId?: string,
  description?: string,
  cubeOptions?: CubeOptions,
  releaseOptions?: ReleaseOptions,
  viewOptions?: string[],
  isDeleted?: boolean,
  categoriesId?: string[],
  isAbleComment?: boolean,
  schoolAI?: boolean
  businessB?: boolean
  withFriend?: boolean
  adviceC?: boolean
  createdAt?: any,
  updatedAt?: any,
  separateSettings?: separateSettings,
  embedData?: EmbedData
}

export interface ContentState {
  id?: string,
  viewOptions?: string[],
  thumb?: string,
  previewUrl?: string,
  title?: string,
  imageTitle?: string,
  description?: string,
  cube?: number,
  waitForFree?: boolean,
  freeAll?: boolean,
  purchaseAll?: boolean,
  mentoroid?: string[],
  waitForFreeData?: number[],
  purchaseData?: number,
  freeData?: number[],
  url?: string,
  showQRCode?: boolean,
  saveLoading?: boolean,
  deepLink?: string,
  releaseOptions?: ReleaseOptions
  previewImageTitle?: string,
  checkActive?: string
  categoriesId?: string[]
  categories?: { id: string, index: number }[]
  isAbleComment?: boolean
  schoolAI?: boolean
  businessB?: boolean
  withFriend?: boolean
  adviceC?: boolean
  listChanged?: string[]
  changed?: boolean,
  separateSettings?: separateSettings,
  embedData?: EmbedData,
}

export type ContentStateValues = ContentState[keyof ContentState]
