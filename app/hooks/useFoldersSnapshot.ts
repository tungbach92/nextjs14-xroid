import {useAtom} from "jotai";
import {useEffect} from "react";
import {useCollection} from "react-firebase-hooks/firestore";
import {foldersRef} from "@/app/common/firebase/dbRefs";
import {foldersAtom} from "@/app/store/atom/folders.atom";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {selectedFolderAtom} from "@/app/store/atom/selectedFolder.atom";

export const useFoldersSnapshot = () => {
  const [userInfo] = useAtom(userAtomWithStorage)
  const [, setFolders] = useAtom(foldersAtom)
  const [selectedFolder, setSelectedFolder] = useAtom(selectedFolderAtom)
  const ref = foldersRef(userInfo?.user_id || "")
  const [values, loading, error] = useCollection(ref)

  useEffect(() => {
    if (error || loading || (!loading && !values))
      return setFolders(null);

    const _folders = values.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
        }
      }
    )
    setFolders(_folders)
    const folderList = _folders.filter((folder: any) => !folder.parentId)
    if (folderList?.length && !selectedFolder.id)
      return setSelectedFolder(folderList[0])
    // setSelectedFolder(selectedFolder)

  }, [values, error, loading])

}
