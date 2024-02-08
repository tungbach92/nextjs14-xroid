import React, {useEffect, useState} from 'react';
import Image from "next/image";
import Button from "@mui/material/Button";
import {Chip, IconButton, TextField, Tooltip} from "@mui/material";
import {Content, ContentState} from "@/app/types/content";
import {initialState} from "@/app/components/Content/data/data";
import {IMAGE_ONLY, IMAGE_WITH_TITLE} from "@/app/common/constants";
import {updateContent} from "@/app/common/commonApis/contentsApi";
import {saveError, saveSuccess} from "@/app/services/content";
import {useCategories} from "@/app/hooks/useCategories";
import {ContentCategory} from "@/app/types/types";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Modal from "@/app/components/custom/Modal";
import SelectCategoryItem from "@/app/components/Content/dialog/SelectCategoryItem";
import {toast} from "react-toastify";
import CloseIcon from '@mui/icons-material/Close';
import {
  DragDropContext,
  Draggable,
  type DraggableProvided,
  type DraggableStateSnapshot,
  Droppable,
  type DroppableProvided
} from "react-beautiful-dnd";

interface InputAndImageContentProps {
  open?: boolean,
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  handleChangeState: (field: string) => (value: any) => void
  state: ContentState
  setState: React.Dispatch<React.SetStateAction<ContentState>>
  content: Content
  contentId?: string
}

const MAX_CATEGORY = 3

function InputAndImageContent({
  setOpen,
  handleChangeState,
  state,
  setState,
  content,
  contentId
}: InputAndImageContentProps) {
  const {categories, loading} = useCategories()
  const [contentCategories, setContentCategories] = useState<ContentCategory[]>([])
  const length = contentCategories?.length || 0
  const [openSelectCategory, setOpenSelectCategory] = useState<boolean>(false)
  const [categoryIds, setCategoryIds] = useState<string[]>([])
  const [fillCategoryIds, setFillCategoryIds] = useState<string[]>([])
  const parentCategories = categories?.filter(category => category?.parentId === null)

  useEffect(() => {
    if (content?.categories) {
      const _categoryIds = content?.categories?.filter(item => categories?.find(category => category.id === item.id)).map(item => item.id)
      setCategoryIds(_categoryIds)
    }
  }, [content?.categories, categories])

  useEffect(() => {
    if (categoryIds.length < 3)
      setFillCategoryIds(categoryIds.concat(Array(3 - categoryIds.length).fill('')))
    else setFillCategoryIds(categoryIds)
  }, [categoryIds.length])

  useEffect(() => {
    const _categoryIds = categoryIds?.filter(id => categories?.find(category => category.id === id)).map((item, index) => {
      return {
        id: item,
        index: categories?.find(category => category.id === item)?.index,
        name: categories?.find(category => category.id === item)?.name
      }
    })
    setContentCategories(_categoryIds)
  }, [categoryIds, categories])

  const handleUpdateContent = (field: string) => async (value: any) => {
    if (state[field] === content?.[field] && field !== "categoriesId") return
    try {
      // handleChangeState("saveLoading")(true);
      const _content = {...content}
      _content[field] = value
      await updateContent(_content)
      saveSuccess()
    } catch (e) {
      console.log(e)
      saveError(field === "categoriesId" ? `: ${e.response.data.message}` : '')
      handleChangeState(field)(content?.[field] || initialState.categoriesId)
    }
  }

  const handleTitleOnBlur = async (e) => {
    contentId !== "create" && await handleUpdateContent("title")(e.target.value)
  }
  const handleDescOnBlur = async (e) => {
    contentId !== "create" && await handleUpdateContent("description")(e.target.value)
  }

  const handleTitleEnter = async (e) => {
    if (e.key === 'Enter' && contentId !== "create") {
      await handleUpdateContent("title")(e.target.value)
      e.preventDefault()
    }
  }

  const  handleDescEnter = async (e) => {
    if (e.key === 'Enter' && contentId !== "create") {
      await handleUpdateContent("description")(e.target.value)
      e.preventDefault()
    }
  }

  const handleSelectCategory = (category: ContentCategory) => {
    if (categoryIds.length === MAX_CATEGORY)
      return toast.error('カテゴリーは3つまでしか登録できません。')
    const _categoryIds = [...categoryIds]
    _categoryIds.push(category.id)
    setCategoryIds(_categoryIds)
  }
  const handleSaveSelectedCategory = async () => {
    handleChangeState('categoriesId')(categoryIds)
    if (contentId !== 'create') {
      const categories = categoryIds.map((id: string, index: number) => {
        return {id, index}
      })
      await handleUpdateContent('categories')(categories)
    }
    setOpenSelectCategory(false)
  }

  const handleRemoveSelectedCategory = (id: string) => {
    const _categoryIds = [...categoryIds]
    const index = _categoryIds.findIndex(item => item === id)
    _categoryIds.splice(index, 1)
    setCategoryIds(_categoryIds)
  }
  const onDragEnd = async (result) => {
    const _categoryIds = [...categoryIds]
    const [reorderedItem] = _categoryIds.splice(result.source.index, 1);
    _categoryIds.splice(result.destination?.index, 0, reorderedItem);
    setCategoryIds(_categoryIds)
    if (_categoryIds.length < 3) {
      setFillCategoryIds(_categoryIds.concat(Array(3 - _categoryIds.length).fill('')))
    } else setFillCategoryIds(_categoryIds)
  }
  return (
    <div className={"flex flex-wrap items-start justify-center sm:justify-start"}>
      <Button
        className={`h-[210px] w-[185px] bg-cover bg-[#E5F1FF] bg-no-repeat bg-center rounded-md overflow-hidden relative normal-case text-black`}
        onClick={() => {
          setOpen(true)
          const _state: ContentState = {
            ...state,
            previewUrl: initialState.previewUrl,
            checkActive: state.imageTitle ? IMAGE_WITH_TITLE : IMAGE_ONLY
          }
          setState(_state)
        }}
      >
        <div className='flex flex-col justify-center items-center rounded-md h-full px-2'>
          {state.imageTitle &&
            <div className='h-10 flex items-center'>{state.imageTitle}</div>
          }
          <img className='object-contain w-full' src={`${state.thumb || '/icons/no-image-frees.png'}`} alt=""/>
        </div>
        <Image
          src="/icons/content/add.svg"
          alt=""
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 hover:opacity-40 p-2 rounded-full bg-gray-800"
          width={60}
          height={60}
        />
      </Button>
      <div className={`m-0 sm:ml-6 flex flex-col w-[230px] flex-1`}>
        <div className={"text-sm mb-2 text-black"}>タイトル</div>
        <TextField variant="outlined" size="small"
                   className={"bg-white mb-4"} value={state.title ?? initialState.title}
                   onChange={e => handleChangeState('title')(e.target.value)}
                   onBlur={handleTitleOnBlur}
                   // onKeyDown={handleTitleOnBlur}
                   fullWidth/>
        <div className={"text-sm mb-2 text-black"}>コースの説明</div>
        <TextField
          multiline
          rows={3}
          fullWidth
          className={"bg-white mb-4"}
          size="small"
          value={state.description ?? initialState.description}
          onChange={e => handleChangeState('description')(e.target.value)}
          onBlur={handleDescOnBlur}
          // onKeyDown={handleDescEnter}
        />
        <div className={"text-sm mb-2 text-black"}>カテゴリー</div>
        <div className={`flex gap-2 relative items-center p-3 bg-white border border-gray-300
        border-solid rounded-sm overflow-x-auto overflow-y-hidden ${length === 0 && 'p-5'}`}>
          <div className={'flex max-w-[90%] pr-5 overflow-x-auto overflow-y-hidden'}>
            {
              contentCategories?.map((item, index: number) => {
                return (
                  <div key={item.id} className={'flex flex-col flex-wrap items-center'}>
                    {index === 0 ? <span>メイン</span> : <span>サブ</span>}
                    <Tooltip title={`${item.name}`}>
                      <Chip label={item.name} size="medium"
                            className={`rounded-md bg-blue-100 mx-1 border border-solid border-[#1976D2] w-[70px] truncate`}/>
                    </Tooltip>
                  </div>
                )
              })
            }
          </div>
          <IconButton className={`${length === 0 ? '-top-5' : ' top-1'} absolute translate-y-1/2  right-0`}
                      onClick={() => {
                        setOpenSelectCategory(true)
                      }}>
            <KeyboardArrowDownIcon color={'primary'}/>
          </IconButton>
        </div>
      </div>
      {
        openSelectCategory &&
        <Modal
          size={'md'}
          onSubmit={handleSaveSelectedCategory}
          actionPosition={'center'}
          open={openSelectCategory}
          btnSubmit={'このカテゴリに登録'}
          setOpen={setOpenSelectCategory}
          title={'カテゴリ一覧'}
          handleClose={() => {
            setOpenSelectCategory(false)
            setCategoryIds(content?.categories?.filter(item => categories?.find(category => category.id === item.id)).map(item => item.id) || [])
          }}>
          <div className={'flex flex-col justify-items-center items-center'}>
            <div className={'border border-solid border-blue-100 rounded items-center flex flex-col'}>
              <div className={'flex gap-20 pr-2'}>
                {
                  fillCategoryIds.map((val, index: number) => {
                    return (
                      <div key={index}>
                        {index === 0 ? <span>メイン</span> : <span>サブ</span>}
                      </div>
                    )
                  })
                }
              </div>
              {
                // categoryIds.length ?
                <DragDropContext onDragEnd={onDragEnd} direction="horizontal">
                  <Droppable droppableId="droppable" direction="horizontal">
                    {(provided: DroppableProvided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}
                           style={{
                             display: 'flex',
                             width: "auto",
                             margin: 'auto'
                           }}>
                        <div className={'flex gap-4 p-2'}>
                          {
                            fillCategoryIds?.map((id: string, index: number) => {
                              const category = contentCategories?.find(item => item.id === id)
                              return (
                                <Draggable key={category?.id} draggableId={category?.id} index={index}>
                                  {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <div key={category?.id}
                                           className={'flex flex-col flex-wrap items-center m-auto'}>
                                        <div className={'relative'}>
                                          {
                                            id === '' ? <div
                                                className={'w-[100px] h-[30px] border border-blue-500 border-dashed rounded'}/>
                                              :
                                              <Tooltip title={`${category?.name}`}>
                                                <Chip
                                                  label={category?.name}
                                                  size="medium"
                                                  onDelete={() => handleRemoveSelectedCategory(id)}
                                                  deleteIcon={<CloseIcon className={'w-4 h-4 absolute right-0'}/>}
                                                  className={'rounded-md border-solid max-w-2xl truncate border w-[100px] bg-blue-100 border-[#1976D2] cursor-grab'}
                                                />
                                              </Tooltip>
                                          }
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              )
                            })
                          }
                        </div>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              }
            </div>

            {
              parentCategories?.map((category: ContentCategory, index: number) => {
                const childCategories = categories?.filter(item => item.parentId === category.id)
                return (
                  <div key={category?.id} className={'m-auto w-[75%]'}>
                    <SelectCategoryItem
                      selectedIds={categoryIds}
                      onSelectedCategory={(item) => handleSelectCategory(item)}
                      childCategories={childCategories}
                      categoryName={category?.name}/>
                  </div>
                )
              })
            }
          </div>
        </Modal>
      }
    </div>
  );
}

export default InputAndImageContent;
