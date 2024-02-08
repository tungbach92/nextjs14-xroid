import {iconImg} from "@/app/components/assets/image/icon";

export const columns = [
  {
    id: 'category',
    label: 'カテゴリ',
    minWidth: 120,
    align: 'center',
  },
  {
    id: 'comment',
    label: 'メッセージ',
    minWidth: 250,
    align: 'center'
  },
  {
    id: 'action',
    label: 'アクション',
    minWidth: 170,
    align: 'center',
  }
];

export const tabData = [
  {label: 'シーン', value: '7', icon: iconImg.shinIcon},
  {label: 'テキスト', value: '1', icon: iconImg.textIcon},
  // {label: 'Control', value: '3'},
  {label: '画像', value: '4', icon: iconImg.imageIcon},
  {label: '動画', value: '5', icon: iconImg.videoIcon},
  {label: 'スライド', value: '9', icon: iconImg.slideIcon},
  {label: '入力', value: '6', icon: iconImg.inputIcon},
  {label: '制御', value: '11', icon: iconImg.controlIcon},
  {label: '解析モデル', value: '2', icon: iconImg.enecolorIcon},
  // {label: 'モーション', value: '8', icon: iconImg.motionIcon},
  {label: '言語生成AI', value: '10', icon: iconImg.gptAIIcon},
  // {label: '画像生成AI', value: '12', icon: iconImg.imageAIIcon},
  // {label: '動画生成AI', value: '13', icon: iconImg.videoAIIcon},
  // {label: 'uRoid', value: '14', icon: iconImg.uRoidIcon}
]
