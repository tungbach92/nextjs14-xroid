import {initialState} from "@/app/components/Content/data/data";
import {chapterIndex} from "@/app/common/getMaxChapterIndex";
import {createDataChapter} from "@/app/common/commonApis/chaptersApi";
import {toast} from "react-toastify";

export const createBannerChapter = async (contentId, state, bannerLink, chapters, buttonTitle, bannerTitle, description) => {
  try {
    const data = {
      contentId: contentId,
      thumbnail: state.url || initialState.url,
      isTool: false,
      isBanner: true,
      cube: 0,
      bannerLink: bannerLink || '',
      chapterIndex: chapterIndex(chapters),
      buttonTitle: buttonTitle,
      bannerTitle: bannerTitle,
      bannerDescription: description
    }
    await createDataChapter(data)
    toast.success('チャプターを作成しました', {autoClose: 3000})
  } catch (e) {
    console.log(e);
  }
}
