import {ContentState, ReleaseOptions} from "@/app/types/content";
import {IMAGE_ONLY} from "@/app/common/constants";
import {ONLY_ME} from "@/app/configs/constants";

export const initialData = [0, 0];
export const initReleaseOptions: ReleaseOptions = {
  type: 'none',
  day: 1,
  week: 1,
}
export const initialState: ContentState = {
  viewOptions: [ONLY_ME],
  thumb: "",
  previewUrl: "",
  title: "",
  imageTitle: "",
  description: "",
  cube: 0,
  waitForFree: false,
  freeAll: false,
  purchaseAll: false,
  mentoroid: ['rabbit', 'ena', 'mentoroid'],
  waitForFreeData: initialData,
  purchaseData: 0,
  freeData: initialData,
  url: "",
  showQRCode: false,
  saveLoading: false,
  releaseOptions: initReleaseOptions,
  previewImageTitle: "",
  checkActive: IMAGE_ONLY,
  categoriesId: [],
  isAbleComment: true,
  schoolAI: false,
  businessB: false,
  withFriend: false,
  adviceC: false,
  categories: [],
  separateSettings: {
    course: '',
    title: '',
    description: '',
    thumbnail: '',
  },
  embedData: {
    embedWidth: '',
    embedHeight: '',
    embedHtml: '',
    isResponsive: true,
    src: ''
  },
  id: '',
}
export const mentoroiList = [
  {
    id: 1,
    src: "/icons/content/avt_rabbit.svg"
  },
  {
    id: 2,
    src: "/icons/content/img2.png"
  },
  {
    id: 3,
    src: "/icons/content/img1.png"
  }
]

export const numericalOrder = [
  {value: 1, label: '第1'},
  {value: 2, label: '第2'},
  {value: 3, label: '第3'},
  {value: 4, label: '第4'},
  {value: 5, label: '第5'},
  {value: 0, label: '第6'},
]
export const selectDay = [
  {value: 1, label: '月曜日'},
  {value: 2, label: '火曜日'},
  {value: 3, label: '水曜日'},
  {value: 4, label: '木曜日'},
  {value: 5, label: '金曜日'},
  {value: 6, label: '土曜日'},
  {value: 0, label: '日曜日'},
]

export const selectSchedule = [
  {value: 'weekly', title: '毎週'},
  {value: 'biweekly', title: '隔週'},
  {value: 'monthly', title: '毎月'},
  {value: 'none', title: '不定期'},
]
