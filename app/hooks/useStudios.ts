import {doc} from "firebase/firestore";
import {useDocumentData} from "react-firebase-hooks/firestore";
import {db} from "@/app/configs/firebase";
import {useEffect} from "react";
import {useAtom} from "jotai";
import {studioAtom} from "@/app/store/atom/studios.atom";

function useStudio(userId: string) {
  const [studio, setStudio] = useAtom(studioAtom)
  const docRef = userId && doc(db, "studios", userId);
  const [value, loading, error] = useDocumentData(docRef);

  useEffect(() => {
    if (error || loading || (!loading && !value))
      return setStudio(null);
    const _studio = {...value}
    setStudio(_studio)
  }, [value, error, loading])
  return {studio, setStudio, loading, error};
}

export default useStudio;
