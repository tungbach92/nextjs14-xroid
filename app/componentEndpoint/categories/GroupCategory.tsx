import React, {useEffect, useState} from 'react';
import {Button, Tooltip} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import {CssTextField} from "@/app/components/custom/CssTextField";
import {Category} from "@/app/types/types";
import {createCategories, deleteCategories, updateIndexCategories} from "@/app/common/commonApis/categoriesApi";
import {toast} from "react-toastify";
import {BaseDeleteModal} from "@/app/components/base";
import {
  DragDropContext,
  Draggable,
  type DraggableProvided,
  type DraggableStateSnapshot,
  Droppable,
  type DroppableProvided
} from "react-beautiful-dnd";
import CloseIcon from "@mui/icons-material/Close";
import {trim} from "lodash";

type Props = {
  childCategories: Category[],
  parentCategory: Category,
}

function GroupCategory({childCategories, parentCategory}: Props) {
  const [childCategoryName, setChildCategoryName] = useState<string>('')
  const [children, setChildren] = useState<Category[]>([])
  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false)
  const [deleteItem, setDeleteItem] = useState<Category>({})


  useEffect(() => {
    setChildren(childCategories)
  }, [childCategories])
  const handleChangeCategoryName = (e) => {
    setChildCategoryName(e.target.value)
  }
  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const _children = [...children]
    const [reorderedItem] = _children.splice(result.source.index, 1);
    _children.splice(result.destination.index, 0, reorderedItem);
    setChildren(_children)
    try {
      await updateIndexCategories({id: _children[result.destination.index]?.id, index: result.destination.index})
      toast.success('カテゴリーを更新しました。')
    } catch (e) {
      console.log(e)
      setChildren(children)
      toast.error('カテゴリーを更新できませんでした。')
    }
  }
  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategories(id)
      toast.success('カテゴリーを削除しました。')
    } catch (e) {
      toast.error('カテゴリーが削除できていません。')
      console.log(e)
    } finally {
      setOpenConfirmDelete(false)
      setDeleteItem({})
    }
  }

  const handleOpenConfirmDelete = (category: Category) => {
    setDeleteItem(category)
    setOpenConfirmDelete(true)
  }

  const handleCreateChildCategory = async () => {
    const childCategoriesName = childCategories?.map(category => category?.name)
    const parentCategoryName = parentCategory?.name
    if (childCategoriesName?.concat(parentCategoryName).includes(trim(childCategoryName))) {
      toast.error('カテゴリー名が重複しています。')
      return
    }
    try {
      await createCategories({
        name: childCategoryName,
        parentId: parentCategory?.id
      })
      toast.success('カテゴリーが作成できました。')
    } catch (e) {
      toast.error('カテゴリーが作成できていません。')
      console.log(e)
    } finally {
      setChildCategoryName('')
    }
  }


  return (
    <div className='p-7'>
      <Tooltip title={`${parentCategory?.name}`}>
        <span className={'font-bold text-[24px] text-black mb-6 block truncate w-fit max-w-[700px]'}>
          {parentCategory?.name}
        </span>
      </Tooltip>
      <div className='bg-white rounded-md p-5 max-w-[700px]'>
        <div className='flex flex-col gap-3 justify-between md:flex-row'>
          <CssTextField
            size='small'
            className='w-full md:w-[85%]'
            value={childCategoryName}
            onChange={(e) => handleChangeCategoryName(e)}
            onKeyDown={e => (e.key === "Enter" && (e.metaKey || e.altKey)) && handleCreateChildCategory()}
          />
          <Button
            className='md:w-[120px]'
            disabled={!childCategoryName.trim()}
            variant='contained'
            onClick={() => handleCreateChildCategory()}>追加</Button>
          <div className={'cursor-pointer -mt-4 -mr-4'} onClick={() => handleOpenConfirmDelete(parentCategory)}>
            <CloseIcon/>
          </div>
        </div>
        <div className='mt-6 flex flex-wrap gap-4'>
          {
            <DragDropContext onDragEnd={onDragEnd} direction="horizontal">
              <Droppable droppableId="droppable" direction="horizontal">
                {(provided: DroppableProvided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}
                       style={{
                         display: 'flex',
                         flexDirection: 'row',
                         alignItems: 'flex-start',
                         gap: '10px',
                         flexWrap: 'wrap'
                       }}
                  >
                    {
                      children?.map((category: Category, index: number) => {
                        return (
                          <Draggable key={category?.id} draggableId={category?.id} index={index} direction="horizontal">
                            {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <Tooltip title={category?.name}>
                                  <div key={category?.id}
                                       className='bg-gray-300 rounded-md flex items-center max-w-fit px-4 gap-4 py-2'>
                                  <span
                                    className='text-black w-[85px] text-[13px] md:text-[16px] truncate'>{category?.name}</span>
                                    <ClearIcon className='cursor-pointer'
                                               onClick={() => handleOpenConfirmDelete(category)}/>
                                  </div>
                                </Tooltip>
                              </div>
                            )}
                          </Draggable>
                        )
                      })
                    }
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          }
        </div>
      </div>
      {
        openConfirmDelete &&
        <BaseDeleteModal
          isOpen={openConfirmDelete}
          label={`${deleteItem.name}のカテゴリを削除しますか？`}
          handleClose={() => setOpenConfirmDelete(false)}
          handleDelete={() => handleDeleteCategory(deleteItem?.id)}
        />
      }
    </div>
  );
}

export default GroupCategory;
