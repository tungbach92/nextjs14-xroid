import {SetStateAction, useEffect} from "react";
import {Chapter} from "@/app/types/types";

export const useSetViewOptionByContent = (viewOptions: string[], setChapter: React.Dispatch<SetStateAction<Chapter>>, chapter: Chapter) => {
  useEffect(() => {
    if (viewOptions && chapter?.isPublicByContent)
      setChapter({viewOptions: Array.from(new Set([...chapter.viewOptions, ...viewOptions]))})
  }, [viewOptions])
}
