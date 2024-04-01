import {useEffect} from "react";
import {foldersAtom} from "@/app/store/atom/folders.atom";
import {getListFolder} from "@/app/common/folders";
import {selectedFolderAtom} from "@/app/store/atom/selectedFolder.atom";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {folderDocRef} from "@/app/common/firebase/dbRefs";
import {useDocumentData} from "react-firebase-hooks/firestore";
import {accessTokenAtom} from "@/app/store/atom/accessToken.atom";
import {axiosConfigs} from "@/app/configs/axios";

export const useFolder = (folderId?: string) => {
  const userRef = folderDocRef(folderId)
  const [data, loading, error] = useDocumentData(userRef);

  return {folder: data, loading, error}
}
export default function useFolders() {
  const [selectedFolder, setSelectedFolder] = useAtom(selectedFolderAtom);
  const setFolders = useSetAtom(foldersAtom)
  const accessToken = useAtomValue(accessTokenAtom)

  const getFolders = async () => {
    try {
      const folderList = await getListFolder('content')
      setFolders(folderList)
      if (folderList?.length && !selectedFolder.id)
        return setSelectedFolder(folderList[0])
      // setSelectedFolder(selectedFolder)
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    getFolders().then()
  }, [accessToken]);
}
