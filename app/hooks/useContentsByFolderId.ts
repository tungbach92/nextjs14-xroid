import {useEffect, useState} from "react";
import {contentsByFolderIdRef} from "@/app/common/firebase/dbRefs";
import {useAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {useCollection} from "react-firebase-hooks/firestore";
import {Content} from "@/app/types/content";
import {arrangeAtomWithStorage} from "@/app/store/atom/arrange.atom";

export const useContentsByFolderId = (folderId: string) => {
  const [contents, setContents] = useState<Content[]>(null)
  const [userInfo] = useAtom<any>(userAtomWithStorage);
  const [arrange, setArrange] = useAtom<number>(arrangeAtomWithStorage);
  const userId = userInfo?.user_id;
  const _contentsRef = userId && contentsByFolderIdRef(userId, folderId, arrange)
  const [values, loading, error] = useCollection(_contentsRef)
  useEffect(() => {
    if (error || loading || (!loading && !values))
      return setContents(null);
    const _contents = values.docs.map((document) => {
        return {
          ...document.data(),
          id: document.id,
        }
      }
    )
    setContents(_contents)
  }, [values, error, loading])
  return {contents, loading, error};
}
