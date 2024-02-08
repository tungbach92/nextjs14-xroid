import {useAtom, useAtomValue} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {imagesRef} from "@/app/common/firebase/dbRefs";
import {useCollection} from "react-firebase-hooks/firestore";
import {useEffect, useState} from "react";
import {orderBy} from "lodash";
import {Image} from "@/app/types/types";

export function useImageByFolderId  (folderId: string) {
  const [userInfo] = useAtom(userAtomWithStorage);
  const [listImages, setListImages] = useState<Image[]>([]);
  const [listVideos, setListVideos] = useState<Image[]>([]);
  const [values, loading, error] = useCollection(imagesRef(userInfo?.user_id || "", folderId));
  useEffect(() => {
    if (error || loading || (!loading && !values))
      return setListImages(null);
    const _listImages = values.docs.map((doc) => {
      return {
        ...doc.data(),
        id: doc.id,
        mediaType: doc.data().mediaType as string | "image",
      };
    });
    setListImages(orderBy(_listImages.filter((item) => item.mediaType !== "video"), ["createdAt"], ["desc"]));
    setListVideos(orderBy(_listImages.filter((item) => item.mediaType === "video"), ["createdAt"], ["desc"]));
  }, [values, loading, error]);

  return {loadingImages : loading, listImages,listVideos};

}
