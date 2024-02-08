export const getColorJpName = (color: string) => {
  switch (color) {
    case 'Y':
      return '黄'
    case 'R':
      return '赤';
    case 'G':
      return '緑';
    case 'B':
      return '青';
    case 'ROS':
      return '赤 情熱'
    case 'RCS':
      return '赤 突破'
    case 'RCG':
      return '赤 覚悟'
    case 'ROG':
      return '赤 根性'
    case 'YOS':
      return '黄 楽天'
    case 'YCS':
      return '黄 自由'
    case 'YCG':
      return '黄 熱中'
    case 'YOG':
      return '黄 気楽'
    case 'GOS':
      return '緑 愛情'
    case 'GCS':
      return '緑 信頼'
    case 'GCG':
      return '緑 配慮'
    case 'GOG':
      return '緑 慈愛'
    case 'BOS':
      return '青 探求'
    case 'BCS':
      return '青 追究'
    case 'BCG':
      return '青 研磨'
    case 'BOG':
      return '青 冷静'
    default:
      return;
  }
}
