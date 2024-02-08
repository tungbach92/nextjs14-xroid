import {useEffect} from "react";
import {useCollection} from "react-firebase-hooks/firestore";
import {contentsRef} from "@/app/common/firebase/dbRefs";
import {contentsAtom} from "@/app/store/atom/contents.atom";
import {useAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";

export const useContents = () => {
  const [contents, setContents] = useAtom(contentsAtom)
  const [userInfo] = useAtom<any>(userAtomWithStorage);
  const userId = userInfo?.user_id;
  const _contentsRef = userId && contentsRef(userId)
  const [values, loadingContentsData, error] = useCollection(_contentsRef)
  useEffect(() => {
    if (error || loadingContentsData || (!loadingContentsData && !values))
      return setContents(null);
    const _contents = values.docs.map((document) => {
        return {
          ...document.data(),
          id: document.id,
        }
      }
    )
    setContents(_contents)
  }, [values, error, loadingContentsData, userId])

  return {contents, loadingContentsData, error};
}
