import {doc} from "firebase/firestore";
import {useDocumentData} from "react-firebase-hooks/firestore";
import {db} from "@/app/configs/firebase";
import {useEffect, useReducer, useState} from "react";
import {Chapter} from "@/app/types/types";
import {atom, useAtom, useSetAtom} from "jotai";
import {ONLY_DEEP_LINK, ONLY_ME} from "@/app/configs/constants";
import {useRouter} from "next/navigation";


const chapterAtom = atom({})
export const useChapterAtom = () => useAtom<Chapter>(chapterAtom);

function useChapter(id: string) {
  const router = useRouter()
  const createURoid = router.query?.isCreateURoid

  const initialChapter: Chapter = {
    isAbleComment: true,
    isPublicByContent: false,
    viewOptions: [ONLY_ME, ONLY_DEEP_LINK],
    chapterType: createURoid === 'true' ? 'createURoid' : 'standard',
    mentoroids: [],
    uRoidTemplateIds: [],
    uRoidName: '',
    embedData: {
      embedWidth: '100%',
      embedHeight: '100%',
      embedHtml: '',
      isResponsive: true,
      src: ''
    },
    separateSettings: {
      course: '',
      title: '',
      description: '',
      thumbnail: '',
    }
  }

  const [chapter, setChapter] = useReducer((prev: Chapter, next: Chapter) => {
    if (next)
      return {...prev, ...next}
    else
      return initialChapter
  }, initialChapter)
  const [oldChapter, setOldChapter] = useState<Chapter>(null)
  const setCurrChapter = useSetAtom(chapterAtom)
  const docRef = id && doc(db, "chapters", id);
  const [value, loading, error] = useDocumentData(docRef);

  useEffect(() => {
    if (error || loading || (!loading && !value)) {
      setChapter(null)
      setOldChapter(null)
      return
    }
    const _chapter = {
      ...value,
      mentoroids: value.mentoroids?.concat(value.uRoidTemplateIds ?? []) ?? value.actionCharacterIds ?? [],
      uRoidTemplateIds: value.uRoidTemplateIds || [],
      separateSettings: value.separateSettings || initialChapter.separateSettings,
    }
    setCurrChapter(_chapter)
    setChapter(_chapter)
    setOldChapter(_chapter)
  }, [value, error, loading])

  return {chapter, oldChapter, setChapter, loading, error};
}

export default useChapter;
