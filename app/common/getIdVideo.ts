import {patternVimeo, patternYoutube} from "@/app/components/custom/chapter/screnarioContents/VideoTemplate";

export const getViMeoIdFromUrl = (url) => {
  const vimeoMatch = url.match(patternVimeo);
  if (vimeoMatch && vimeoMatch[1]) {
    return vimeoMatch[1];
  }
  return null;
};

export const getYoutubeVideoIdFromUrl = (url) => {
  const youtubeMatch = url.match(patternYoutube);
  if (youtubeMatch && youtubeMatch[5]) {
    return youtubeMatch[5];
  }
  return null;
};
