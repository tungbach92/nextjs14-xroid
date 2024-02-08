import {fetchEmbedVideo, fetchEmbedVimeo} from "@/app/common/constants/fetchEmbedVideo";
import {convertISO8601} from "@/app/common/convertISO8601";

const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;


export const fetchMetadata = async (isVimeo, metadata, setMetadata, extraChapter) => {
  if (extraChapter) return; // get only one time at first time paste link when create extra chapter
  let _duration: number
  if (!isVimeo) {
    const match = metadata?.url.match(regExp);
    if (!match) return;
    const videoId = match[1];
    try {
      const response = await fetchEmbedVideo(videoId, 'snippet')
      const responseContentDetails = await fetchEmbedVideo(videoId, 'contentDetails')
      const dataPreview = response.items[0].snippet
      const dataContentDetails = responseContentDetails.items[0].contentDetails
      if (responseContentDetails?.items?.length > 0) {
        const durationISO8601 = dataContentDetails?.duration ?? "";
        _duration = convertISO8601(durationISO8601)
      }
      setMetadata({
        ...metadata,
        timeStartEnd: {
          startHour: 0,
          startMinute: 0,
          startSecond: 0,
          endHour: _duration >= 3600 ? Math.floor(_duration / 3600) : 0,
          endMinute: _duration >= 60 ? Math.floor((_duration % 3600) / 60) : 0,
          endSecond: _duration >= 60 ? Math.floor(_duration % 60) : _duration || 0,
        },
        duration: _duration,
        description: dataPreview?.description,
        thumbnail: dataPreview.thumbnails.default.url,
        title: dataPreview.title,
      });
    } catch (error) {
      console.error('Error fetching YouTube metadata:', error);
    }
  } else {
    const apiVimeoUrl = `https://vimeo.com/api/oembed.json?url=${metadata?.url}`
    const res = await fetchEmbedVimeo(apiVimeoUrl)
    setMetadata({
      ...metadata,
      timeStartEnd: {
        startHour: 0,
        startMinute: 0,
        startSecond: 0,
        endHour: res?.duration >= 3600 ? Math.floor(res?.duration / 3600) : 0,
        endMinute: res?.duration >= 60 ? Math.floor((res?.duration % 3600) / 60) : 0,
        endSecond: res?.duration >= 60 ? Math.floor(res?.duration % 60) : res?.duration || 0,
      },
      duration: res?.duration,
      description: res?.description,
      thumbnail: res?.thumbnail_url,
      title: res?.title,
    })
  }
};
