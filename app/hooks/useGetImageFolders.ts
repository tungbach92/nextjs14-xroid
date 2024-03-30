import {useEffect} from "react";
import {imageFoldersAtom} from "@/app/store/atom/folders.atom";
import {getListFolder} from "@/app/common/folders";
import {selectedImageFolderAtom} from "@/app/store/atom/selectedFolder.atom";
import {useAtom, useSetAtom} from "jotai";
import {useAtomValue} from "jotai";
import {accessTokenAtom} from "@/app/store/atom/accessToken.atom";

export default function useGetImageFolders() {
  const [selectedImageFolder, setSelectedImageFolder] = useAtom(selectedImageFolderAtom);
  const setImageFolders = useSetAtom(imageFoldersAtom)
  const accessToken = useAtomValue(accessTokenAtom)

  const getImageFolders = async () => {
    try {
      const imageFolderList = await getListFolder('image')
      // const imageFolderList = folderList.filter(l => l.isImage) || []
      setImageFolders(imageFolderList)
      if (imageFolderList?.length && !selectedImageFolder.id)
        return setSelectedImageFolder(imageFolderList[0])
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    getImageFolders().then()
  }, [accessToken]);
}
