import {useRouter} from "next/navigation";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import IconButton from "@mui/material/IconButton";
import {StructureDetail} from "@/app/components/Structures/StructureDetail";
import {useEffect, useState} from "react";
import {getDataStructure} from "@/app/common/commonApis/dataStructure";
import {isEqual, sortBy} from "lodash";
import {handleSubmitStructures} from "@/app/common/handleSubmitStructures";
import {checkValidateStructures} from "@/app/common/checkValidateStructures";
import CircularProgress from "@mui/material/CircularProgress";
import {useListDataStructure} from "@/app/hooks/useListDataStructure";
import {useAtom} from "jotai";
import {listDataStructureNoSnapAtom} from "@/app/store/atom/listDataStructureNoSnapAtom";
import {listDataStructureOldAtom} from "@/app/store/atom/listDataStructureOld.atom";

const StructureDetailPage = () => {
  const router = useRouter()
  const structureId = router.query.structureId as string
  const folderId = router.query.folderId as string
  const [listDataStructure, setListDataStructure] = useAtom(listDataStructureNoSnapAtom)
  const [listDataStructureOld, setListDataStructureOld] = useAtom(listDataStructureOldAtom)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const selectedStructure = listDataStructure?.find(item => item.id === structureId)

  useListDataStructure()

  useEffect(() => {
    if(listDataStructureOld === null) return;
    if(isEqual(listDataStructureOld, listDataStructure)) return;

    handleSubmitStructures({
      setIsLoading,
      listDataStructureOld,
      getListDataStructure,
      listDataStructure,
      checkValidate: () => checkValidateStructures({listDataStructure}),
      selectedStructFolderId: folderId
    });
  }, [listDataStructure, listDataStructureOld])

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
  return (
    <div className={'px-8 py-6'}>
      <div className={'flex items-center'}>
        <IconButton onClick={() => {
          router.push('/structures')
        }}>
          <ArrowBackIosNewIcon fontSize={'small'}/>
        </IconButton>
        <div className={'font-bold'}>{selectedStructure?.name ?? ''}</div>
      </div>
      {listDataStructure !== null && (
        <StructureDetail listDataStructure={listDataStructure} setListDataStructure={setListDataStructure}/>
      )}
      {isLoading && <div className={'text-center mt-3'}><CircularProgress/></div>}
    </div>
  )
}

export default StructureDetailPage
