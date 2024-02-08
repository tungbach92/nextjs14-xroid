import {useEffect, useState} from "react";
import {Image} from "@/app/types/types";
import {useAtom} from "jotai/index";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {useCollection} from "react-firebase-hooks/firestore";
import {videosRef} from "@/app/common/firebase/dbRefs";

export function useVideo() {
  const [userInfo] = useAtom<any>(userAtomWithStorage);
  const [listAllVideos, setListAllVideos] = useState<Image[]>([]);
  const [values, loading, error]  = useCollection(videosRef(userInfo?.user_id || ""));
  useEffect(() => {
    if (error || loading || (!loading && !values) || !userInfo?.user_id)
      return setListAllVideos(null);
    const _listVideos = values.docs.map((doc) => {
      return {
        ...doc.data(),
        id: doc.id,
      };
    });
    setListAllVideos(_listVideos);
  }, [userInfo?.user_id, values, loading, error]);
  return {loadingVideos : loading, listAllVideos};
}
