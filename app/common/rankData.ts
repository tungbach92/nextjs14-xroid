export const rankData = (value: string) => {
  let result = [];
  switch (value) {
    case 'enecolor_4_rank':
      while (result.length < 4) {
        result.push({label: `${result.length + 1}位`, value: result.length + 1})
      }
      break
    case 'enecolor_4':
      result = [
        {label: '黄', value: 'Y'},
        {label: '赤', value: 'R'},
        {label: '緑', value: 'G'},
        {label: '青', value: 'B'},
      ]
      break
    case 'enecolor_16_rank':
      while (result.length < 16) {
        result.push({label: `${result.length + 1}位`, value: result.length + 1})
      }
      break
    case 'enecolor_16':
      result = [
        {label: '赤 情熱', value: 'ROS'},
        {label: '赤 突破', value: 'RCS'},
        {label: '赤 覚悟', value: 'RCG'},
        {label: '赤 根性', value: 'ROG'},
        {label: '黄 楽天', value: 'YOS'},
        {label: '黄 自由', value: 'YCS'},
        {label: '黄 熱中', value: 'YCG'},
        {label: '黄 気楽', value: 'YOG'},
        {label: '緑 愛情', value: 'GOS'},
        {label: '緑 信頼', value: 'GCS'},
        {label: '緑 配慮', value: 'GCG'},
        {label: '緑 慈愛', value: 'GOG'},
        {label: '青 探求', value: 'BOS'},
        {label: '青 追究', value: 'BCS'},
        {label: '青 研磨', value: 'BCG'},
        {label: '青 冷静', value: 'BOG'},
      ]
  }
  return result;
}

