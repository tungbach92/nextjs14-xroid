import {doc} from "firebase/firestore";
import {useDocumentData, useDocumentDataOnce} from "react-firebase-hooks/firestore";
import {db} from "@/app/configs/firebase";
import {useEffect} from "react";
import {useAtom} from "jotai";
import {contentAtom} from "@/app/store/atom/contents.atom";

function useContent(id: string) {
  const [content, setContent] = useAtom(contentAtom)
  const docRef = id && doc(db, "contents", id);
  const [value, loading, error] = useDocumentData(docRef);

  useEffect(() => {
    if (error || loading || (!loading && !value))
      return setContent(null);
    const _content = {...value}
    setContent(_content)
  }, [value, error, loading])

  return {content, setContent, loading, error};
}

export default useContent;
