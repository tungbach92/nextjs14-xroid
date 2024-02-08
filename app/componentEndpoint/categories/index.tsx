import React, {useEffect, useState} from 'react';
import {Button, CircularProgress} from "@mui/material";
import {createParentCategories, updateIndexCategories} from "@/app/common/commonApis/categoriesApi";
import {toast} from "react-toastify";
import {useCategories} from "@/app/hooks/useCategories";
import AddIcon from "@mui/icons-material/Add";
import Modal from "@/app/components/custom/Modal";
import {CssTextField} from "@/app/components/custom/CssTextField";
import {Category} from "@/app/types/types";
import {
    DragDropContext,
    Draggable,
    type DraggableProvided,
    type DraggableStateSnapshot,
    Droppable,
    type DroppableProvided
} from "react-beautiful-dnd";
import GroupCategory from "@/app/componentEndpoint/categories/GroupCategory";


type Props = {}

function Categories({}: Props) {
  const {categories, loading} = useCategories();
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [categoryParentName, setCategoryParentName] = useState<string>('')
  const [parentCategories, setParentCategories] = useState<Category[]>([])

  useEffect(() => {
    setParentCategories(categories?.filter(category => category?.parentId === null))
  }, [categories])

  const handleClickCreateButton = () => {
    setOpenCreateModal(true)
  }


  const handleSubmitCreateParentCategory = async () => {
    if (categoryParentName === '') {
      toast.error('カテゴリー名を入力してください。')
      return
    }
    try {
      await createParentCategories({name: categoryParentName})
      toast.success('カテゴリーが作成できました。')
      setCategoryParentName('')
    } catch (e) {
      toast.error('カテゴリーが作成できていません。')
      console.log(e)
    } finally {
      setOpenCreateModal(false)
    }
  }
  const onDragEnd = async (result) => {
    if (!result) return;
    if (result?.destination?.index === result?.source?.index) return
    const _parentCategories = [...parentCategories]
    const [reorderedItem] = _parentCategories.splice(result?.source?.index, 1);
    _parentCategories.splice(result?.destination?.index, 0, reorderedItem);
    setParentCategories(_parentCategories)
    try {
      await updateIndexCategories({id: parentCategories[result?.source?.index]?.id, index: result?.destination?.index})
      toast.success('カテゴリーを更新しました。')
    } catch (e) {
      console.log(e);
      toast.error('カテゴリーを更新できませんでした。')
      setParentCategories(parentCategories)
    }
  }

  return (
    <div className='p-7'>
      <div className={'pb-5'}>
        <Button startIcon={<AddIcon/>} variant={'contained'}
                onClick={() => handleClickCreateButton()}
        >カテゴリの作成</Button>
      </div>

      {
        loading ? <CircularProgress className={'m-auto flex items-center'}/> :
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided: DroppableProvided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}
                     className={'max-w-[700px]'}
                >
                  {!parentCategories?.length && <div
                      className={`flex items-center w-full bg-white rounded-md justify-center text-black h-12 font-semibold mb-4`}>カテゴリーがございません。</div>}
                    {
                        parentCategories?.map((category: Category, index: number) => {
                            const childCategories = categories?.filter(item => item.parentId === category.id)
                            return (
                                <Draggable key={category?.id} draggableId={category?.id} index={index}>
                                    {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                            >
                              <GroupCategory
                                key={category?.id}
                                parentCategory={category}
                                childCategories={childCategories}
                              />
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

      {
        openCreateModal &&
        <Modal open={openCreateModal}
               setOpen={setOpenCreateModal}
               title={'カテゴリー作成'}
               handleClose={() => setOpenCreateModal(false)}
               onSubmit={() => handleSubmitCreateParentCategory()}
        >
          <div className={'pl-8 text-lg'}>
            カテゴリー名
          </div>
          <div className={'flex items-center'}>
            <CssTextField
              placeholder='カテゴリー名を入力してください。'
              className='w-[90%] m-auto'
              variant="outlined"
              size="small"
              value={categoryParentName}
              onChange={e => setCategoryParentName(e.target.value)}
            />
          </div>
        </Modal>
      }
    </div>
  );
}

export default Categories;
