import React, {useState} from 'react';
import {cloneDeep} from "lodash";
import Dropdown from "@/app/components/custom/Dropdown";
import {getId} from "@/app/common/getId";
import TextField from "@mui/material/TextField";
import {DATA_SELECT_STRUCTURE} from '@/app/configs/constants';
import {BaseDeleteModal} from "@/app/components/base";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import DialogCustom from "@/app/components/DialogCustom";
import {DataStructureItem} from "@/app/types/types";
import {convertInputNumber} from "@/app/common/convertNumber";

function StructureList(props) {
  const {data, structure, setStructure, selectedList, setSelectedList} = props
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false)
  const [indexDelete, setIndexDelete] = useState<number>(0)
  const [text, setText] = useState('')
  const [addStructureDialog, setAddStructureDialog] = useState<boolean>(false)
  const [structureNumber, setStructureNumber] = useState<number>(0)

  const handleAddStructureItem = (isMultiple: boolean) => {
    const _structure = cloneDeep(structure)
    const idx = _structure.findIndex(item => item.id === data.id)
    if (idx === -1) return
    if (isMultiple) {
      for (let i = 0; i < structureNumber; i++)
        _structure[idx].items.push({
          id: getId('storageItem_', 10),
          type: 'text',
          fieldPath: '',
          isDeleted: false
        })
      setStructureNumber(0)
      setAddStructureDialog(false)
    } else {
      _structure[idx].items.push({
        id: getId('storageItem_', 10),
        type: 'text',
        fieldPath: '',
        isDeleted: false
      })
    }
    setStructure(_structure)
  }

  const handleEditItemName = (e, index) => {
    const _structure = cloneDeep(structure)
    const idx = _structure.findIndex(item => item.id === data.id)
    if (idx === -1) return
    _structure[idx].items[index].fieldPath = e.target.value
    setStructure(_structure)
  }
  const handleDelete = (index: number) => {
    const _structure = cloneDeep(structure)
    const idx = _structure.findIndex(item => item.id === data.id)
    if (idx === -1) return
    _structure[idx].items.splice(index, 1)
    setStructure(_structure)
    setConfirmDelete(false)
  }

  const handleSelect = (e, index) => {
    const newData = cloneDeep(structure)
    const idx = newData.findIndex(item => item.id === data.id)
    if (idx === -1) return
    newData[idx].items[index].type = e.target.value
    setStructure(newData)
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const _structure = cloneDeep(structure)
    const idx = _structure.findIndex(item => item.id === data.id)
    if (idx !== -1) {
      const [reorderedItem] = _structure[idx].items.splice(result.source.index, 1);
      _structure[idx].items.splice(result.destination.index, 0, reorderedItem);
    }
    setStructure(_structure)
  };
  return (
    <div className={'relative w-full'} id={data?.id}>
      <div className={`rounded-md bg-white`}>
        <div className={'w-full'}>
          <div className={'w-full p-3 text-center text-xl truncate'}>{data?.name}</div>
          <CloseOutlinedIcon
            className={'absolute -top-2 -right-2 bg-gray-300 text-white rounded-full cursor-pointer'}
            onClick={() => {
              let newData = selectedList?.filter(item => item !== data?.id)
              setSelectedList(newData)
            }}/>
        </div>
        <div className={'pb-4'}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="items">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {data?.items?.map((i: DataStructureItem, index: number) => {
                    if (!i?.id) return null
                    return (
                      <Draggable key={i.id + index} draggableId={i.id} index={index}>
                        {(provided) => (
                          <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}
                               className={`group`}>
                            <div key={index} className={'p-2 bg-[#F5F7FB] mx-4 my-3 rounded-md min-w-[220px]'}>
                              <div className='relative'>
                                <div className={'absolute top-1 right-1'}>
                                  <CloseOutlinedIcon className={'w-5 cursor-pointer'} onClick={() => {
                                    setIndexDelete(index)
                                    setConfirmDelete(true)
                                    setText(i?.fieldPath)
                                  }}/>
                                </div>
                                <div className={'flex'}>
                                  <TextField
                                    className={'w-[150px] my-3'}
                                    size={'small'}
                                    multiline={false}
                                    label={'変数名'}
                                    value={i?.fieldPath}
                                    onChange={(e: any) => handleEditItemName(e, index)}/>

                                  <Dropdown
                                    className={'my-3 ml-4'}
                                    dataSelect={DATA_SELECT_STRUCTURE}
                                    value={i?.type}
                                    onChange={(e) => handleSelect(e, index)}
                                    maxWidth={150}
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
          <div className={'w-full flex justify-center gap-4'}>
            <div
              onClick={() => handleAddStructureItem(false)}
              className={'basis-1/2 border border-dashed rounded-lg cursor-pointer hover:bg-[#eceff2] text-center ml-4 py-4'}
            >
              <img src="/icons/data-structure-add-icon.svg" alt=""/>
            </div>
            <div
              onClick={() => setAddStructureDialog(true)}
              className={'basis-1/2 flex items-center justify-center gap-4 border border-dashed rounded-lg cursor-pointer hover:bg-[#eceff2] text-center mr-4 py-4'}
            >
              <img src="/icons/data-structure-add-multi-icon.svg" alt=""/>
              複数追加
            </div>
          </div>
        </div>
      </div>
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
                      onClick={() => handleAddStructureItem(true)}>
          <div className={'w-full flex flex-col gap-2 px-4 pt-4'}>
            <div className={'text-sm font-medium'}>追加したい数を選んでください。？</div>
            <TextField type={"number"} size={"small"}
                       className={'bg-[#F5F7FB]'}
                       value={convertInputNumber(structureNumber)}
                       onChange={(e) => {
                         if (Number(e.target.value) < 0) return
                         setStructureNumber(Number(e.target.value))
                       }}/>
          </div>
        </DialogCustom>
      }
    </div>
  );
}

export default StructureList;
