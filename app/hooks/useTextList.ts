import {useEffect} from "react";
import {useTextListAtom} from "@/app/store/atom/textList.atom";
import {orderBy} from "lodash";
import {useCollection} from "react-firebase-hooks/firestore";
import {useAtom} from "jotai";
import {textCollRef} from "@/app/common/firebase/dbRefs";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";

export default function useTextList() {
  const [textList, setTextList] = useTextListAtom();
  const [userInfo] = useAtom(userAtomWithStorage);

  const [dataSnap, loading, error] = useCollection(textCollRef(userInfo?.user_id || ""));
  useEffect(() => {
    if (error || loading || (!loading && !dataSnap))
      return setTextList(null);
    const newData = dataSnap.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      }
    })
    const sortData = orderBy(newData, ["updatedAt"], ["desc"])
      // @ts-ignore
    setTextList(sortData)
  }, [userInfo?.user_id, dataSnap, error, loading])

  return {textList, loading, error}
}
