import {useEffect, useState} from "react";
import {useCollection} from "react-firebase-hooks/firestore";
import {adminEnecolorsCollRef} from "@/app/common/firebase/dbRefs";
import {Enecolor} from "@/app/types/block";
import {orderBy} from "lodash";

export default function useAdminEnecolors() {
  const [adminEnecolors, setAdminEnecolors] = useState<Enecolor[]>([]);
  const [values, loading, error] = useCollection(adminEnecolorsCollRef());
  useEffect(() => {
    if (error || loading || (!loading && !values))
      return setAdminEnecolors(null);
    const _enecolors: Enecolor[] = values.docs.map((doc) => {
      return {
        id: doc.id,
        name: doc.data().name,
        groupsText: doc.data().groupsText,
        userInput: doc.data().userInput,
        ...doc.data(),
      }
    })
    setAdminEnecolors(_enecolors)
  }, [values, error, loading])

  return {adminEnecolors, loadingAdminEnecolors: loading}
}
