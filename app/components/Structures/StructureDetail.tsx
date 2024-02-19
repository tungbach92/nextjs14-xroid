import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import TextField from "@mui/material/TextField";
import Dropdown from "@/app/components/custom/Dropdown";
import {DATA_SELECT_STRUCTURE} from "@/app/configs/constants";
import React, {ChangeEvent, SetStateAction, useEffect, useMemo, useState} from "react";
import {DataStructure, DataStructureItem} from "@/app/types/types";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {cloneDeep} from "lodash";
import {useRouter, useSearchParams} from "next/navigation";
import {getId} from "@/app/common/getId";
import {BaseDeleteModal} from "@/app/components/base";
import DialogCustom from "@/app/components/DialogCustom";
import {convertInputNumber} from "@/app/common/convertNumber";
import {Button} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface IStructureItemDetail {
  listDataStructure: DataStructure[]
  setListDataStructure: React.Dispatch<SetStateAction<DataStructure[]>>
  chapterStruct?: DataStructure
  draftChapterStructureItems?: DataStructureItem[]
  setDraftChapterStructureItems?: React.Dispatch<SetStateAction<DataStructureItem[]>>
  draftSelectedStructItemsPrompt?: DataStructureItem[]
  setDraftSelectedStructItemsPrompt?: React.Dispatch<SetStateAction<DataStructureItem[]>>
  isParentName?: boolean
  addSpecialTextVer2?: (item: DataStructureItem) => void
  inChapter?: boolean
  isPrompt?: boolean
}

const MAX_ITEM = 99

export const StructureDetail = ({
  listDataStructure,
  setListDataStructure,
  chapterStruct,
  draftChapterStructureItems = [],
  setDraftChapterStructureItems,
  isParentName,
  addSpecialTextVer2,
  inChapter,
  setDraftSelectedStructItemsPrompt,
  draftSelectedStructItemsPrompt,
  isPrompt
}: IStructureItemDetail) => {
  const query = useSearchParams()
  const structureId = chapterStruct ? chapterStruct.id : query.get('structureId') as string
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false)
  const [indexDelete, setIndexDelete] = useState<number>(0)
  const [text, setText] = useState('')
  const [addStructureDialog, setAddStructureDialog] = useState<boolean>(false)
  const [structureNumber, setStructureNumber] = useState<number>(0);
  const [structureItems, setStructureItems] = useState<DataStructureItem[]>(null);

  const draftChapterStructureItemIds = useMemo(() => draftChapterStructureItems?.map(item => item.id), [draftChapterStructureItems])
  const draftChapterStructureItemIdsPrompt = useMemo(() => draftSelectedStructItemsPrompt?.map(item => item.id), [draftSelectedStructItemsPrompt])

  useEffect(() => {
    const structure = chapterStruct ?? listDataStructure?.find(item => item.id === structureId);
    setStructureItems(structure?.items);
  }, [chapterStruct, listDataStructure]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const listStructures = cloneDeep(listDataStructure)
    const idx = listStructures.findIndex(item => item.id === structureId)
    if (idx !== -1) {
      const [reorderedItem] = listStructures[idx].items.splice(result.source.index, 1);
      listStructures[idx].items.splice(result.destination.index, 0, reorderedItem);
    }
    setListDataStructure(listStructures)
  };

  const handleAddStructureItem = (isMultiple: boolean) => {
    const listStructure = cloneDeep(listDataStructure)
    const idx = listStructure.findIndex(item => item.id === structureId)
    if (idx === -1) return
    if (isMultiple) {
      for (let i = 0; i < structureNumber; i++)
        listStructure[idx].items.push({
          id: getId('storageItem_', 10),
          type: 'text',
          fieldPath: '',
          isDeleted: false
        })
      setStructureNumber(0)
      setAddStructureDialog(false)
    } else {
      listStructure[idx].items.push({
        id: getId('storageItem_', 10),
        type: 'text',
        fieldPath: '',
        isDeleted: false
      })
    }
    setListDataStructure(listStructure)
  }

  const handleEditItemName = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    let _structureItems = cloneDeep(structureItems);
    _structureItems[index].fieldPath = e.target.value;
    setStructureItems(_structureItems);
  }
  const handleDelete = (index: number) => {
    const _structure = cloneDeep(listDataStructure)
    const idx = _structure.findIndex(item => item.id === structureId)
    if (idx === -1) return
    _structure[idx].items.splice(index, 1)
    setListDataStructure(_structure)
    setConfirmDelete(false)
  }

  const handleSelect = (e, index) => {
    const newData = cloneDeep(listDataStructure)
    const idx = newData.findIndex(item => item.id === structureId)
    if (idx === -1) return
    newData[idx].items[index].type = e.target.value
    setListDataStructure(newData)
  }

  const handleSelectStructureItem = (item: DataStructureItem) => {
    if (!draftChapterStructureItems || !draftSelectedStructItemsPrompt) return
    let _selectedStructureItems = [...draftChapterStructureItems]
    let _selectedStructureItemsPrompt = [...draftSelectedStructItemsPrompt]
    if (!isPrompt) {
      if (draftChapterStructureItemIds.includes(item.id)) {
        _selectedStructureItems = _selectedStructureItems.filter(x => x.id !== item.id)
        setDraftChapterStructureItems?.(_selectedStructureItems)
      } else {
        _selectedStructureItems.push(item)
        setDraftChapterStructureItems?.(_selectedStructureItems)
      }
    }


    if (isPrompt) {
      if (draftChapterStructureItemIdsPrompt.includes(item.id)) {
        _selectedStructureItemsPrompt = _selectedStructureItemsPrompt.filter(x => x.id !== item.id)
        setDraftSelectedStructItemsPrompt?.(_selectedStructureItemsPrompt)
        const foundIndex = _selectedStructureItems.findIndex(x => x.id === item.id)
        _selectedStructureItems.splice(foundIndex, 1)
        setDraftChapterStructureItems(_selectedStructureItems)

      } else {
        _selectedStructureItemsPrompt.push(item)
        _selectedStructureItems.push(item)
        setDraftSelectedStructItemsPrompt?.(_selectedStructureItemsPrompt)
        setDraftChapterStructureItems?.(_selectedStructureItems)
      }
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const _structure = cloneDeep(listDataStructure)
    const idx = _structure.findIndex(item => item.id === structureId)
    if (idx === -1) return
    _structure[idx].items[index].fieldPath = e.target.value
    setListDataStructure(_structure)
  }

  return (
    <div className={`flex flex-col rounded-md bg-white p-3 mt-2 ${inChapter ? 'min-w-[400px]' : 'w-1/3'}`}>
      {isParentName && <div className={'font-bold'}>{chapterStruct?.name}</div>}
      {!inChapter && <div className={'flex justify-center gap-4 mt-3'}>
        <Button variant="contained"
                onClick={() => handleAddStructureItem(false)}
                startIcon={<AddIcon/>}
                className={'flex-1'}>追加</Button>
        <Button variant="contained"
                onClick={() => setAddStructureDialog(true)}
                startIcon={<img src="/icons/data-structure-add-multi-icon.svg" alt=""/>}
                className={'flex-1'}>複数追加</Button>
      </div>}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="items">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {structureItems?.map((i, index: number) => {
                if (!i?.id) return null
                return (
                  <Draggable key={i.id + index} draggableId={i.id} index={index} isDragDisabled={inChapter}>
                    {(provided) => (
                      <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}
                           className={`group`}>
                        <div key={index}
                             title={draftChapterStructureItemIds?.includes(i.id) ? 'Click To Unselect' : 'Click To Select'}
                             className={`bg-[#F5F7FB] rounded-md mt-2 ${(isPrompt ? draftChapterStructureItemIdsPrompt?.includes(i.id) : draftChapterStructureItemIds?.includes(i.id)) && 'border-2 border-solid border-darkBlue'} ${inChapter && 'cursor-pointer hover:scale-105'}`}
                             onClick={() => {
                               handleSelectStructureItem(i)
                               addSpecialTextVer2?.(i)
                             }}>
                          <div className='relative'>
                            {!inChapter && <div className={'absolute top-1 right-1'}>
                              <CloseOutlinedIcon className={'w-5 cursor-pointer'} onClick={() => {
                                setIndexDelete(index)
                                setConfirmDelete(true)
                                setText(i?.fieldPath)
                              }}/>
                            </div>}
                            <div className={`flex gap-4 p-3 ${inChapter && 'pointer-events-none'}`}>
                              <TextField
                                className={'w-[150px]'}
                                size={'small'}
                                multiline={false}
                                label={'変数名'}
                                value={i?.fieldPath}
                                onChange={(e) => handleEditItemName(e, index)}
                                onBlur={e => handleBlur(e, index)}
                              />

                              <Dropdown
                                className={''}
                                dataSelect={DATA_SELECT_STRUCTURE}
                                value={i?.type}
                                onChange={(e) => handleSelect(e, index)}
                                minWidth={150}
                              />
                            </div>
                          </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  )
                }
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {/*<div className={'flex justify-center gap-4 mt-3'}>*/}
      {/*  <div*/}
      {/*    onClick={() => handleAddStructureItem(false)}*/}
      {/*    className={'basis-1/2 border border-dashed rounded-lg cursor-pointer hover:bg-[#eceff2] text-center p-4'}*/}
      {/*  >*/}
      {/*    <img src="/icons/data-structure-add-icon.svg" alt=""/>*/}
      {/*  </div>*/}
      {/*  <div*/}
      {/*    onClick={() => setAddStructureDialog(true)}*/}
      {/*    className={'basis-1/2 flex items-center justify-center gap-4 border border-dashed rounded-lg cursor-pointer hover:bg-[#eceff2] text-center p-4'}*/}
      {/*  >*/}
      {/*    <img src="/icons/data-structure-add-multi-icon.svg" alt=""/>*/}
      {/*    複数追加*/}
      {/*  </div>*/}
      {/*</div>*/}
      {confirmDelete &&
        <BaseDeleteModal
          handleClose={() => setConfirmDelete(false)}
          label={`${text ? text : indexDelete}ファイルを削除しますか？`}
          isOpen={confirmDelete}
          handleDelete={() => handleDelete(indexDelete)}
        />
      }
      {
        addStructureDialog &&
        <DialogCustom open={addStructureDialog} setOpen={setAddStructureDialog}
                      titleOk={'確定'}
                      onClick={() => handleAddStructureItem(true)}
                      onClose={() => setStructureNumber(0)}
                      fullWidth={false}>
          <div className={'w-full flex flex-col gap-2 px-4 pt-4'}>
            <div className={'text-sm font-medium'}>追加したい数を選んでください。？</div>
            <TextField type={"number"} size={"small"}
                       className={'bg-[#F5F7FB]'}
                       value={convertInputNumber(structureNumber)}
                       onChange={(e) => {
                         if (Number(e.target.value) < 0 || Number(e.target.value) > MAX_ITEM) return
                         setStructureNumber(Number(e.target.value))
                       }}/>
          </div>
        </DialogCustom>
      }
    </div>
  )
}
