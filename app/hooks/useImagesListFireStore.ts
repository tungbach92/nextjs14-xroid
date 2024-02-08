import {imagesRef} from "@/app/common/firebase/dbRefs";
import {listImagesAtom} from "@/app/store/atom/listImages";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {useAtom, useAtomValue} from "jotai";
import {useEffect, useState} from "react";
import {useCollection} from "react-firebase-hooks/firestore";
import {orderBy} from "lodash";
import {selectedImageFolderAtom} from "@/app/store/atom/selectedFolder.atom";
import {Image} from "@/app/types/types";

type Props = {
  folderId?: string
}

export const useImagesListFireStore = (folderId: string = "") => {
  const [userInfo] = useAtom(userAtomWithStorage);
  const [listImages, setListImages] = useAtom(listImagesAtom);
  const [listVideos, setListVideos] = useState<Image[]>([])
  const selectedImageFolder = useAtomValue(selectedImageFolderAtom)
  const ref = userInfo && imagesRef(userInfo?.user_id || "", folderId || selectedImageFolder.id || "");
  const [values, loading, error] = useCollection(ref);

  useEffect(() => {
    if (error || loading || (!loading && !values)) return setListImages(null);

    const _listImages = values.docs.map((doc) => {
      return {
        ...doc.data(),
        id: doc.id,
        mediaType: doc.data().mediaType as string | "image",
      };
    });
    setListImages(orderBy(_listImages.filter(item=>item.mediaType !== 'video'), ["createdAt"], ["desc"]));
    setListVideos(orderBy(_listImages.filter(item=>item.mediaType === 'video'), ["createdAt"], ["desc"]));
  }, [values, loading, error]);

  return {loading, listImages,listVideos};
};
