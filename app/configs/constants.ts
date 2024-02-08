import {CF_EMAIL, OWNER_IDS} from "../../common/ownerId";
import {Enecolor, GroupTextV2} from "@/app/types/block";

const NEXT_PUBLIC_APP_ENV = process.env.NEXT_PUBLIC_APP_ENV
export const IS_PRODUCTION = NEXT_PUBLIC_APP_ENV === "production"
export const ACCESS_TOKEN_KEY = 'accessToken';
export const ID_TOKEN_KEY = 'idToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';
export const LOGIN_KEY = 'login';
export const REGISTER_KEY = 'register';
export const ACCOUNTS_KEY = 'accounts';
export const USER_INFO_KEY = 'userInfo';
export const LANGUAGE_KEY = 'language';
export const REDIRECT_URL_KEY = 'service_redirect_url';
export const USER_INFO_CHANGED_KEY = 'userInfoChanged';
export const LAST_LOGIN_KEY = 'last_login';
export const COOKIE_GENIAM_ACCESS_TOKEN_KEY = `ge_${NEXT_PUBLIC_APP_ENV}_accessToken`
export const COOKIE_GENIAM_REFRESH_TOKEN_KEY = `ge_${NEXT_PUBLIC_APP_ENV}_refreshToken`
export const COOKIE_GENIAM_USER_INFO_KEY = `ge_${NEXT_PUBLIC_APP_ENV}_userInfo`
export const FB_RESPONSE_KEY = 'fbLoginStatusResponse'
export const IS_SOCIAL_SIGN_IN = 'isSocialSignIn'

export const DATA_SELECT_STRUCTURE = [
  {value: 'text', label: '文字列'},
  {value: 'number', label: '数値'},
  {value: 'image', label: '画像'},
  {value: 'array', label: '配列'},
  {value: 'data', label: 'データ構造'}
]

export const DEFAULT_COLOR = [
  '#FF1717',
  '#FF5C00',
  '#FF9900',
  '#E1CB02',
  '#7EE100',
  '#00E14D',
  '#00E1E1',
  '#1790FF',
  '#0029FF',
  '#7000FF',
  '#BE0072',
  '#BE0022',
  '#690003',
  '#634100',
  '#0E6300',
  '#002863',
  '#3D0063',
  '#292929',
  '#5C5C5C',
  '#939393'
]

export const SELECTED_BUTTON = [
  {type: 'countDown', text: 'カウントダウン', color: '#ff0000'},
  {type: 'countUp', text: 'カウントアップ', color: 'white'},
]


export const SLIDE_SHOW = {
  layers: [
    {text: 'メンタロイドの後', value: 'after', color: '#F5BA15'},
    {text: 'メンタロイドの前', value: 'before', color: 'white'}
  ],
  showData: [
    {text: '表示', value: 'text', color: '#F5BA15'},
    {text: '非表示', value: 'image', color: 'white'}
  ],
  positions: [
    {text: '左', value: 'left', color: '#F5BA15'},
    {text: '中央', value: 'center', color: 'white'},
    {text: '右', value: 'right', color: 'white'}
  ]
}

export const SLIDE_ACTION = [
  {text: "更新", value: "change", color: "#F5BA15"},
  {text: "終了", value: "end", color: "white"},
];

export const MOTION = [
  {text: '通常', value: 'normal', color: '#F5BA15'},
  {text: '幸福', value: 'happiness', color: 'white'},
  {text: '悲哀', value: 'sadness', color: 'white'},
  {text: '怒気', value: 'anger', color: 'white'},
  {text: '囁き', value: 'whisper', color: 'white'},
]

export const DEFAULT_POS = 'center'

// Akira-DNN
// Hikari-DNN
// Risa-DNN
// Takeru-DNN
// Yuina-DNN
// Show-DNN
export const OptionSpeaker = [
  {
    value: "Mayu",
    label: "Mayu (女性)",
  },
  {
    value: "Hikari-DNN",
    label: "Hikari (女性)",
  },
  {
    value: "Risa-DNN",
    label: "Risa (女性)",
  },
  {
    value: "Yuina-DNN",
    label: "Yuina (女性)",
  },
  {
    value: "Takeru-DNN",
    label: "Takeru (男性)",
  },
  {
    value: "Show-DNN",
    label: "Show (男性)",
  },
  {
    value: "Akira-DNN",
    label: "Akira (男性)",
  },
  {
    value: "Tsuna",
    label: "Tsuna (キャラクター)",
  },
  {
    value: "Robota",
    label: "Robota (キャラクター)",
  },
  {
    value: "noVoice",
    label: "音声無し",
  }
];

export const OptionMayuEmotionLevel = [
  {
    value: 1,
    label: "1",
  },
  {
    value: 2,
    label: "2",
  },
  {
    value: 3,
    label: "3",
  },
  {
    value: 4,
    label: "4",
  }
];

export const OptionTsunaEmotionLevel = [
  {
    value: 1,
    label: "1",
  },
  {
    value: 2,
    label: "2",
  }
];
export const NO_VARIABLE_TEXT = 'noVariableText'
export const PROMPT = 'prompt'
export const CHAT_GTP_ANSWER = 'chatGPTAnswer'
export const MULTI_PROMPT_INPUT_ANSWER = 'multiPromptInputAnswer'
export const MULTI_PROMPT_WITHOUT_CHAR_ANSWER = 'withoutChar_multiPromptInputAnswer'
export const PROMPT_INPUT = 'promptInput'
export const PROMPT_V2 = 'promptV2'
export const PROMPT_INPUT_V2 = 'promptInputV2'
export const PROMPT_INPUT_WITHOUT_CHAR = 'withoutChar_promptInput'
export const PROMPT_INPUT_WITHOUT_CHAR_V2 = 'withoutChar_promptInputV2'
export const PROMPT_WITHOUT_CHAR = 'withoutChar_prompt'
export const PROMPT_WITHOUT_CHAR_V2 = 'withoutChar_promptV2'
export const MULTI_PROMPT_INPUT = 'multiPromptInput'
export const MULTI_PROMPT_INPUT_V2 = 'multiPromptInputV2'
export const MULTI_PROMPT_INPUT_WITHOUT_CHAR = 'withoutChar_multiPromptInput'
export const MULTI_PROMPT_INPUT_WITHOUT_CHAR_V2 = 'withoutChar_multiPromptInputV2'

export const QA_DOCS_BLOCK = 'qaDocumentsStruct'

export const PROMPT_TYPES = [
  PROMPT, PROMPT_V2,
  PROMPT_WITHOUT_CHAR, PROMPT_WITHOUT_CHAR_V2,
  PROMPT_INPUT, PROMPT_INPUT_V2,
  PROMPT_INPUT_WITHOUT_CHAR, PROMPT_INPUT_WITHOUT_CHAR_V2,
  MULTI_PROMPT_INPUT, MULTI_PROMPT_INPUT_V2,
  MULTI_PROMPT_INPUT_WITHOUT_CHAR, MULTI_PROMPT_INPUT_WITHOUT_CHAR_V2
]

export const PROMPT_ANSWER_TYPES = [
  CHAT_GTP_ANSWER,
  MULTI_PROMPT_INPUT_ANSWER,
  MULTI_PROMPT_WITHOUT_CHAR_ANSWER,
]

export const PROMPT_ALL_TYPES = [
  PROMPT, PROMPT_V2,
  PROMPT_WITHOUT_CHAR, PROMPT_WITHOUT_CHAR_V2,
  PROMPT_INPUT, PROMPT_INPUT_V2,
  PROMPT_INPUT_WITHOUT_CHAR, PROMPT_INPUT_WITHOUT_CHAR_V2,
  MULTI_PROMPT_INPUT, MULTI_PROMPT_INPUT_V2,
  MULTI_PROMPT_INPUT_WITHOUT_CHAR, MULTI_PROMPT_INPUT_WITHOUT_CHAR_V2,
  CHAT_GTP_ANSWER,
  MULTI_PROMPT_INPUT_ANSWER,
  MULTI_PROMPT_WITHOUT_CHAR_ANSWER,
]


export const TIMER_START = 'timer_start'
export const TIMER_END = 'timer_end'
export const TIMER_TRIGGER = 'time_trigger'
export const IF_START = 'if_start'
export const IF_END = 'if_end'
export const FOR_START = 'for_start'
export const FOR_END = 'for_end'
export const RECORD_START = 'record_start'
export const RECORD_END = 'record_end'
export const EXIT_IMAGE = 'exit_image'
export const START_IMAGE = 'start_image'
export const UROID_NAME = 'uRoid_name'
export const UROID_DES = 'uRoid_description'
export const UROID_THUMB = 'uRoid_thumbnail'
export const UROID_DEFAULTIMAGE = 'uRoid_defaultImage'
export const UROID_DEFAULT_IMAGE_CHOICE = 'uRoid_defaultImageChoice'
export const UROID_DEFAULT_IMAGE_RANDOM = 'uRoid_defaultImageRandom'
export const UROID_DEFAULTVOICE = 'uRoid_defaultVoice'
export const UROID_CHARPROMPT_HEADER = 'uRoid_characterPromptHeader'
export const UROID_CHARPROMPT_FOOTER = 'uRoid_characterPromptFooter'

export const FULL_FIELD_UROID = [UROID_NAME, UROID_DES, UROID_THUMB, UROID_DEFAULTVOICE, UROID_CHARPROMPT_HEADER, UROID_CHARPROMPT_FOOTER]
export const IMAGE_TYPE_UROID = [UROID_DEFAULTIMAGE, UROID_DEFAULT_IMAGE_CHOICE, UROID_DEFAULT_IMAGE_RANDOM]
export const YOUTUBE = 'youtube'
export const VIMEO = 'vimeo'
export const VIDEO = 'video'

export const TEXT = 'text'
export const ENECOLOR_RANK_TEXT = 'enecolor_rank_text'
export const ENECOLOR_RANK_TEXT_V2 = 'enecolor_rank_textV2'
export const ENECOLOR_RANK_IMG = 'enecolor_rank_img'
export const ENECOLOR_RANK_IMG_V2 = 'enecolor_rank_imgV2'
export const TEXT_V2 = 'textV2'
export const ADD_ONE_TEXT = 'addOneText'
export const ADD_ALL_TEXT = 'addAllText'
export const TYPE_TEXT_BLOCK = [TEXT, TEXT_V2, ENECOLOR_RANK_TEXT, ADD_ONE_TEXT, ADD_ALL_TEXT, PROMPT, PROMPT_V2,
  CHAT_GTP_ANSWER, PROMPT_WITHOUT_CHAR, PROMPT_WITHOUT_CHAR_V2, NO_VARIABLE_TEXT, MULTI_PROMPT_INPUT_ANSWER, MULTI_PROMPT_WITHOUT_CHAR_ANSWER]
export const LIST_PROMT_INPUT = [PROMPT_INPUT, PROMPT_INPUT_V2,
  PROMPT_INPUT_WITHOUT_CHAR, PROMPT_INPUT_WITHOUT_CHAR_V2,
  MULTI_PROMPT_INPUT, MULTI_PROMPT_INPUT_V2,
  MULTI_PROMPT_INPUT_WITHOUT_CHAR, MULTI_PROMPT_INPUT_WITHOUT_CHAR_V2]
export const INPUT_ENECOLOR_TEXT = 'inputEnecolorText'
export const INPUT_ENECOLOR_IMAGE = 'inputEnecolorImage'
export const plans = ["free", "pro", "team", "enterprise", "superadmin"] as const

export const PRO = 'プロ'
export const FREE = 'フリー'
export const TEAM = 'チーム'
export const ENTERPRISE = 'エンタープライズ'
export const SUPER_ADMIN = 'スーパーアドミン'

export const ONLY_DEEP_LINK = 'onlyDeepLink'
export const TEST_MODE = 'testMode'
export const ONLY_ME = 'onlyMe'
export const PRODUCTION_MODE = 'productionMode'

export const InitEnecolor = {
  name: '',
  output_type: "enecolor_4_rank",
  groupsText: {
    rank: 1,
    color: '',
    groups: ['', '', '', ''],
    userInput: '',
  } satisfies GroupTextV2,
} satisfies Enecolor

export const regexGetVar = /{{([^{}]+)}}/g;

export const regexDecimal = /^\d*\.?\d*$/

export const isCF = (user) => {
  return user?.email?.endsWith(CF_EMAIL);
}

export const isSuperAdmin = (user) => {
  return OWNER_IDS.includes(user?.user_id);
}

export const isDev = () => {
  return process.env.NEXT_PUBLIC_APP_ENV === "dev"
}
export const isProd = () => {
  return process.env.NEXT_PUBLIC_APP_ENV === "production"
}
export const isStg = () => {
  return process.env.NEXT_PUBLIC_APP_ENV === "stg"
}

export const publicAppEnv = () => {
  return process.env.NEXT_PUBLIC_APP_ENV;
}

const replaceDoubleSlash = (path: string) => {
  return path.replace(/\/\//g, '/')
}
export const mentoroidApiUrl = (path?: string) => {
  return (process?.env?.NEXT_PUBLIC_MENTOROID_API ?? '') + path || '';
}
export const mentoroidApiClientUrl = (path?: string) => {
  return replaceDoubleSlash(mentoroidApiUrl('/client' + path));
}
export const mentoroidApiClientChapterUri = (id: string) => {
  return replaceDoubleSlash(mentoroidApiClientUrl('/chapters/' + id));
}

