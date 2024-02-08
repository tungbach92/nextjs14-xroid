import {iconImg} from "@/app/components/assets/image/icon";

const navSidebar = [
  {
    icon: "/icons/content-icon.svg",
    name: "コンテンツ",
    path: "/contents",
  },
  // {
  //   icon: "/icons/script-sample-icon.svg",
  //   name: "シナリオテンプレート",
  //   path: "/templates",
  // },
  // {
  //   icon: "/icons/block-icon.svg",
  //   name: "ブロックセット",
  //   path: "/blocks",
  // },
  {
    icon: "/icons/data-structure-icon.svg",
    name: "データ構造",
    path: "/structures",
  },
  {
    icon: "/icons/media-icon.svg",
    name: "メディア",
    path: "/images",
  },
  // {
  //   icon: "/icons/music-icon.svg",
  //   name: "オーディオ",
  //   path: "/audios",
  // },
  // {
  //   icon: "/images/spread-sheet.png",
  //   name: "スプレッドシート",
  //   path: "/spreadsheets",
  // },
  {
    icon: "/images/slide.png",
    name: "スライド",
    path: "/slides",
  },
  {
    icon: "/icons/ai_icon.svg",
    name: "AIの管理",
    path: "/associateAI",
  },
  {
    icon: iconImg.enecolorPage,
    name: "エネカラー",
    path: "/enecolors",
  },
  {
    icon: "/icons/userRoid.svg",
    name: "User ロイド",
    path: "/userRoids",
  },
  {
    icon: "/icons/nerve-icon.svg",
    name: "メンタロイド",
    path: "/mentaloids",
  },
  {
    icon: "/icons/bannerPopup.svg",
    name: "バナー&ポップアップ",
    path: "/bannerPopup",
  },
  {
    icon: "/icons/category.svg",
    name: "カテゴリー",
    path: "/categories",
  }
];

const permission = [
  {
    label: 'Viewer',
    value: 'viewer',
  },
  {
    label: 'Commenter',
    value: 'commenter',
  },
  {
    label: 'Editor',
    value: 'editor',
  },
]

export {navSidebar, permission};
