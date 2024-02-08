export const fetchEmbedVideo = async (videoId: string, typeData: string) => {
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&part=${typeData}`
  try {
    const res = await fetch(url)
    return res.json()
  } catch (e) {
    console.log(e);
    return null
  }
}

export const fetchEmbedVimeo = async (url: string) => {
  try {
    const res = await fetch(url)
    return res.json()
  } catch (e) {
    console.log(e);
    return null
  }
}
