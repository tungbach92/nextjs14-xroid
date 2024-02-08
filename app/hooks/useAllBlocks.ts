import {useEffect, useState} from "react";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {allHistoriesRef} from "@/app/common/firebase/dbRefs";
import {useAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";

export const useAllHistories = (chapterId: string) => {
  const [allHistories, setAllHistories] = useState<any[]>([])
  const [userInfo] = useAtom(userAtomWithStorage)
  const allHistoriesColRef = chapterId && userInfo?.user_id && allHistoriesRef(userInfo?.user_id, chapterId)
  const [value, loading, error] = useCollectionData(allHistoriesColRef);

  useEffect(() => {
    if (error || loading || (!loading && !value)) {
      setAllHistories([])
      return
    }
    const _allHistories = value.map((document) => {
        return {
          ...document,
          id: document.id,
        }
      }
    )
    setAllHistories(_allHistories)
  }, [value, error, loading, userInfo])
  return {allHistories}
}
