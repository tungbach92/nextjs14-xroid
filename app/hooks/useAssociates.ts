import {useCollection} from "react-firebase-hooks/firestore";
import {associateAIColRef} from "@/app/common/firebase/dbRefs";
import {useEffect, useState} from "react";
import {QaDocTemplate} from "@/app/types/qaDocTemplate";

export const useAssociateAIs = (userId: string) => {
  const [associateAIs, setAssociateAIs] = useState<QaDocTemplate[]>([])
  const [values, loading, error] = useCollection(associateAIColRef(userId));
  useEffect(() => {
    if (error || loading || (!loading && !values)) return setAssociateAIs([])
    const _associateAIs = values.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      }
    })
    setAssociateAIs(_associateAIs)
  }, [values, error, loading, userId])

  return {associateAIs, loading}
}
