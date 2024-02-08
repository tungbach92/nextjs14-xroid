import React, {useEffect, useMemo, useState} from 'react';
import {Button, Tab, Tabs} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {Close} from "@mui/icons-material";
import PreviewTextBlock from "@/app/components/custom/chapter/PreviewTextBlock";
import {StructureDetail} from "@/app/components/Structures/StructureDetail";
import DialogCustom from "@/app/components/DialogCustom";
import {Chapter, DataStructure, DataStructureItem} from "@/app/types/types";
import {getFieldPath} from "@/app/common/getStructParentId";
import {BlockInputEnecolorImage, BlockInputEnecolorText, BlockText, Enecolor} from "@/app/types/block";
import {useStructureDataAtom} from "@/app/store/atom/structureData.atom";
import {getListVarIndex} from "@/app/common/getListVarIndex";
import {getSelectedStructureItems} from "@/app/common/getSelectedStructureItems";
import Enecolors from "@/app/components/Enecolors/Enecolors";
import {
  ENECOLOR_RANK_IMG_V2,
  ENECOLOR_RANK_TEXT_V2,
  INPUT_ENECOLOR_IMAGE,
  INPUT_ENECOLOR_TEXT
} from "@/app/configs/constants";

type Props = {
  openDialogStructDetail: boolean
  setOpenDialogStructDetail: (open: boolean) => void
  handleSubmitStructItems: () => void
  handleClose: () => void
  draftText: string
  setDraftText: (text: string) => void
  draftChapterStructureItems: DataStructureItem[]
  setDraftChapterStructureItems: React.Dispatch<React.SetStateAction<DataStructureItem[]>>
  structuresInChapter: DataStructure[]
  block?: BlockText | BlockInputEnecolorImage | BlockInputEnecolorText
  setStructInChapter: React.Dispatch<React.SetStateAction<DataStructure[]>>
  setOpenDialogStruct: (open: boolean) => void
  previewInputRef: React.MutableRefObject<HTMLInputElement> | null
  chapter?: Chapter
  isPrompt?: boolean
  type?: string
  draftSelectedEnecolors?: Enecolor[]
  setDraftSelectedEnecolors?: React.Dispatch<React.SetStateAction<Enecolor[]>>
}

function ModalSelectDataStruct({
                                 openDialogStructDetail,
                                 setOpenDialogStructDetail,
                                 handleSubmitStructItems,
                                 handleClose,
                                 draftText,
                                 setDraftText,
                                 draftChapterStructureItems,
                                 setDraftChapterStructureItems,
                                 structuresInChapter,
                                 setStructInChapter,
                                 setOpenDialogStruct,
                                 previewInputRef,
                                 isPrompt = false,
                                 type,
                                 setDraftSelectedEnecolors,
                                 draftSelectedEnecolors,
                                 block,
                               }: Props) {
  const [tabValue, setTabValue] = useState<number>(0)
  const [listDataStructure] = useStructureDataAtom();
  const [draftSelectedStructItemsPrompt, setDraftSelectedStructItemsPrompt] = useState<DataStructureItem[]>([])
  const tabDisabled = useMemo(() => {
    return type === INPUT_ENECOLOR_TEXT || type === INPUT_ENECOLOR_IMAGE || type === ENECOLOR_RANK_IMG_V2 || type === ENECOLOR_RANK_TEXT_V2
  }, [type])

  const previewDisabled = useMemo(() => {
    return type === INPUT_ENECOLOR_IMAGE || type === ENECOLOR_RANK_IMG_V2
  }, [type])

  useEffect(() => {
    const _selectedStructureItems = getSelectedStructureItems({
      inputValue: draftText,
      structuresInChapter,
    })
    setDraftSelectedStructItemsPrompt(_selectedStructureItems)
  }, [draftText, structuresInChapter])

  useEffect(() => {
    if (tabDisabled) {
      setTabValue(1)
    }
  }, [tabDisabled])
  const addSpecialTextVer2 = (item: DataStructureItem) => {
    const fieldPathWithParent = getFieldPath(listDataStructure, item.id)
    const specialText = `{{${fieldPathWithParent}}}`
    const inputElement = previewInputRef?.current;
    if (!inputElement) return
    const {selectionStart, selectionEnd} = inputElement;
    const currentValue = inputElement.value;

    if (currentValue.includes(specialText)) {
      // replace all the same special text
      inputElement.value = currentValue.replace(new RegExp(specialText, 'g'), '')
      // calculate focus position
      const indices = getListVarIndex(draftText)
      const found = indices.find(x => x.value === specialText)
      found && setTimeout(() => {
        inputElement.selectionStart = found.startIndex
        inputElement.selectionEnd = found.startIndex
        inputElement.focus();
      })
    } else {
      inputElement.value = `${currentValue.slice(0, selectionStart)}${specialText}${currentValue.slice(selectionEnd)}`;
      // calculate focus position
      const indices = getListVarIndex(inputElement.value)
      const found = indices.find(x => x.value === specialText)
      found && setTimeout(() => {
        inputElement.selectionStart = found.endIndex + 1
        inputElement.selectionEnd = found.endIndex + 1
        inputElement.focus();
      })
    }
    setDraftText(inputElement.value)
  }

  return (
    <DialogCustom
      dialogHeight={'h-[100vh]'} open={openDialogStructDetail}
      setOpen={setOpenDialogStructDetail}
      title={
        <Tabs value={tabValue}
              onChange={(event: any, newValue: any) => {
                setTabValue(newValue)
              }}
              aria-label="anim_tab"
              variant={'scrollable'}
        >
          {!tabDisabled && <Tab value={0} label="データ構造" disabled={tabDisabled}/>}
          <Tab value={1} label="エネカラー"/>
        </Tabs>
      }
      maxWidth={false}
      onClick={handleSubmitStructItems}
      onClose={handleClose}
      isCancelBtn={false}
      classNameBtnOk={'m-auto w-[200px]'}
      closeBtn={<IconButton onClick={handleClose} className={'absolute top-0 right-0'}><Close/></IconButton>}
      titleBorderBottom={'1px solid lightgray'}
      bgColor={'#F6F7FB'}
    >

      <div className={'w-full'}>
        <div className={'flex justify-between my-2 px-[24px]'}>
          {tabValue === 0 &&
            <div className={'flex gap-6'}>
              <Button variant="contained"
                      onClick={() => {
                        setOpenDialogStruct(true)
                      }}
                      className={'h-[40px] w-[260px]'}>ストレージを追加</Button>
            </div>
          }
          {tabValue === 0 && <PreviewTextBlock ref={previewInputRef} draftText={draftText} setDraftText={setDraftText}
                                               draftChapterStructureItems={draftChapterStructureItems}
                                               type={block?.type}
                                               setDraftChapterStructureItems={setDraftChapterStructureItems}
                                               draftSelectedStructItemsPrompt={draftSelectedStructItemsPrompt}
                                               setDraftSelectedStructItemsPrompt={setDraftSelectedStructItemsPrompt}
                                               structuresInChapter={structuresInChapter} block={block}/>
          }
          {tabValue === 1 &&
            <Enecolors
              draftSelectedEnecolors={draftSelectedEnecolors}
              setDraftSelectedEnecolors={setDraftSelectedEnecolors}
              previewInputRef={previewInputRef}
              draftText={draftText}
              setDraftText={setDraftText}
              isTextOnly={true} isModal={true} type={type || block.type} block={block}
              previewDisabled={previewDisabled}
              inEneColor={false}
              previewTextBlock={!previewDisabled &&
                <PreviewTextBlock ref={previewInputRef} draftText={draftText}
                                  setDraftText={setDraftText}
                                  draftSelectedEnecolors={draftSelectedEnecolors}
                                  setDraftSelectedEnecolors={setDraftSelectedEnecolors}
                />}

            />
          }
        </div>
        {tabValue === 0 &&
          <div className={`max-w-full max-h-[300px] overflow-auto flex gap-2`}>
            {
              structuresInChapter?.map(item =>
                <StructureDetail key={item.id}
                                 chapterStruct={item}
                                 setListDataStructure={setStructInChapter}
                                 draftChapterStructureItems={draftChapterStructureItems}
                                 setDraftChapterStructureItems={setDraftChapterStructureItems}
                                 draftSelectedStructItemsPrompt={draftSelectedStructItemsPrompt}
                                 setDraftSelectedStructItemsPrompt={setDraftSelectedStructItemsPrompt}
                                 listDataStructure={structuresInChapter}
                                 addSpecialTextVer2={addSpecialTextVer2}
                                 isParentName={true}
                                 inChapter={true}
                                 isPrompt={isPrompt}
                />)
            }
          </div>
        }
      </div>
    </DialogCustom>
  );
}

export default ModalSelectDataStruct;
