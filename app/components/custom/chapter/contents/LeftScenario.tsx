import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react';
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import StructureItems from "@/app/components/custom/chapter/contents/StructureItem";
import {structureDataAtom, useStructureDataAtom,} from "@/app/store/atom/structureData.atom";
import {includes} from "lodash";
import {Chapter, DataStructure, NewDataStructure} from "@/app/types/types";
import {useRouter} from "next/navigation";
import {structureIdInnChapterAtom} from '@/app/store/atom/structureIdsInChapter.atom';
import useStructureData from "@/app/hooks/useStructureData";
import AddCreateUroidBLocks from "@/app/components/custom/chapter/AddCreateUroidBLocks";
import {Button} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {Close, KeyboardDoubleArrowUp} from "@mui/icons-material";
import Structures from "@/app/componentEndpoint/structures/Structures";
import DialogCustom from "@/app/components/DialogCustom";
import {openDialogStructAtom} from "@/app/store/atom/openDialogStruct.atom";
import {structuresInChapterAtom} from "@/app/store/atom/structuresInChapter.atom";
import {blocksAtom, readWriteBlocksAtom} from "@/app/store/atom/blocks.atom";
import {Block, Enecolor} from "@/app/types/block";
import {InitEnecolor} from "@/app/configs/constants";
import {updateGroupStructAndTextInput} from "@/app/common/updateGroupStructAndTextInput";
import ModalEnecolors from "@/app/components/Structures/ModalEnecolors";
import AddIcon from "@mui/icons-material/Add";
import {topLeftMenuOpen} from "@/app/store/atom/useTopLeftMenuOpen";
import {twMerge} from "tailwind-merge";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {useAssociateAIs} from "@/app/hooks/useAssociates";
import {openQaDocsModalAtom} from "@/app/store/atom/openQaDocsModal.atom";

interface Props {
  chapter: Chapter
  setChapter: Dispatch<SetStateAction<Chapter>>
  isFullFieldUroid?: boolean,
  virtuosoRef?: any
  fixed: boolean,
  blockIndex?: number,
  addNewBlocks?: Block[]
  setAddNewBlocks?: (e: Block[]) => void
}

function LeftScenario({chapter, setChapter, isFullFieldUroid, virtuosoRef, fixed,blockIndex,addNewBlocks,setAddNewBlocks}: Props) {
  const [userInfo] = useAtom<any>(userAtomWithStorage);
  const {associateAIs, loading} = useAssociateAIs(userInfo?.user_id)
  const router = useRouter()
  const [openModal, setOpenModal] = useState(false)
  const dataStructure = useAtomValue(structureDataAtom)
  const [selectedDataStructure, setSelectedDataStructure] = useState<NewDataStructure[]>([])
  const setIds = useSetAtom(structureIdInnChapterAtom)
  const dataStructureChapter = useMemo(() => dataStructure?.map((item) => {
    if (includes(chapter?.dataStructureIds, item.id)) {
      return {
        ...item,
        isCheckInChapter: true
      }
    } else {
      return {
        ...item,
        isCheckInChapter: false
      }
    }
  }), [dataStructure, chapter?.dataStructureIds])
  const [state, setState] = useState<NewDataStructure[]>(dataStructureChapter)
  const [openDialogStruct, setOpenDialogStruct] = useAtom(openDialogStructAtom)
  const [openCreateQAModal, setOpenCreateQAModal] = useAtom(openQaDocsModalAtom)
  const [structureData] = useStructureDataAtom();
  const [ids] = useAtom(structureIdInnChapterAtom)
  const [structureInChapter, setStructureInChapter] = useAtom(structuresInChapterAtom)
  const [draftStructInChapter, setDraftStructInChapter] = useState<DataStructure[]>([])
  const [blocks, updateBlocks] = useAtom(readWriteBlocksAtom)
  const [openEnecolorDialog, setOpenEnecolorDialog] = useState<boolean>(false)
  const [selectedEnecolor, setSelectedEnecolor] = useState<Enecolor>(null)
  const [enecolor, setEnecolor] = useState<Enecolor>(InitEnecolor)
  const [isCollapsedStruct, setIsCollapsedStruct] = useState<boolean>(false)
  const [isCollapsedUroid, setIsCollapsedUroid] = useState<boolean>(false)
  const [openQaDocsModal, setOpenQaDocsModal] = useState<boolean>(false)
  const [openTopLeftMenu] = useAtom(topLeftMenuOpen)
  // const [selectedQaItem, setSelectedQaItem] = useState<AssociateAiItem>(null)
  const maxIndex = associateAIs?.length ? Math.max(...associateAIs?.map((d) => d?.index)) : -1;
  const [blocksData,setBlocksData] = useAtom(blocksAtom)

  useStructureData()

  useEffect(() => {
    const structureInChapter = structureData?.map((struct) => {
      if (includes(ids, struct.id))
        return struct
    }).filter((item) => item !== undefined) || []
    setStructureInChapter(structureInChapter)
  }, [structureData, ids])

  useEffect(() => {
    setDraftStructInChapter(structureInChapter)
  }, [structureInChapter])

  useEffect(() => {
    setState(dataStructureChapter)
  }, [dataStructureChapter])

  useEffect(() => {
    const selectedDataStructure = dataStructureChapter?.filter(item => item.isCheckInChapter) || []
    setSelectedDataStructure(selectedDataStructure)
  }, [dataStructureChapter])

  useEffect(() => {
    if (chapter?.dataStructureIds)
      setIds(chapter?.dataStructureIds)
    else
      setIds([])
  }, [chapter?.dataStructureIds])

  const handleSelectStructure = (item) => {
    const newData = structuredClone(state)
    const index = newData.findIndex((i) => i.id === item.id)
    newData[index].isCheckInChapter = !newData[index].isCheckInChapter
    setState(newData)
  }
  const handleSubmitOld = () => {
    const selectedData = state?.filter(data => data.isCheckInChapter)
    const ids = selectedData?.map(item => item.id)

    setSelectedDataStructure(selectedData)
    setChapter({dataStructureIds: ids})
    setOpenModal(false)
  }

  const handleSubmit = (e) => {
    e.stopPropagation()
    const dataStructureIds = draftStructInChapter?.map(item => item.id)
    setChapter?.({dataStructureIds})
    setStructureInChapter(draftStructInChapter)
    updateGroupStructAndTextInput({blocks, updateBlocks, draftStructInChapter, structureInChapter})
    setOpenDialogStruct(false)
  }

  function goToStructurePage() {
    router.push('/structures/').then(e => window["isDirtyChapter"] = false);
  }


  const handleClose = (e?) => {
    e?.stopPropagation()
    setDraftStructInChapter(structureInChapter)
    setOpenDialogStruct(false)
  }


  const handleOpenEnecolorModal = () => {
    setOpenEnecolorDialog(true)
    setSelectedEnecolor(null)
    setEnecolor(InitEnecolor)
  }

  const handleOpenDialogStruct = () => {
    setOpenDialogStruct(true)
  }

  const handleCollapseStruct = () => {
    setIsCollapsedStruct(!isCollapsedStruct)
  }

  const handleCollapseUroid = () => {
    setIsCollapsedUroid(!isCollapsedUroid)
  }


  return (
    //*TODO: add type for block.data (if customer want to change logic)
    <div
      className={twMerge(`bg-white mx-1 w-full ${fixed && 'fixed top-[68px] w-[15.2%] max-h-[90vh] overflow-y-auto'} ${fixed && openTopLeftMenu && 'w-[13%]'}`)}>
      <div className={'flex w-full justify-end items-center'}>
        <div className={'font-bold'}>データ構造</div>
        <IconButton onClick={handleCollapseStruct}>
          {isCollapsedStruct ? <KeyboardDoubleArrowUp className={'rotate-180'}/> : <KeyboardDoubleArrowUp/>}
        </IconButton>
      </div>
      {!isCollapsedStruct &&
        <div className={'flex flex-col gap-2'}>
          <Button variant="contained"
                  onClick={handleOpenDialogStruct}
                  startIcon={<AddIcon/>}
                  className={'h-[40px] w-full'}>ストレージ追加</Button>
          <div className={'flex flex-col gap-2 max-h-[65vh] overflow-y-auto'}>
            {
              selectedDataStructure?.map((item) => {
                if (!item.isCheckInChapter) return null
                return (
                  <StructureItems key={item.id} data={item} structure={state} setStructure={setState}
                                  setSelected={setSelectedDataStructure} setChapter={setChapter}
                                  virtuosoRef={virtuosoRef}/>
                )
              })
            }
          </div>
        </div>
      }

      {chapter?.chapterType === 'createURoid' &&
        <>
          <div className={'flex w-full justify-end items-center'}>
            <div className={'font-bold'}>Uroid</div>
            <IconButton onClick={handleCollapseUroid}>
              {isCollapsedUroid ? <KeyboardDoubleArrowUp className={'rotate-180'}/> : <KeyboardDoubleArrowUp/>}
            </IconButton>
          </div>
          {!isCollapsedUroid &&
            <div className={'pt-3'}>
              <AddCreateUroidBLocks chapter={chapter}
                                    isFullFieldUroid={isFullFieldUroid}
                                    virtuosoRef={virtuosoRef}
                                    setChapter={setChapter}/>
            </div>
          }
        </>
      }
      {/*{*/}
      {/*  <div className={'pt-2'}>*/}
      {/*    <Button variant="contained"*/}
      {/*            onClick={handleOpenQaDocsModal}*/}
      {/*            startIcon={<AddIcon/>}*/}
      {/*            className={'h-[40px] w-full'}>データ連携 AI</Button>*/}
      {/*  </div>*/}
      {/*}*/}

      <DialogCustom
        open={openDialogStruct}
        setOpen={setOpenDialogStruct}
        title={'データ構造'}
        maxWidth={false}
        onClick={handleSubmit}
        onClose={handleClose}
        isCancelBtn={false}
        classNameBtnOk={'m-auto w-[200px]'}
        closeBtn={<IconButton onClick={handleClose} className={'absolute top-0 right-0'}><Close/></IconButton>}
      >
        <div className={'flex flex-col w-full'}>
          <div className={'flex gap-2'}>
            <Button variant="contained"
                    onClick={goToStructurePage}
                    endIcon={<AddIcon/>}
                    className={'h-[40px] ml-6 mt-6'}>ストレージ追加</Button>
            {/*<Button variant="contained"*/}
            {/*        onClick={handleOpenEnecolorModal}*/}
            {/*        endIcon={<AddIcon/>}*/}
            {/*        className={'h-[40px] ml-6 mt-6'}>エネカラー解析</Button>*/}
          </div>
          <Structures draftSelectedStructures={draftStructInChapter}
                      setDraftSelectedStructures={setDraftStructInChapter}
                      structureInChapter={structureInChapter} inChapter={true}
          />
        </div>
      </DialogCustom>
      <ModalEnecolors chapter={chapter} setChapter={setChapter} openEnecolorDialog={openEnecolorDialog}
                      setOpenEnecolorDialog={setOpenEnecolorDialog} enecolor={enecolor}
                      selectedEnecolor={selectedEnecolor}
                      setEnecolor={setEnecolor}
                      setSelectedEnecolor={setSelectedEnecolor}/>
      {/*<Modal open={openQaDocsModal}*/}
      {/*       setOpen={setOpenQaDocsModal}*/}
      {/*       title={'データ連携 AI'}*/}
      {/*       handleClose={() => handleCloseSelectQaDocsModal()}*/}
      {/*       onSubmit={() => handleSubmitQaDocsModal(QA_DOCS_BLOCK, '')}*/}
      {/*       btnSubmit={'選択して追加'}*/}
      {/*       isDisabled={selectedQaItem === null}*/}
      {/*       dividers={false}*/}
      {/*       btnCancel={''}*/}
      {/*       actionPosition={'center'}*/}
      {/*>*/}
      {/*  <div className={'px-5'}>*/}
      {/*    {*/}
      {/*      loading ? <CircularProgress size={20} className={'m-auto'}/> :*/}
      {/*        <Qa_DocList*/}
      {/*          handleSelectItem={(item) => setSelectedQaItem(item)}*/}
      {/*          selectedItem={selectedQaItem}*/}
      {/*          loading={loading}*/}
      {/*          setOpenModel={setOpenCreateQAModal}*/}
      {/*          width={'w-full'}*/}
      {/*          userId={userInfo?.user_id}*/}
      {/*          associateAIs={associateAIs}/>*/}
      {/*    }*/}
      {/*  </div>*/}
      {/*</Modal>*/}
      {/*<OpenAiGPTDialog openModal={openCreateQAModal}*/}
      {/*                 isUpdate={false}*/}
      {/*                 setOpenModel={setOpenCreateQAModal}*/}
      {/*                 userId={userInfo?.user_id}*/}
      {/*                 index={maxIndex + 1}*/}
      {/*/>*/}

    </div>
  );
}

export default LeftScenario;
