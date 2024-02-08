import React, {SetStateAction, useEffect, useMemo, useRef, useState} from 'react';
import {Button} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {getDataStructure} from "@/app/common/commonApis/dataStructure";
import {cloneDeep, isEqual, sortBy} from "lodash";
import {getId} from "@/app/common/getId";
import LinearProgress from "@mui/material/LinearProgress";
import {BaseDeleteModal} from "@/app/components/base";
import SideBarRight from "@src/components/Layout/Sidebar/side-bar-right";
import {useAtom} from "jotai";
import {structFoldersAtom} from "@/app/store/atom/folders.atom";
import {selectedStructureFolderAtom} from "@/app/store/atom/selectedFolder.atom";
import useGetStructFolders from "@/app/hooks/useGetStructFolders";
import {ListManager} from "react-beautiful-dnd-grid";
import {useWindowSize} from "@/app/hooks/useWindowSize";
import ListData from "@/app/componentEndpoint/structures/ListData";
import {handleSubmitStructures} from "@/app/common/handleSubmitStructures";
import {checkValidateStructures} from "@/app/common/checkValidateStructures";
import {DataStructure} from "@/app/types/types";
import {listDataStructureNoSnapAtom} from "@/app/store/atom/listDataStructureNoSnapAtom";
import {listDataStructureOldAtom} from "@/app/store/atom/listDataStructureOld.atom";
import {useStructureDataAtom} from "@/app/store/atom/structureData.atom";
import ModalEnecolors from "@/app/components/Structures/ModalEnecolors";
import {Enecolor} from "@/app/types/block";
import {InitEnecolor} from "@/app/configs/constants";
import useEnecolors from "@/app/hooks/useEnecolors";
import useAdminEnecolors from "@/app/hooks/useAdminEnecolor";
import {useGetAllUserEnecolor} from "@/app/hooks/useGetAllUserEnecolor";

interface Props {
  draftSelectedStructures: DataStructure[];
  setDraftSelectedStructures: React.Dispatch<SetStateAction<DataStructure[]>>
  structureInChapter: DataStructure[]
  inChapter?: boolean
}

function Structures(props: Props) {
  const {inChapter} = props;
  useGetStructFolders()
  const inputRefs = useRef<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [listDataStructure, setListDataStructure] = useAtom(listDataStructureNoSnapAtom)
  const [listStructureSnapshot, setListStructureSnapshot] = useStructureDataAtom();
  const [listDataStructureOld, setListDataStructureOld] = useAtom(listDataStructureOldAtom)
  const [selectedStructFolder, setSelectedStructFolder] = useAtom(selectedStructureFolderAtom);
  const listDataStructureByFolderIdSnapShot = useMemo(() => listStructureSnapshot?.filter(x => x.folderId === selectedStructFolder?.id), [listStructureSnapshot, selectedStructFolder?.id])
  const [idValidate, setIdValidate] = useState<string[]>([])
  const [confirmDeleteAll, setConfirmDeleteAll] = useState<boolean>(false)
  const [selectedData, setSelectedData] = useState<DataStructure>({})
  const [structFolders, setStructFolders] = useAtom(structFoldersAtom)
  const size = useWindowSize()
  const [maxItems, setMaxItems] = useState<number>(0)
  const [openEnecolorDialog, setOpenEnecolorDialog] = useState<boolean>(false)
  const [selectedEnecolor, setSelectedEnecolor] = useState<Enecolor>(null)
  const [enecolors, setEnecolors] = useState<Enecolor>(InitEnecolor)
  useEnecolors()
  const {adminEnecolors} = useAdminEnecolors()
  useGetAllUserEnecolor(adminEnecolors)

  useEffect(() => {
    getListDataStructure().then()
  }, [selectedStructFolder?.id])

  useEffect(() => {
    if (size?.width >= 1800)
      return setMaxItems(8)
    if (size?.width >= 1668 && size?.width < 1800)
      return setMaxItems(7)
    if (size?.width >= 1498 && size?.width < 1668)
      return setMaxItems(6)
    if (size?.width >= 1280 && size?.width < 1498)
      return setMaxItems(5)
    if (size?.width >= 1130 && size?.width < 1280)
      return setMaxItems(4)
    if (size?.width >= 928 && size?.width < 1130)
      return setMaxItems(3)
    if (size?.width >= 768 && size?.width < 928)
      return setMaxItems(2)
    if (size?.width < 768) return setMaxItems(1)
  }, [size?.width])

  useEffect(() => {
    if (listDataStructureOld === null) return;
    if (isEqual(listDataStructureOld, listDataStructure)) return;
    listDataStructure?.forEach(dataStruct => {
      if (dataStruct.name === '') return;
    });
    if (listDataStructure[listDataStructureOld.length]?.name === '') return;

    handleSubmitStructures({
      setIsLoading,
      listDataStructureOld,
      getListDataStructure,
      listDataStructure,
      checkValidate: () => checkValidateStructures({listDataStructure, setIdValidate}),
      selectedStructFolderId: selectedStructFolder?.id
    })
  }, [listDataStructure, listDataStructureOld])

  function scrollLeft() {
    const outsider = document.getElementById('outsider');
    const distance = (listDataStructure.length + 1) * 300;
    outsider?.scrollBy({
      left: distance,
      behavior: 'smooth'
    });
  }

  const getListDataStructure = async () => {
    setIsLoading(true)
    try {
      let data = await getDataStructure(selectedStructFolder?.id)
      let dataSort = sortBy(data?.dataStructures, ['index'], ['asc'])
      setListDataStructure(dataSort);
      setListDataStructureOld(dataSort);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddStructure = () => {
    const newData = cloneDeep(listDataStructure)
    newData.push({
      id: getId('storage_', 10),
      name: '',
      items: [],
      index: newData.length
    })
    setListDataStructure(newData)
    setTimeout(() => {
      scrollLeft()
    });
    setTimeout(() => {
      if (inputRefs.current) {
        inputRefs.current[newData.length - 1].focus();
      }
    }, 0)
  }

  const onDragEnd = (sourceIndex, destinationIndex) => {
    const _listDataStructure = cloneDeep(listDataStructure)
    const [reorderedItem] = _listDataStructure.splice(sourceIndex, 1);
    _listDataStructure.splice(destinationIndex, 0, reorderedItem);
    if (!isEqual(_listDataStructure, listDataStructureOld)) {
      const listAfterDragAndDrop = _listDataStructure.map((item, idx) => ({
        ...item,
        index: idx
      }))
      setListDataStructure(listAfterDragAndDrop)
    } else {
      setListDataStructure(_listDataStructure)
    }
  };

  const onDelete = (dataStructure: DataStructure) => {
    setConfirmDeleteAll(true)
    setSelectedData(dataStructure)
  }

  const onCopy = (data: DataStructure) => {
    const _structure = cloneDeep(listDataStructure)
    const idx = _structure.findIndex(item => item.id === data.id)
    if (idx === -1) return
    const copyData = cloneDeep(_structure[idx])
    copyData.id = getId('dataStructure_', 10)
    copyData.name = `${copyData.name} - コピー`
    copyData.items.forEach((item) => {
      item.id = getId('storageItem_', 10)
    })
    _structure.splice(idx + 1, 0, copyData)
    setListDataStructure(_structure?.map((item: any, index: number) => {
        return {
          ...item,
          index: index,
        }
      }
    ))
  }

  const handleDeleteStructure = () => {
    const _structure = cloneDeep(listDataStructure)
    const _structureOld = cloneDeep(listDataStructureOld)
    const idx = _structure.findIndex(item => item.id === selectedData.id)
    if (idx === -1) return
    const idxOld = _structureOld.findIndex(item => item.id === selectedData.id)
    if (idxOld === -1) {
      _structure.splice(idxOld, 1)
    } else {
      _structure[idx].isDeleted = true
    }
    setListDataStructure(_structure)
    setConfirmDeleteAll(false)
    setSelectedData({})
  }

  const checkStructInChapter = () => {
    return window.location.href.includes(`${window.location.origin}/content`)
  }

  const handleOpenEnecolorDialog = () => {
    setOpenEnecolorDialog(true)
    setSelectedEnecolor(null)
    setEnecolors(InitEnecolor)
  }

  return (
    <div className='flex w-full'>
      <div className={`relative space-y-8 w-full ${!checkStructInChapter() && 'tablet:mr-[70px]'}`}>
        <div className='flex flex-wrap gap-6 mx-8 mt-8'>
          {!inChapter && <>
            <Button
              variant='contained'
              onClick={handleAddStructure}
              endIcon={<AddIcon/>}
            >ストレージ追加</Button>
            {/*<Button variant="contained"*/}
            {/*        onClick={handleOpenEnecolorDialog}*/}
            {/*        endIcon={<AddIcon/>}*/}
            {/*        className={'h-[40px]'}>エネカラー解析</Button>*/}
          </>
          }

        </div>
        {(listDataStructure !== null && maxItems) && <div className={`w-fit mx-8`}>
          {
            listDataStructure?.length > 0 ?
              !inChapter ?
                <ListManager
                  items={listDataStructure}
                  direction="horizontal"
                  maxItems={maxItems}
                  render={dataStructure => {
                    if (dataStructure?.isDeleted) return null
                    return <ListData
                      onCopy={onCopy}
                      onDelete={onDelete}
                      dataStructure={dataStructure}
                      idValidate={idValidate}
                      structureInChapter={listDataStructure}
                      setListDataStructure={setListDataStructure}
                      inputRef={ref => inputRefs.current[dataStructure.index] = ref}
                      // onBlur={handleBlur}
                      setIdValidate={setIdValidate}
                      {...props}
                    />
                  }
                  }
                  onDragEnd={onDragEnd}
                /> : <div className="flex flex-wrap">
                  {listDataStructureByFolderIdSnapShot?.map(dataStructure => <ListData
                    key={dataStructure.id}
                    onCopy={onCopy}
                    onDelete={onDelete}
                    dataStructure={dataStructure}
                    idValidate={idValidate}
                    structureInChapter={listStructureSnapshot}
                    setListDataStructure={setListStructureSnapshot}
                    inputRef={ref => inputRefs.current[dataStructure.index] = ref}
                    // onBlur={handleBlur}
                    setIdValidate={setIdValidate}
                    {...props}
                  />)}
                </div>
              : isLoading ? <LinearProgress/> :
                <div
                  className='absolute right-8 left-8 flex items-center bg-white rounded-md justify-center text-black h-12 font-semibold'>
                  データ構造がございません。
                </div>
          }
        </div>
        }
        {(isLoading || listDataStructure === null) && <LinearProgress/>}
      </div>
      <div className={`hidden tablet:flex ${!checkStructInChapter() && 'fixed right-0 top-0 pt-[64px] h-full'}`}>
        <SideBarRight folders={structFolders} setFolders={setStructFolders}
                      selectedFolder={selectedStructFolder}
                      setSelectedFolder={setSelectedStructFolder} folderType={'struct'}/>
      </div>
      {
        confirmDeleteAll &&
        <BaseDeleteModal
          handleClose={() => setConfirmDeleteAll(false)}
          label={'このデータを削除しますか？'}
          isOpen={Boolean(confirmDeleteAll)}
          handleDelete={handleDeleteStructure}
        />
      }
      <ModalEnecolors openEnecolorDialog={openEnecolorDialog} setOpenEnecolorDialog={setOpenEnecolorDialog}
                      selectedEnecolor={selectedEnecolor}
                      setSelectedEnecolor={setSelectedEnecolor}
                      enecolor={enecolors} setEnecolor={setEnecolors}
                      getListDataStructure={getListDataStructure}/>
    </div>
  )
    ;
}

export default Structures;
