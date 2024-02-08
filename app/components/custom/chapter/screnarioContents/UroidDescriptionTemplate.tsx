import React, {useEffect, useMemo, useRef, useState} from 'react';
import CardCustom from "@/app/components/custom/CardCustom";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import {BlockURoidDescription} from "@/app/types/block";
import {CssTextField} from "@/app/components/custom/CssTextField";
import {chapterErrorAtom} from "@/app/store/atom/chapterError.atom";
import {Chapter, DataStructureItem} from "@/app/types/types";
import {UROID_DES} from "@/app/configs/constants";
import ButtonAddVariableAndUserName
  from "@/app/components/custom/chapter/contents/component/ButtonAddVariableAndUserName";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {structuresInChapterAtom} from "@/app/store/atom/structuresInChapter.atom";
import ModalSelectDataStruct from "@/app/components/custom/chapter/contents/component/ModalSelectDataStruct";
import {cloneDeep} from "lodash";
import {readWriteBlocksAtom} from "@/app/store/atom/blocks.atom";
import {openDialogStructAtom} from "@/app/store/atom/openDialogStruct.atom";
import {useStructureDataAtom} from "@/app/store/atom/structureData.atom";
import {getSelectedStructureItems} from "@/app/common/getSelectedStructureItems";
import {handleChangeDraftText} from "@/app/common/handleChangeDraftText";
import {handlePressBackSpace} from "@/app/common/handlePressBackSpace";
import {textInputRefAtom} from "@/app/store/atom/textInputRef.atom";
import {blockIdAtom} from "@/app/store/atom/blockId.atom";
import {getListVarIndex} from "@/app/common/getListVarIndex";
import {handleUpdateBlockFields} from "@/app/common/handleUpdateBlockFields";
import {allUserEnecolorsAtom} from "@/app/store/atom/allUserEnecolors.atom";

type props = {
  onDelete: () => void
  onCopy: () => void
  block: BlockURoidDescription
  isShowAddButton?: boolean
  handleGetIndex?: () => void
  handleMultiCopy?: (type: string) => void
  handleChangeField: (e) => void,
  handleCheckField: (e) => void
  chapter: Chapter
}

function UroidDescriptionTemplate({
  onCopy,
  onDelete,
  block,
  isShowAddButton,
  handleGetIndex,
  handleMultiCopy,
  handleChangeField,
  handleCheckField,
  chapter
}: props) {
  const chapterError = useAtomValue(chapterErrorAtom)
  const condition = chapterError.uRoidDescription && !block.data.isUserAction && !block.data.description && chapter?.chapterType === 'createURoid'
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [structuresInChapter, setStructInChapter] = useAtom(structuresInChapterAtom)
  const [chapterStructItems, setChapterStructItems] = useState<DataStructureItem[]>([])
  const [draftChapterStructureItems, setDraftChapterStructureItems] = useState<DataStructureItem[]>([])
  const [draftText, setDraftText] = useState<string>('')
  const [openDialogStructDetail, setOpenDialogStructDetail] = useState<boolean>(false)
  const [listDataStructure] = useStructureDataAtom();
  const updateBlocks = useSetAtom(readWriteBlocksAtom)
  const setOpenDialogStruct = useSetAtom(openDialogStructAtom)
  const previewInputRef = useRef(null)
  const allUserEnecolors = useAtomValue(allUserEnecolorsAtom)
  const setTextInputRef = useSetAtom(textInputRefAtom)
  const setBlockId = useSetAtom(blockIdAtom)

  const selectedGroupsStruct = useMemo(() => {
    const _block = cloneDeep(block) as BlockURoidDescription
    return _block?.data?.groupsStruct?.filter(x => _block?.data?.description?.includes(x?.userInput)) ?? []
  }, [block.data.groupsStruct])

  const selectedGroupsText = useMemo(() => {
    const _block = cloneDeep(block) as BlockURoidDescription
    return _block?.data?.groupsText?.filter(x => _block?.data?.description?.includes(x?.userInput)) ?? []
  }, [block.data.groupsText])

  useEffect(() => {
    const _selectedStructureItemIds = selectedGroupsStruct?.map(x => x.dataStructId)?.concat(selectedGroupsText?.map(x => x.dataStructId))
    const _selectedStructureItems = structuresInChapter?.map(x => x.items)?.flat()?.filter(y => _selectedStructureItemIds.includes(y.id))
    setChapterStructItems(_selectedStructureItems)
    setDraftChapterStructureItems(_selectedStructureItems)
  }, [selectedGroupsStruct, selectedGroupsText, structuresInChapter])

  useEffect(() => {
    setDraftText(block?.data?.description)
  }, [block?.data?.description])

  const handleSubmitStructItems = () => {
    const _block = cloneDeep(block)
    const listVarIndex = getListVarIndex(draftText)
    const listVar = listVarIndex.map(x => x.value)
    handleUpdateBlockFields({
      field: "description",
      text: draftText,
      enecolors: allUserEnecolors,
      listDataStructure,
      selectedStructureItems: draftChapterStructureItems,
      updateBlocks,
      block: _block,
      listVar
    })
    setChapterStructItems(draftChapterStructureItems)
    setOpenDialogStructDetail(false)
  }

  const handleClose = () => {
    setOpenDialogStructDetail(false)
    setDraftChapterStructureItems(chapterStructItems)
    setDraftText(block?.data?.description)
  }

  const handleSelectStructItem = (_block: BlockURoidDescription, event: any) => {
    const inputValue = event.target.value
    const _selectedStructureItems = getSelectedStructureItems({
      inputValue,
      structuresInChapter,
    })
    setChapterStructItems(_selectedStructureItems)
    const listVarIndex = getListVarIndex(inputValue)
    const listVar = listVarIndex.map(x => x.value)
    handleUpdateBlockFields({
      selectedStructureItems: _selectedStructureItems,
      listDataStructure,
      enecolors: allUserEnecolors,
      updateBlocks,
      block: _block,
      listVar
    })
  }

  const updateBlockField = (_block, inputValue) => {
    _block.data.description = inputValue
    _block.data.description = inputValue
    const selectedGroupsStruct = block?.data?.groupsStruct?.filter(x => _block?.data?.description?.includes(x?.userInput))
    _block.data.groupsStruct = cloneDeep(selectedGroupsStruct)
    updateBlocks(_block)
  }

  const onChangeOutPutText = (event) => {
    handleChangeDraftText({block, event, setDraftText, draftText, updateBlockField})
    handleSelectStructItem(block, event)
  }

  const updateBlockFieldOnBackSpace = (_block: BlockURoidDescription, x: {
    startIndex: number,
    endIndex: number,
    value: string
  }, _selectedStructureItems: DataStructureItem[]) => {
    const text = block.data.description.replace(x.value, '')
    const listVarIndex = getListVarIndex(text)
    const listVar = listVarIndex.map(x => x.value)
    handleUpdateBlockFields({
      field: "description",
      text,
      selectedStructureItems: _selectedStructureItems,
      listDataStructure,
      enecolors: allUserEnecolors,
      updateBlocks,
      block: _block,
      listVar
    })
  }

  const onPressBackSpace = (event) => {
    const _block = cloneDeep(block)
    handlePressBackSpace({
      event,
      updateBlockFieldOnBackSpace,
      _block,
      draftChapterStructureItems,
      structuresInChapter,
      setDraftText,
      draftText,
      setDraftChapterStructureItems
    })
  }

  return (
    <div className={'h-full'}>
      <CardCustom isCopy={false} onCopy={onCopy} onDelete={onDelete}
                  block={block}
                  title={'Description'} color={`${condition ? 'red' : '#1976D2'}`}
                  handleMultiCopy={handleMultiCopy}
                  handleGetIndex={handleGetIndex}
                  isShowAddButton={isShowAddButton}
                  className={`border-2 border-solid ${condition ? 'border-red-500' : 'border-[#1976D2]'} min-w-[400px] 2xl:min-w-[600px] h-full relative text-white`}>
        <FormControlLabel name={'isUserAction'} control={<Checkbox checked={block.data.isUserAction}
                                                                   onChange={handleCheckField}/>}
                          label="ユーザー入力" className={'text-black'}/>
        <ButtonAddVariableAndUserName inputRef={inputRef} block={block}
                                      structuresInChapter={structuresInChapter}
                                      setChapterStructItems={setChapterStructItems}
                                      setDraftText={setDraftText}
                                      setOpenDialogStructDetail={setOpenDialogStructDetail}
                                      type={UROID_DES}
                                      disabled={block.data.isUserAction}
                                      selectedGroupsStruct={selectedGroupsStruct}
                                      selectedGroupsText={selectedGroupsText}
        />
        <div className={'flex gap-3 my-3'}>
          <CssTextField
            maxRows={5}
            inputRef={inputRef}
            name={'description'}
            InputLabelProps={{shrink: true}}
            id="outlined-basic"
            className={'w-full'}
            placeholder={`${block.data.isUserAction ? 'ユーザー入力' : '入力してください。'}`}
            multiline={true}
            variant="outlined"
            size={'small'}
            value={openDialogStructDetail ? block?.data?.description : draftText}
            onChange={(e) => {
              onChangeOutPutText(e)
            }}
            onKeyDown={onPressBackSpace}
            onClick={() => {
              setTextInputRef(inputRef)
              setBlockId(block?.id ?? '')
            }}
            disabled={block.data.isUserAction}
          />
        </div>
        <ModalSelectDataStruct
          openDialogStructDetail={openDialogStructDetail}
          setOpenDialogStructDetail={setOpenDialogStructDetail}
          handleSubmitStructItems={handleSubmitStructItems}
          handleClose={handleClose}
          draftText={draftText}
          setDraftText={setDraftText}
          draftChapterStructureItems={draftChapterStructureItems}
          setDraftChapterStructureItems={setDraftChapterStructureItems}
          structuresInChapter={structuresInChapter}
          block={block}
          setStructInChapter={setStructInChapter}
          setOpenDialogStruct={setOpenDialogStruct}
          previewInputRef={previewInputRef}
          chapter={chapter}
        />
      </CardCustom>
    </div>
  );
}

export default UroidDescriptionTemplate;
