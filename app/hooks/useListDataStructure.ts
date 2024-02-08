import {useAtomValue, useSetAtom} from "jotai";
import {listDataStructureNoSnapAtom} from "@/app/store/atom/listDataStructureNoSnapAtom";
import {useEffect, useState} from "react";
import {getDataStructure} from "@/app/common/commonApis/dataStructure";
import {sortBy} from "lodash";
import {selectedStructureFolderAtom} from "@/app/store/atom/selectedFolder.atom";
import {listDataStructureOldAtom} from "@/app/store/atom/listDataStructureOld.atom";
import {useRouter} from "next/navigation";

export const useListDataStructure = () => {
  const setListDataStructure = useSetAtom(listDataStructureNoSnapAtom)
  const setListDataStructureOld = useSetAtom(listDataStructureOldAtom)
  const router = useRouter()
  const selectedStructFolder = useAtomValue(selectedStructureFolderAtom)
  const folderId = selectedStructFolder?.id ?? router.query.folderId as string
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    getListDataStructure().then()
  }, [folderId])

  const getListDataStructure = async () => {
    setIsLoading(true)
    try {
      let data = await getDataStructure(folderId)
      let dataSort = sortBy(data?.dataStructures, ['index'], ['asc'])
      setListDataStructure(dataSort);
      setListDataStructureOld(dataSort);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false)
    }
  }
  return {isLoading}
}
