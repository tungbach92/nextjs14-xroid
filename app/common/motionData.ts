export const motionData = [
  // {
  //   name: "メンタロイド",
  //   id: "mentroid_name",
  //   choice: [
  //     "エナ", "ラビック",
  //   ]
  // },

  {
    name: "動き",
    id: "motionType",
    choice: [
      "そのまま",
      "冷淡", "冷静", "固執", "批判", "探究", "研磨", "追求", "陶酔",
      "不安", "依存", "信頼", "妄信", "愛情", "慈愛", "犠牲", "配慮",
      "傲慢", "執着", "強引", "情熱", "憤怒", "根性", "突破", "覚悟",
      "自由", "中毒", "勝手", "夢想", "怠惰", "楽天", "気楽", "熱中", "適当"]
  },
  {
    name: "位置",
    id: "location",
    choice: ["そのまま", "左", "中", "右"]
  },
  {
    name: "反転",
    id: "flip",
    choice: ["そのまま", "反転あり", "反転なし"]
  },
  {
    name: "出現",
    id: "show",
    choice: ["そのまま", "出現", "消える"]
  }
]

export const defaultItem = {
  mentroid_name: "エナ",
  motionType: "そのまま",
  location: "そのまま",
  flip: "そのまま",
  show: "そのまま",
}

export const characterData = {
name: "メンタロイド",
id: "mentoroid_id",
choice: [
  {
    id: "rabbit_character_id",
    value: 'ラビック'
    },
    {
      id: "ena_character_id",
      value: 'エナ'
  },
  {
    id: "men_character_id",
    value: 'シン'
  },]
}
