import {useEffect} from "react";
import {structFoldersAtom} from "@/app/store/atom/folders.atom";
import {getListFolder} from "@/app/common/folders";
import {selectedStructureFolderAtom} from "@/app/store/atom/selectedFolder.atom";
import {useAtom, useSetAtom} from "jotai";

export default function useGetStructFolders() {
  const [selectedStructFolder, setSelectedStructFolder] = useAtom(selectedStructureFolderAtom);
  const setStructFolders = useSetAtom(structFoldersAtom)
  const getStructFolders = async () => {
    try {
      const structFolderList = await getListFolder('struct')
      setStructFolders(structFolderList)
      if (structFolderList?.length && !selectedStructFolder?.id)
        return setSelectedStructFolder(structFolderList[0])
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    getStructFolders().then()
  }, []);
}
