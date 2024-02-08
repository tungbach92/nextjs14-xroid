import axios from 'axios'

export const getDeeplink = async ({
  scenarioId = "",
  contentId = "",
  chapterId = ""
}) => {
  try {
    const path = process.env.NEXT_PUBLIC_MENTOROID_API
    const result = await axios.post(path + '/v2/unilink', {
      scenarioId,
      contentId,
      chapterId
    })
    const result2 = result?.data?.data?.unilink
    return {deeplink: result2}
  } catch (err) {
    console.log(err);
    return {deeplink: ''}
  }
}
