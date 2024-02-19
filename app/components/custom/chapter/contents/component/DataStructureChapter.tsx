import React, {SetStateAction, useEffect, useState} from "react";
import {Chapter, DataStructure} from "@/app/types/types";
import DataStructureChapterItem from "@/app/components/custom/chapter/contents/component/DataStructureChapterItem";
import IconButton from "@mui/material/IconButton";
import {Close} from "@mui/icons-material";
import Structures from "@/app/componentEndpoint/structures/Structures";
import DialogCustom from "@/app/components/DialogCustom";
import {structureIdInnChapterAtom} from "@/app/store/atom/structureIdsInChapter.atom";
import {includes} from "lodash";
import {useStructureDataAtom} from "@/app/store/atom/structureData.atom";
import {useAtom} from "jotai";
import {readWriteBlocksAtom} from "@/app/store/atom/blocks.atom";
import {updateGroupStructAndTextInput} from "@/app/common/updateGroupStructAndTextInput";
import {openDialogStructAtom} from "@/app/store/atom/openDialogStruct.atom";
import AddIcon from "@mui/icons-material/Add";
import {structuresInChapterAtom} from "@/app/store/atom/structuresInChapter.atom";
import ClearIcon from "@mui/icons-material/Clear";
import ModalEnecolors from "@/app/components/Structures/ModalEnecolors";
import {Enecolor} from "@/app/types/block";
import {InitEnecolor} from "@/app/configs/constants";

interface Props {
  chapter: Chapter;
  setChapter: React.Dispatch<SetStateAction<Chapter>>
}

export default function DataStructureChapter({chapter, setChapter}: Props) {
  const [openDialogStruct, setOpenDialogStruct] = useAtom(openDialogStructAtom)
  const [structureData] = useStructureDataAtom();
  const [ids] = useAtom(structureIdInnChapterAtom)
  const [structureInChapter, setStructureInChapter] = useAtom(structuresInChapterAtom)
  const [draftStructInChapter, setDraftStructInChapter] = useState<DataStructure[]>([])
  const [blocks, updateBlocks] = useAtom(readWriteBlocksAtom)
  const [openEnecolorDialog, setOpenEnecolorDialog] = useState<boolean>(false)
  const [selectedEnecolor, setSelectedEnecolor] = useState<Enecolor>(null)
  const [enecolor, setEnecolor] = useState<Enecolor>(InitEnecolor)

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


  const handleSubmit = (e) => {
    e.stopPropagation()
    const dataStructureIds = draftStructInChapter?.map(item => item.id)
    setChapter?.({dataStructureIds})
    setStructureInChapter(draftStructInChapter)
    updateGroupStructAndTextInput({blocks, updateBlocks, draftStructInChapter, structureInChapter})
    setOpenDialogStruct(false)
  }

  const handleClose = (e?) => {
    e?.stopPropagation()
    setDraftStructInChapter(structureInChapter)
    setOpenDialogStruct(false)
  }

  const handleRemoveStructure = (e, structureId) => {
    e.stopPropagation();
    let newStructureInChapter = structureInChapter.filter(item => item.id != structureId)
    const dataStructureIds = newStructureInChapter?.map(item => item.id)
    setChapter?.({dataStructureIds})
    setStructureInChapter(newStructureInChapter);
  }

  const handleOpenEnecolorModal = () => {
    setOpenEnecolorDialog(true)
    setSelectedEnecolor(null)
    setEnecolor(InitEnecolor)
  }


  return (
    <div className={'flex items-center mt-2'}>
      <span className={'font-bold'}>Data</span>
      <div className={'w-[1px] h-[50px] bg-[#BDDAFC] ml-[15px] mr-[6px]'}/>
      <div className={'flex items-center gap-2 cursor-pointer max-w-[180px] overflow-x-scroll overflow-y-hidden'}
           onClick={() => setOpenDialogStruct(true)}>

        {structureInChapter?.map(x => <div key={x.id} className={'relative group w-[50px]'}>
          <DataStructureChapterItem item={x}/>
          <IconButton
            className={'absolute -right-1 top-0 bg-white w-5 h-5 opacity-0 transition-300 group-hover:opacity-100'}
            size={'small'} onClick={(e) => handleRemoveStructure(e, x.id)}>
            <ClearIcon fontSize={'small'} color={'warning'}/>
          </IconButton>
        </div>)}
      </div>
      <IconButton className={'h-[50px] w-[50px] bg-[#C5DCF5] hover:scale-110 ml-2'}
                  onClick={() => {
                    setOpenDialogStruct(true)
                  }}><AddIcon/></IconButton>
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
        {/*<Button variant="contained"*/}
        {/*        onClick={handleOpenEnecolorModal}*/}
        {/*        endIcon={<AddIcon/>}*/}
        {/*        className={'h-[40px] ml-6 mt-6'}>エネカラー解析</Button>*/}
        <Structures draftSelectedStructures={draftStructInChapter}
                    setDraftSelectedStructures={setDraftStructInChapter}
                    structureInChapter={structureInChapter} inChapter={true}
        />
      </DialogCustom>
      <ModalEnecolors chapter={chapter} setChapter={setChapter} openEnecolorDialog={openEnecolorDialog}
                      setOpenEnecolorDialog={setOpenEnecolorDialog} enecolor={enecolor}
                      selectedEnecolor={selectedEnecolor}
                      setEnecolor={setEnecolor}
                      setSelectedEnecolor={setSelectedEnecolor}/>
    </div>
  )
}
