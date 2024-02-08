import React, {MutableRefObject, useState} from 'react';
import CardCustom from "@/app/components/custom/CardCustom";
import {cloneDeep} from "lodash";
import Dropdown from "@/app/components/custom/Dropdown";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {getId} from "@/app/common/getId";
import TextField from "@mui/material/TextField";
import Modal from "@/app/components/custom/Modal";
import {
  DATA_SELECT_STRUCTURE,
  MULTI_PROMPT_INPUT_V2,
  MULTI_PROMPT_INPUT_WITHOUT_CHAR_V2,
  PROMPT_INPUT_V2,
  PROMPT_INPUT_WITHOUT_CHAR_V2,
  PROMPT_V2,
  PROMPT_WITHOUT_CHAR_V2,
  TEXT_V2,
  UROID_CHARPROMPT_FOOTER,
  UROID_CHARPROMPT_HEADER,
  UROID_DES
} from "@/app/configs/constants";
import {structureIdInnChapterAtom} from "@/app/store/atom/structureIdsInChapter.atom";
import {Chapter, DataStructureItem, NewDataStructure} from "@/app/types/types";
import {IconButton} from "@mui/material";
import {mapDataToAddIndex} from "@/app/common/mapDataToAddIndex";
import {handleAddBlock} from "@/app/components/custom/chapter/contents/common/handleAddBlock";
import {blocksAtom, readWriteBlocksAtom} from "@/app/store/atom/blocks.atom";
import {useScrollToBottomPage} from "@/app/hooks/useScrollToBottomPage";
import {getFieldPath, getStructParentId} from "@/app/common/getStructParentId";
import {
  BlockPrompt,
  BlockText,
  BlockUroidCharPromptFooter,
  BlockUroidCharPromptHeader,
  BlockURoidDescription,
  DataInput,
  GroupStruct
} from "@/app/types/block";
import {textInputRefAtom} from "@/app/store/atom/textInputRef.atom";
import {blockIdAtom} from "@/app/store/atom/blockId.atom";
import {useStructureDataAtom} from "@/app/store/atom/structureData.atom";
import {structuresInChapterAtom} from "@/app/store/atom/structuresInChapter.atom";
import {enecolorsAtom} from "@/app/store/atom/enecolors.atom";
import {VirtuosoHandle} from "react-virtuoso";
import {iconImg} from "@/app/components/assets/image/icon";
import Button from "@mui/material/Button";
import {focusInputPromptAtom} from "@/app/store/atom/focusInputPrompt.atom";


type props = {
  data: NewDataStructure,
  structure: NewDataStructure[],
  setStructure: React.Dispatch<React.SetStateAction<NewDataStructure[]>>
  setSelected: React.Dispatch<React.SetStateAction<NewDataStructure[]>>
  setChapter: React.Dispatch<React.SetStateAction<Chapter>>
  virtuosoRef?: MutableRefObject<VirtuosoHandle | null>
}

function StructureItems({
  data, structure, setStructure = () => {
  }, setSelected, setChapter, virtuosoRef
}: props) {
  const [items, setItems] = useState<any>(data?.items)
  const [name, setName] = useState<string>(data?.name)
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false)
  const [indexDelete, setIndexDelete] = useState<number>(0)
  const [confirmRemove, setConfirmRemove] = useState<boolean>(false)
  const [ids, setIds] = useAtom(structureIdInnChapterAtom)
  const [blocks, setBlocks] = useAtom(blocksAtom)
  const {setDummyAdd} = useScrollToBottomPage({virtuosoRef})
  const updateBlocks = useSetAtom(readWriteBlocksAtom)
  const textInputRef = useAtomValue(textInputRefAtom)
  const blockId = useAtomValue(blockIdAtom)
  const block = blocks?.find(x => x.id === blockId)
  const [listDataStructure] = useStructureDataAtom();
  const [structuresInChapter,] = useAtom(structuresInChapterAtom)
  const enecolors = useAtomValue(enecolorsAtom)
  const focusInputPrompt = useAtomValue(focusInputPromptAtom)

  const handleAddStructureItem = () => {
    const _items = cloneDeep(items)
    _items.push({
      id: getId('storageItem_', 10),
      type: 'text',
      fieldPath: '',
      isDeleted: false
    })
    setItems(_items)
    data.items = _items
  }
  const onchangeName = (e) => {
    setName(e.target.value)
    data.name = e.target.value
  }

  const handleEditItemName = (e, index) => {
    const _items = cloneDeep(items)
    _items[index].fieldPath = e.target.value
    setItems(_items)
    data.items = _items
  }
  const handleDelete = (index: number) => {
    const _items = cloneDeep(items)
    _items.splice(index, 1)
    setItems(_items)
    data.items = _items
    setConfirmDelete(false)

  }

  const handleRemoveStructure = () => {
    const selectData = cloneDeep(structure)
    selectData.find((i: any) => i.id === data.id).isCheckInChapter = false
    setStructure(selectData)
    setConfirmRemove(false)
    const _ids = cloneDeep(ids)
    _ids.splice(_ids.indexOf(data.id), 1)
    setIds(ids)
    setSelected(selectData.filter(item => item.isCheckInChapter))
    setChapter({dataStructureIds: _ids})
  }

  const handleSelect = (e, index) => {
    const _items = cloneDeep(items)
    _items[index].type = e.target.value
    setItems(_items)
    data.items = _items
  }

  const onAddBlock = (type: string, id: string) => {
    const textInput = {
      dataInput: id,
      parentId: getStructParentId(structure, id.toString()),
      fieldPath: getFieldPath(structure, id.toString())
    } satisfies DataInput
    handleAddBlock({
      url: '',
      selectedTextSetting: null,
      blockIndex: undefined,
      setDummyAdd: setDummyAdd,
      setBlocks: setBlocks,
      actionCharacter: [],
      mapDataToAddIndex: mapDataToAddIndex,
      type: type,
      blocks: blocks,
      textInput
    })
  }

  const handleSelectStructureItem = (item: DataStructureItem) => {
    if (!item) return;

    //add text input
    const fieldPathWithParent = getFieldPath(listDataStructure, item.id)
    const specialText = `{{${fieldPathWithParent}}}`
    const inputElement = textInputRef?.current;
    if (!inputElement) return
    const {selectionStart, selectionEnd} = inputElement;
    const currentValue = inputElement.value;
    const isSpecialExist = currentValue.includes(specialText)
    if (isSpecialExist)
      inputElement.value = currentValue.replace(specialText, '')
    else
      inputElement.value = `${currentValue.slice(0, selectionStart)}${specialText}${currentValue.slice(selectionEnd)}`;
    inputElement.selectionStart = selectionStart + specialText.length
    inputElement.selectionEnd = selectionStart + specialText.length
    inputElement.focus();

    switch (block.type) {
      case TEXT_V2:
        const _block1 = cloneDeep(block) as BlockText
        _block1.data.message.japanese = inputElement.value
        updateGroupStructAndGroupText(_block1, item, isSpecialExist)
        return;
      case UROID_DES:
        const _block2 = cloneDeep(block) as BlockURoidDescription
        _block2.data.description = inputElement.value
        updateGroupStructAndGroupText(_block2, item, isSpecialExist)
        return;
      case UROID_CHARPROMPT_HEADER:
      case UROID_CHARPROMPT_FOOTER:
        const _block3 = cloneDeep(block) as BlockUroidCharPromptHeader | BlockUroidCharPromptFooter
        _block3.data.characterPrompt = inputElement.value
        updateGroupStructAndGroupText(_block3, item, isSpecialExist)
        return;
      case PROMPT_V2:
      case PROMPT_WITHOUT_CHAR_V2:
      case PROMPT_INPUT_V2:
      case PROMPT_INPUT_WITHOUT_CHAR_V2:
      case MULTI_PROMPT_INPUT_V2:
      case MULTI_PROMPT_INPUT_WITHOUT_CHAR_V2:
        if (!focusInputPrompt)
          return;
        const _block4 = cloneDeep(block) as BlockPrompt
        _block4.data[focusInputPrompt] = inputElement.value
        updateGroupStructAndGroupText(_block4, item, isSpecialExist)
        return;
      default:
        return;
    }
    // virtuosoRef?.current?.scrollToIndex({
    //   index: block.index,
    //   behavior: "smooth"
    // })
  }

  const updateGroupStructAndGroupText = (_block: BlockText | BlockURoidDescription | BlockUroidCharPromptHeader | BlockUroidCharPromptFooter | BlockPrompt, item: DataStructureItem, isSpecialExist: boolean) => {
    // add groupStruct and groupText
    !isSpecialExist ? _block.data.groupsStruct.push({
      dataStructId: item.id,
      parentId: getStructParentId(listDataStructure, item.id),
      userInput: `{{${getFieldPath(listDataStructure, item.id)}}}`
    } satisfies GroupStruct) : (_block.data.groupsStruct = _block.data.groupsStruct.filter(x => x.dataStructId !== item.id))
    updateBlocks(_block)
  }

  return (
    <div className={'h-full w-full'}>
      <div className={'rounded-md bg-white'}>
        <div className={'flex justify-between pt-5'}>
          <TextField
            disabled={true}
            className={'bg-white pl-3'}
            variant="standard"
            placeholder={'題名'}
            size={'small'}
            value={name}
            onChange={(e) => {
              onchangeName(e)
            }}
            InputProps={{disableUnderline: true}}/>
          {/*<DeleteOutlineOutlinedIcon onClick={() => setConfirmRemove(true)}*/}
          {/*                           className={'cursor-pointer'}/>*/}
        </div>
        <div className={'pb-4'}>
          {
            data?.items?.map((i, index: number) => {
              if (!i?.id) return null
              return (
                <Button key={index}
                        className={`p-2 bg-[#F5F7FB] my-3 rounded-md min-w-[170px] hover:scale-110`}
                        onDoubleClick={() => handleSelectStructureItem(i)}>
                  <div className={'m-auto'}>
                    <CardCustom
                      isDataStruct={true}
                      isClose={false}
                      onDelete={() => {
                        setIndexDelete(index)
                        setConfirmDelete(true)
                      }}>
                      <div className={'flex gap-2 items-center'}>
                        <div>
                          <TextField
                            disabled={true}
                            fullWidth={true}
                            className={'my-3'}
                            size={'small'}
                            multiline={true}
                            label={'変数名'}
                            defaultValue={'new'}
                            value={i?.fieldPath}
                            onChange={(e: any) => handleEditItemName(e, index)}/>

                          <Dropdown dataSelect={DATA_SELECT_STRUCTURE} className={'w-full'}
                                    value={i?.type}
                                    disabled={true}
                                    onChange={(e) => handleSelect(e, index)}
                                    renderValue={'文字列'}
                          />
                        </div>
                        <IconButton
                          onClick={(e) => {
                            e?.stopPropagation()
                            onAddBlock('textInput', i.id)
                          }}><img src={iconImg.addInput} alt={'addInput'}/></IconButton>
                      </div>
                    </CardCustom>
                  </div>
                </Button>
              )
            })
          }
          {/*<div*/}
          {/*  className={'bg-[#F5F7FB] h-[70px] rounded-md mx-4 flex items-center border border-1 border-dashed'}>*/}
          {/*  <IconButton className={'rounded-full w-[50px] h-[50px] m-auto'} onClick={handleAddStructureItem}>*/}
          {/*    <AddIcon className={'m-auto'}/>*/}
          {/*  </IconButton>*/}
          {/*</div>*/}
        </div>
      </div>
      {
        confirmRemove && <Modal open={confirmRemove}
                                setOpen={setConfirmRemove}
                                btnSubmit={'OK'}
                                onSubmit={handleRemoveStructure}
                                handleClose={() => setConfirmRemove(false)}
                                title={'このデータを削除しますか？'}
                                actionPosition={'center'}
        />
      }
      {
        <Modal open={confirmDelete}
               setOpen={setConfirmDelete}
               btnSubmit={'OK'}
               onSubmit={() => handleDelete(indexDelete)}
               handleClose={() => setConfirmDelete(false)}
               title={'ファイルを削除しますか？'}
        />
      }
    </div>
  );
}

export default StructureItems;
