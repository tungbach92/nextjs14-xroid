import React, {useRef, useState} from 'react';
import {FormControl, FormHelperText} from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import ModalSelectDataStruct from "@/app/components/custom/chapter/contents/component/ModalSelectDataStruct";
import {DataStructureItem} from "@/app/types/types";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {readWriteBlocksAtom} from "@/app/store/atom/blocks.atom";
import {useStructureDataAtom} from "@/app/store/atom/structureData.atom";
import {structuresInChapterAtom} from "@/app/store/atom/structuresInChapter.atom";
import {openDialogStructAtom} from "@/app/store/atom/openDialogStruct.atom";
import {textInputRefAtom} from "@/app/store/atom/textInputRef.atom";
import {blockIdAtom} from "@/app/store/atom/blockId.atom";
import {cloneDeep} from "lodash";
import {getListVarIndex} from "@/app/common/getListVarIndex";
import {handleUpdateBlockFields} from "@/app/common/handleUpdateBlockFields";
import {
  BlockEneColorRankImg,
  BlockEnecolorRankText,
  BlockInputEnecolorImage,
  BlockInputEnecolorText,
  Enecolor,
  SaveSetting
} from "@/app/types/block";
import {
  ENECOLOR_RANK_IMG,
  ENECOLOR_RANK_IMG_V2,
  ENECOLOR_RANK_TEXT,
  ENECOLOR_RANK_TEXT_V2,
  INPUT_ENECOLOR_IMAGE,
  INPUT_ENECOLOR_TEXT
} from "@/app/configs/constants";
import {newBlockData} from "@/app/common/newBlockData";
import {allUserEnecolorsAtom} from "@/app/store/atom/allUserEnecolors.atom";
import {typeOfNewEnecolorBlockAtom} from "@/app/store/atom/typeOfNewEnecolorBlock.atom";

type Props = {
  selectedEneColorRankTextSetting: any,
  eneColorRankTextSettings: any,
  setSelectedEneColorRankTextSetting: any,
  onAddBlock: (type: string, url?: string, selectedTextSetting?: SaveSetting, blockInputEnecolor?: BlockInputEnecolorText | BlockInputEnecolorImage, blockEnecolor?: BlockEneColorRankImg | BlockInputEnecolorText) => void,
  selectedEneColorRankImgSetting: any,
  eneColorRankImgSettings: any,
  setSelectedEneColorRankImgSetting: any
  isShowModal: boolean
  openTopLeftMenu: boolean
}

function EnecolorTabContent(
  {
    selectedEneColorRankTextSetting,
    eneColorRankTextSettings,
    setSelectedEneColorRankTextSetting,
    selectedEneColorRankImgSetting,
    eneColorRankImgSettings,
    setSelectedEneColorRankImgSetting,
    onAddBlock,
    isShowModal = false,
    openTopLeftMenu = false
  }: Props) {
  const [openEnecolorDialog, setOpenEnecolorDialog] = useState<boolean>(false);
  // const [dialogTitle, setDialogTitle] = useState<string>('');
  // const isShowPreview = dialogTitle !== 'エネカラー画像' && dialogTitle !== 'INPUTエネカラー画像'
  const [type, setType] = useState<string>('')

  const updateBlocks = useSetAtom(readWriteBlocksAtom)
  const [openDialogStructDetail, setOpenDialogStructDetail] = useState<boolean>(false)
  const [listDataStructure] = useStructureDataAtom();
  const previewInputRef = useRef(null)
  const [structuresInChapter, setStructInChapter] = useAtom(structuresInChapterAtom)
  const [draftText, setDraftText] = useState<string>('')
  const [chapterStructItems, setChapterStructItems] = useState<DataStructureItem[]>([])
  const [draftChapterStructureItems, setDraftChapterStructureItems] = useState<DataStructureItem[]>([])
  const setOpenDialogStruct = useSetAtom(openDialogStructAtom)
  const [textVoiceErr, setTextVoiceErr] = useState<boolean>(false)
  const allUserEnecolors = useAtomValue(allUserEnecolorsAtom)
  const setTextInputRef = useSetAtom(textInputRefAtom)
  const setBlockId = useSetAtom(blockIdAtom)
  const initBlockInputEnecolorText = newBlockData(INPUT_ENECOLOR_TEXT, []) as BlockInputEnecolorText
  const initBlockEnecolorText = newBlockData(ENECOLOR_RANK_TEXT_V2, []) as BlockEnecolorRankText
  const initBlockInputEnecolorImage = newBlockData(INPUT_ENECOLOR_IMAGE, []) as BlockInputEnecolorImage
  const initBlockEnecolorImage = newBlockData(ENECOLOR_RANK_IMG_V2, []) as BlockEneColorRankImg
  const [blockInputEnecolorText, setBlockInputEnecolorText] = useState<BlockInputEnecolorText>(initBlockInputEnecolorText)
  const [blockEnecolorText, setBlockEnecolorText] = useState<BlockEnecolorRankText>(initBlockEnecolorText)
  const [blockInputEnecolorImage, setBlockInputEnecolorImage] = useState<BlockInputEnecolorImage>(initBlockInputEnecolorImage)
  const [blockEnecolorImage, setBlockEnecolorImage] = useState<BlockEneColorRankImg>(initBlockEnecolorImage)
  const [draftSelectedEnecolors, setDraftSelectedEnecolors] = useState<Enecolor[]>([])
  const [, setNewEnecolorBlockType] = useAtom(typeOfNewEnecolorBlockAtom)
  const onclickButtonEnecolor = (type: string) => {
    setType(type)
    setDraftText("")
    if (type === ENECOLOR_RANK_TEXT_V2) {
      setNewEnecolorBlockType(ENECOLOR_RANK_TEXT_V2)
      setBlockEnecolorText(blockEnecolorText)
    } else if (type === ENECOLOR_RANK_IMG_V2) {
      setNewEnecolorBlockType(ENECOLOR_RANK_IMG_V2)
      setBlockEnecolorImage(blockEnecolorImage)
    } else if (type === INPUT_ENECOLOR_TEXT) {
      setNewEnecolorBlockType(INPUT_ENECOLOR_TEXT)
      setBlockInputEnecolorText(initBlockInputEnecolorText)
    } else if (type === INPUT_ENECOLOR_IMAGE) {
      setNewEnecolorBlockType(INPUT_ENECOLOR_IMAGE)
      setBlockInputEnecolorImage(initBlockInputEnecolorImage)
    }
    setDraftSelectedEnecolors([])
    setOpenEnecolorDialog(true)
  }
  const onSubmit = () => {
    setNewEnecolorBlockType('')
    setOpenEnecolorDialog(false)
    if (type === INPUT_ENECOLOR_TEXT) {
      const _blockInputEnecolorText = cloneDeep(blockInputEnecolorText)
      handleSubmitStructItems(_blockInputEnecolorText)
      onAddBlock(type, '', null, _blockInputEnecolorText)
    }
    if (type === INPUT_ENECOLOR_IMAGE) {
      const _blockInputEnecolorImage = cloneDeep(blockInputEnecolorImage)
      _blockInputEnecolorImage.data.enecolorId = draftSelectedEnecolors?.[0]?.id
      // handleSubmitStructItems(_blockInputEnecolorText)
      onAddBlock(type, '', null, _blockInputEnecolorImage)
      // setDraftSelectedEnecolors([])
    }
    if (type === ENECOLOR_RANK_IMG_V2) {
      const _blockEnecolorImage = cloneDeep(blockEnecolorImage)
      _blockEnecolorImage.data.enecolorId = draftSelectedEnecolors?.[0]?.id
      onAddBlock(type, '', null, null, _blockEnecolorImage)
      // setDraftSelectedEnecolors([])
    }
    if (type === ENECOLOR_RANK_TEXT_V2) {
      const _blockEnecolorText = cloneDeep(blockEnecolorText)
      handleSubmitStructItems(_blockEnecolorText)
      onAddBlock(type, '', null, null, _blockEnecolorText)
      // setDraftSelectedEnecolors([])
    }
  }

  const handleClose = () => {
    setNewEnecolorBlockType('')
    setOpenEnecolorDialog(false)
    // setDraftSelectedEnecolors([])
  }

  const handleSubmitStructItems = (_block: BlockInputEnecolorText | BlockEnecolorRankText | BlockInputEnecolorImage) => {
    const listVarIndex = getListVarIndex(draftText)
    const listVar = listVarIndex.map(x => x.value)
    let field = 'japanese'
    if (type === ENECOLOR_RANK_IMG_V2) {
      field = ''
    }
    const updateBlocks = () => {
      if (type === ENECOLOR_RANK_TEXT_V2) {
        return setBlockEnecolorText
      }
      if (type === ENECOLOR_RANK_IMG_V2) {
        return setBlockEnecolorImage
      }
      if (type === INPUT_ENECOLOR_TEXT) {
        return setBlockInputEnecolorText
      }
      return
    }

    handleUpdateBlockFields({
      field,
      text: draftText,
      enecolors: allUserEnecolors,
      listDataStructure,
      selectedStructureItems: draftChapterStructureItems,
      updateBlocks: updateBlocks,
      block: _block,
      listVar
    })
    setChapterStructItems(draftChapterStructureItems)
    setOpenDialogStructDetail(false)
  }
  return (
    <div className={`flex flex-wrap items-end gap-6 ${openTopLeftMenu ? 'max-w-[164px] 2xl:max-w-[200px]' : ''}`}>
      <div className={'flex flex-col gap-6'}>
        <div className={'flex flex-col'}>
          <FormControl variant="outlined" margin='dense'>
            <FormHelperText>エネカラー画像リスト</FormHelperText>
            <Select
              value={selectedEneColorRankImgSetting?.id ?? ''}
              onChange={(e) => {
                const id = e.target.value
                const selected = eneColorRankImgSettings.find(item => item.id === id)
                setSelectedEneColorRankImgSetting(selected)
              }}
              displayEmpty
              className={`h-[40px] ${selectedEneColorRankImgSetting?.id ? '' : 'text-[#A9A9A9] italic'}`}
            >
              <MenuItem key={0} value={""} className={'text-[#A9A9A9] italic'}>エネカラー画像追加</MenuItem>
              {
                eneColorRankImgSettings && eneColorRankImgSettings.map((item, index) =>
                  <MenuItem key={index + 1} value={item.id}>{item.title}</MenuItem>
                )
              }
            </Select>
          </FormControl>
          <Button variant="contained" onClick={() => {
            onAddBlock(ENECOLOR_RANK_IMG)
          }}>＋エネカラー画像</Button>
        </div>
        <Button variant="contained" onClick={() => {
          onclickButtonEnecolor(ENECOLOR_RANK_IMG_V2)
        }}>＋エネカラー画像V2</Button>
      </div>
      <div className={'flex flex-col gap-6'}>
        <div className={'flex flex-col'}>
          <FormControl variant="outlined" margin='dense'>
            <FormHelperText>エネカラー文章リスト</FormHelperText>
            <Select
              value={selectedEneColorRankTextSetting?.id ?? ''}
              onChange={(e) => {
                const id = e.target.value
                const selected = eneColorRankTextSettings.find(item => item.id === id)
                setSelectedEneColorRankTextSetting(selected)
              }}
              displayEmpty
              className={`h-[40px] ${selectedEneColorRankTextSetting?.id ? '' : 'text-[#A9A9A9] italic'}`}
            >
              <MenuItem key={0} value={""} className={"text-[#A9A9A9] italic"}>エネカラー文章追加</MenuItem>
              {
                eneColorRankTextSettings && eneColorRankTextSettings.map((item, index) =>
                  <MenuItem key={index + 1} value={item.id}>{item.title}</MenuItem>
                )
              }

            </Select>
          </FormControl>
          <Button variant='contained' onClick={() => {
            onAddBlock(ENECOLOR_RANK_TEXT)
          }}>＋エネカラー文章</Button>
        </div>
        <Button variant='contained' onClick={() => {
          onclickButtonEnecolor(ENECOLOR_RANK_TEXT_V2)
        }}>＋エネカラー文章V2</Button>
      </div>
      <Button variant='contained' onClick={() => onclickButtonEnecolor(INPUT_ENECOLOR_TEXT)}>＋Inputエネカラー文章 </Button>
      <Button variant='contained' onClick={() => onclickButtonEnecolor(INPUT_ENECOLOR_IMAGE)}>＋Inputエネカラー画像</Button>
      <div className={'hidden 2xl:block'}>
        <div className='flex items-end gap-6'>
          <Button variant="contained" onClick={() => onAddBlock('graph_4')}
                  className={'h-[40px] min-w-max'}>４色グラフ</Button>
          <Button variant="contained" onClick={() => onAddBlock('graph')}
                  className={'h-[40px] min-w-max'}>16分割グラフ</Button>
        </div>
      </div>
      {
        isShowModal ?
          <div className={'block 2xl:hidden'}>
            <div className='flex items-end gap-6'>
              <Button variant="contained" onClick={() => onAddBlock('graph_4')}
                      className={'h-[40px] min-w-max'}>４色グラフ</Button>
              <Button variant="contained" onClick={() => onAddBlock('graph')}
                      className={'h-[40px] min-w-max'}>16分割グラフ</Button>
            </div>
          </div>
          :
          <div className={'block 2xl:hidden'}>
            <div className='items-end gap-6'>
              <Button variant="contained" onClick={() => onAddBlock('graph_4')}
                      className={'h-[40px] min-w-max mb-5'}>４色グラフ</Button>
              <Button variant="contained" onClick={() => onAddBlock('graph')}
                      className={'h-[40px] min-w-max'}>16分割グラフ</Button>
            </div>
          </div>
      }
      {
        openEnecolorDialog &&
        <ModalSelectDataStruct openDialogStructDetail={openEnecolorDialog}
                               setOpenDialogStructDetail={setOpenEnecolorDialog}
                               handleSubmitStructItems={onSubmit}
                               handleClose={handleClose}
                               draftText={draftText} setDraftText={setDraftText}
                               draftChapterStructureItems={draftChapterStructureItems}
                               setDraftChapterStructureItems={setDraftChapterStructureItems}
                               structuresInChapter={structuresInChapter}
                               setStructInChapter={setStructInChapter}
                               setOpenDialogStruct={setOpenDialogStruct}
                               previewInputRef={previewInputRef}
                               type={type}
                               setDraftSelectedEnecolors={setDraftSelectedEnecolors}
                               draftSelectedEnecolors={draftSelectedEnecolors}/>
        // <Modal open={openEnecolorDialog}
        //        bgColor={'#F5F7FB'}
        //        dividers={false}
        //        setOpen={setOpenEnecolorDialog}
        //        title={<>{dialogTitle}</>}
        //        onSubmit={() => onSubmit()}
        //        size={'xl'}
        //        btnSubmit={'保存'}
        //        btnCancel={''}
        //        actionPosition={'center'}
        //        handleClose={() => handleClose()}
        // >
        //   <Enecolors previewTextBlock={isShowPreview && <PreviewTextBlock/>}/>
        // </Modal>
      }
    </div>
  );
}

export default EnecolorTabContent;
