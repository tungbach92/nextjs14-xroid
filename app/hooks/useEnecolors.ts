import {useEffect} from "react";
import {useAtom, useSetAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {useCollection} from "react-firebase-hooks/firestore";
import {enecolorsCollRef} from "@/app/common/firebase/dbRefs";
import {enecolorsAtom} from "@/app/store/atom/enecolors.atom";
import {Enecolor} from "@/app/types/block";
import {orderBy} from "lodash";

export default function useEnecolors() {
  const [enecolors,setEnecolors] = useAtom(enecolorsAtom);
  const [userInfo] = useAtom(userAtomWithStorage);
  const [values, loading, error] = useCollection(enecolorsCollRef(userInfo?.user_id || ""));
  useEffect(() => {
    if (error || loading || (!loading && !values))
      return setEnecolors(null);
    const _enecolors: Enecolor[] = values.docs.map((doc) => {
      return {
        id: doc.id,
        name: doc.data().name,
        groupsText: doc.data().groupsText,
        userInput: doc.data().userInput,
        ...doc.data(),
      }
    })
    setEnecolors(_enecolors)
  }, [userInfo?.user_id, values, error, loading])

  return {loading,enecolors}
}
