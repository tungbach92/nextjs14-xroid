import {getUriPublicImageFolder} from "@/app/utils/image";

const folder = "banner";

function getUri(name: string) {
  return getUriPublicImageFolder(name, folder);
}

export const bannerImg = {
  bannerRabbit1: getUri("rabbit_1.svg"),
  bannerRabbit2: getUri("rabbit_2.svg"),
  bannerRectangle: getUri("Rectangle_3.svg"),
  bgButtonChat: getUri("bg_button_chat.svg"),
  bannerVideo: getUri("banner_video.svg"),
};
