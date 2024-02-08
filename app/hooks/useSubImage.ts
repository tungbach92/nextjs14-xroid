import {useAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {useEffect, useState} from "react";
import {useCollection} from "react-firebase-hooks/firestore";
import {subImagesByParentIdRef} from "@/app/common/firebase/dbRefs";
import {orderBy} from "lodash";
import {Image} from "@/app/types/types";

export function useSubImage (folderIds: string[]) {
  const [userInfo] = useAtom(userAtomWithStorage);
  const [listSubImages, setListSubImages] = useState<Image[]>([]);
  const [values, loading, error] = useCollection(subImagesByParentIdRef(userInfo?.user_id || "", folderIds));
  useEffect(() => {
    if (error || loading || (!loading && !values))
      return setListSubImages(null);
    const _listImages = values.docs.map((doc) => {
      return {
        ...doc.data(),
        id: doc.id,
      };
    });
    setListSubImages(orderBy(_listImages, ["createdAt"], ["asc"]));
  }, [values, loading, error]);

  return {loadingSubImages : loading, listSubImages};
}
