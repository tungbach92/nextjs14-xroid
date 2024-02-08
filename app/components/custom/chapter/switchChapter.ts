import {Chapter} from "@/app/types/types";

type props = {
  type?: string,
  listOnlyChapter?: Chapter[],
  chapterId?: string,
  contentId?: string,
  subFolderId?: string | string[] | undefined,
  setStuffAfterSwitchChapter?: () => void,
  router?: any

}
export const changeChapter = ({
                                type,
                                listOnlyChapter,
                                chapterId, contentId,
                                subFolderId,
                                setStuffAfterSwitchChapter,
                                router
                              }: props) => {
  const indexOnActiveChapter = listOnlyChapter?.findIndex(item => item.id === chapterId)
  if (type === 'prev' && indexOnActiveChapter > 0) {
    if (!subFolderId) {
      router.push(`/contents/${contentId}/${listOnlyChapter[indexOnActiveChapter - 1]?.id}`).then(e => setStuffAfterSwitchChapter())
    } else {
      router.push(`/contents/subFolder/${subFolderId}/subContent/${contentId}/${listOnlyChapter[indexOnActiveChapter - 1]?.id}`).then(e => setStuffAfterSwitchChapter())
    }
  }

  if (type === 'next' && indexOnActiveChapter < listOnlyChapter.length - 1) {
    if (!subFolderId) {
      router.push(`/contents/${contentId}/${listOnlyChapter[indexOnActiveChapter + 1]?.id}`).then(e => setStuffAfterSwitchChapter())
    } else {
      router.push(`/contents/subFolder/${subFolderId}/subContent/${contentId}/${listOnlyChapter[indexOnActiveChapter + 1]?.id}`).then(e => setStuffAfterSwitchChapter())
    }
  }
}
