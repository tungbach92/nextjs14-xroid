import React, {useEffect, useState} from 'react';
import {Character} from "@/app/types/types";
import {useRouter} from "next/navigation";
import {useCharacters} from "@/app/hooks/useCharacters";
import {Button, CircularProgress} from "@mui/material";
import useGetUserRoidsByUserId from "@/app/hooks/useGetUserRoidsByUserId";
import {useAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {orderBy} from "lodash";
import EditIcon from '@mui/icons-material/Edit';
import IconButton from "@mui/material/IconButton";
import Modal from "@/app/components/custom/Modal";
import {foldersAtom} from "@/app/store/atom/folders.atom";
import useFolders from '@/app/hooks/useFolders';
import {Folder} from "@/app/types/folders";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {useContentsByFolderId} from "@/app/hooks/useContentsByFolderId";
import {Content} from "@/app/types/content";
import Search from "@/app/components/custom/Search";

type props = {}

function Index({}: props) {
  useFolders()
  const [folders,] = useAtom(foldersAtom);
  const [userInfo] = useAtom(userAtomWithStorage);
  const router = useRouter()
  const {createdUroidChapters, loading} = useCharacters()
  const {userRoids, loadingUroid} = useGetUserRoidsByUserId(userInfo?.user_id)
  const [openSelectContentModal, setOpenSelectContentModal] = useState<boolean>(false);
  const [selectedFolder, setSelectedFolder] = useState<Folder>(null)
  const [selectedContent, setSelectedContent] = useState<Content>(null)
  const {contents, loading: loadingContent} = useContentsByFolderId(selectedFolder?.id)
  const [isFolder, setIsFolder] = useState<boolean>(false)
  const [path, setPath] = useState<string>('')
  const [searchFolderData, setSearchFolderData] = useState<Folder[]>(folders)
  const [searchContentData, setSearchContentData] = useState<Content[]>(contents)
  const [loadingPage, setLoadingPage] = useState<boolean>(false)

  useEffect(() => {
    setSearchContentData(contents)
  }, [contents])

  const overrideUserRoids = userRoids?.map((item) => {
      return {
        ...item,
        avatar: createdUroidChapters?.find((i) => i.id === item?.id)?.avatar,
        name: createdUroidChapters?.find((i) => i.id === item?.id)?.name
      }
    }
  )
  const _overrideUserRoids = orderBy(overrideUserRoids, ['updatedAt'], ['asc'])
  const onEdit = (item) => {
    router.push(`/contents/${item.contentId}/${item.chapterId}`)
  }

  const handleSelectFolder = (item) => {
    setSelectedFolder(item)
    setSearchContentData(contents)
  }

  const handleSelectContent = (item) => {
    setSelectedContent(item)
  }
  const onDupleClick = (item) => {
    setIsFolder(true)
    setSearchContentData(contents)
    if (!item?.parentId) {
      setPath(`/contents`)
    } else {
      setPath(`/contents/subFolder/${item?.parentId}/subContent`)
    }
  }
  const onSearch = (item) => {
    if (!item) {
      setSearchFolderData(folders)
      setSearchContentData(contents)
      return
    }
    if (!isFolder) {
      const result = folders?.filter((i) => i.name.toLowerCase().includes(item.toLowerCase()))
      setSearchFolderData(result)
    } else {
      const result = contents?.filter((i) => i.title.toLowerCase().includes(item.toLowerCase()))
      setSearchContentData(result)
    }
  }
  const handleCloseModal = () => {
    setOpenSelectContentModal(false)
    setSelectedFolder(null)
    setIsFolder(false)
    setPath('')
  }
  const onBack = () => {
    setSelectedContent(null)
    setIsFolder(false)
    setPath('')
  }
  const handleSubmit = async () => {
    setLoadingPage(true)
    try {
      await router.push(`${path}/${selectedContent?.id}/createChapter/?isCreateURoid=true`)
    }catch (e) {
      console.log(e);
    }finally {
      setLoadingPage(false)
    }
  }

  return (
    <div className={`flex flex-col ${loadingPage ? 'pointer-events-none opacity-80' : ''}`}>
      {loadingPage && <CircularProgress className={'flex m-auto mt-5'}/>}
      <div className={'px-8 pt-8'}>
        <Button variant="contained" color="primary" onClick={() => setOpenSelectContentModal(true)}>
          + Uroid作成
        </Button>
      </div>
      <div
        className={`${loading || loadingUroid || !(loading || loadingUroid) && _overrideUserRoids?.length === 0 ? '' :
          'grid grid-cols-2 md:grid-cols-5 2xl:grid-cols-6 gap-8'} text-black p-8 group/item`}>
        {
          loading || loadingUroid ?
            <CircularProgress className={'flex m-auto mt-5'}/> :
            !(loading || loadingUroid) && _overrideUserRoids?.length === 0 ?
              <div className={'text-center m-auto font-bold text-xl'}>ロイドがありません</div> :
              <>
                {
                  _overrideUserRoids?.map((i: Character) => {
                    return (
                      <div key={i.id}>
                        <div className={"relative pt-[100%] group/edit"}>
                          <img alt={''}
                               className={'cursor-pointer absolute inset-0 w-full h-full object-cover rounded-lg'}
                               src={i?.avatar}
                               onClick={() => router.push(`/userRoids/${i.id}`)}
                          />
                          <IconButton
                            className={'absolute top-0 right-0 opacity-0 group-hover/edit:opacity-100'}
                            onClick={() => onEdit(i)}
                          >
                            <EditIcon color={'primary'}/>
                          </IconButton>
                        </div>
                        <p className={'mx-auto truncate max-w-fit '}>{i.name}</p>
                      </div>
                    )
                  })
                }
              </>
        }
      </div>
      {
        openSelectContentModal &&
        <Modal open={openSelectContentModal}
               setOpen={setOpenSelectContentModal}
               title={
                 <div className={' w-full'}>
                   <div className={'m-auto text-center'}>コース選択ダイアログ</div>
                   <div className={`flex ${isFolder ? 'justify-between' : 'justify-end'} pt-4`}>
                     {
                       isFolder &&
                       <div className={'flex justify-items-center'}>
                         <IconButton onClick={onBack}>
                           <ArrowBackIosNewIcon fontSize={"small"} color={'primary'} className={'w-6'}/>
                         </IconButton>
                         <span className={'m-auto font-normal'}>コンテンツのリスト</span>
                       </div>
                     }
                     <Search onSearch={(item) => onSearch(item)}/>
                   </div>
                 </div>

               }
               btnSubmit={'選択'}
               actionPosition={'center'}
               handleClose={() => handleCloseModal()}
               onSubmit={() => handleSubmit()}
               isDisabled={!selectedContent}
        >

          <div className={'h-[60vh] overflow-y-auto'}>
            {!isFolder &&
              searchFolderData?.map((item) => {
                return (
                  <div key={item.id}
                       className={`flex mb-1 px-3 py-1 items-center gap-5 cursor-pointer relative ${item.id === selectedFolder?.id ? 'bg-[#DAE7F6] rounded' : ''}`}
                       onClick={() => handleSelectFolder(item)}
                       onDoubleClick={() => onDupleClick(item)}>
                    <img alt={''}
                         src={`${item.id === selectedFolder?.id ? '/icons/folder.svg' : '/icons/unselectedFolder.svg'}`}/>
                    <span className={`${item.id === selectedFolder?.id ? 'text-blue-500' : ''} max-w-[70%] truncate`}>
                          {item?.name}
                        </span>
                    <div className={'absolute top-1 my-1/2 translate-y-1/2 right-3 flex justify-center'}>
                      {
                        item.id === selectedFolder?.id &&
                        <ArrowBackIosNewIcon fontSize={"small"}
                                             onClick={() => onDupleClick(item)}
                                             color={'primary'} className={'rotate-180'}/>
                      }
                    </div>
                  </div>
                )
              })}
            {isFolder &&
              searchContentData?.map((item) => {
                return (
                  <div key={item.id}
                       className={`flex mb-1 px-3 py-1 items-center gap-5 cursor-pointer relative ${item.id === selectedContent?.id ? 'bg-[#DAE7F6] rounded' : ''}`}
                       onClick={() => handleSelectContent(item)}
                  >
                    <img alt={''}
                         className={'w-12 h-12 rounded'}
                         src={`${item?.thumbnail ? item?.thumbnail : '/icons/no-image-frees.png'}`}/>
                    <span className={`${item.id === selectedFolder?.id ? 'text-blue-500' : ''} max-w-[70%] truncate`}>
                          {item?.title}
                        </span>
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

export default Index;
