import React, {useEffect, useRef, useState} from 'react';
import {IconButton, Popover, TextField} from "@mui/material";
import {BaseDeleteModal} from "@/app/components/base";
import Modal from "@/app/components/custom/Modal";
import {Content} from "@/app/types/content";
import {Chapter, LinkAndSlideChapter, VimeoChapter, YoutubeChapter} from "@/app/types/types";
import Search from "@/app/components/custom/Search";
import {useAtom} from "jotai";
import {selectedFolderAtom} from "@/app/store/atom/selectedFolder.atom";
import {foldersAtom} from "@/app/store/atom/folders.atom";
import {Folder} from "@/app/types/folders";
import {useContentsByFolderId} from "@/app/hooks/useContentsByFolderId";
import {toNumber} from "lodash";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import {convertInputNumber} from "@/app/common/convertNumber";
import {useRouter} from "next/navigation";
import {useFolder} from "@/app/hooks/useFolders";

type ListFoldersProps = {
  id: string,
  index: number,
  name: string
}

type Props = {
  handleClose: () => void,
  handleCopyChapter?: () => void,
  onUpdateChapter?: (event: React.MouseEvent<HTMLImageElement, MouseEvent>, chapterId?: string, folderId?: string, chapter? : any) => void,
  chapter: Chapter,
  folderId: string,
  handleDelete?: () => void,
  content?: Content,
  onDeleteChapter?: () => void,
  anchorEl: HTMLButtonElement | null
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>
  isChapter?: boolean,
  onUpdateBanner?: () => void
  setChapterIndex?: React.Dispatch<React.SetStateAction<number>>
  loading?: boolean
  handleMoverChapter?: (selectedContent: Content) => void
  chapterIndex?: number,
  onChangeChapterIndex?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

function MoveChapterDialog({
                             handleClose,
                             handleCopyChapter,
                             onUpdateChapter,
                             chapter,
                             folderId,
                             handleDelete,
                             content,
                             onDeleteChapter,
                             isChapter = true,
                             anchorEl,
                             chapterIndex,
                             setAnchorEl,
                             onUpdateBanner,
                             setChapterIndex,
                             loading = false,
                             handleMoverChapter,
                             onChangeChapterIndex,
                           }: Props) {
  const inputRef = useRef(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const [isDelete, setIsDelete] = useState<boolean>(false)
  const [openSelectContent, setOpenSelectContent] = useState<boolean>(false)
  const [moveToFolder, setMoveToFolder] = useState<Folder>(null)
  const [searchFoldersData, setSearchFoldersData] = useState<Folder[]>([])
  const [selectedFolder,] = useAtom(selectedFolderAtom);
  const [error, setError] = useState<boolean>(false)
  const [folders,] = useAtom(foldersAtom);
  const [listFolders, setListFolders] = useState<ListFoldersProps[]>([]);
  const [openFolder, setOpenFolder] = useState<number>(0);
  const {contents, loading: isContentLoading} = useContentsByFolderId(listFolders[openFolder - 1]?.id);
  const [selectedContent, setSelectedContent] = useState<Content>(null)
  const [searchContents, setSearchContents] = useState<Content[]>([]);
  const onCloseModal = () => {
    setOpenFolder(0)
    setOpenSelectContent(false)
    setSelectedContent(null)
    setMoveToFolder(null)
    setListFolders([]);
    setChapterIndex(null)
    setAnchorEl(null)
  }
  useEffect(() => {
    setSearchContents(contents)
  }, [contents]);

  const handleSelectedFolder = (numberNext?: number, folder?: Folder) => {
    if (folder) {
      listFolders.push({
        id: folder.id,
        name: folder.name,
        index: numberNext
      });
      setListFolders(listFolders);
    } else {
      let newArr = listFolders.filter(it => it.index !== numberNext + 1)
      setListFolders(newArr);
    }
    if (numberNext === 0) {
      const foldersData = folders?.filter(f => !f?.parentId);
      setSearchFoldersData(foldersData)
    } else if (numberNext === 1) {
      const foldersData = folders?.filter(f => f?.parentId && (f.parentId === moveToFolder?.id || f.parentId === listFolders[0]?.id));
      setSearchFoldersData(foldersData)
      setSearchContents(contents)
    } else {
      setSearchContents(contents)
    }
  }

  const onSearch = (item?: string) => {
    if (openFolder === 0) {
      const foldersData = folders?.filter(f => !f?.parentId);
      const data = foldersData?.filter((f) => f?.name.toLowerCase().includes(item?.toLowerCase()))
      if (!item) setSearchFoldersData(foldersData)
      else setSearchFoldersData(data)
    } else if (openFolder === 1) {
      const foldersData = folders?.filter(f => f?.parentId && f.parentId === selectedFolder.id);
      const data = foldersData?.filter((f) => f?.name.toLowerCase().includes(item?.toLowerCase()))
      if (!item) setSearchFoldersData(foldersData)
      else setSearchFoldersData(data)

      const contentsData = contents?.filter((f) => f?.title.toLowerCase().includes(item?.toLowerCase()))
      if (!item) setSearchContents(contents)
      else setSearchContents(contentsData)
    } else {
      const contentsData = contents?.filter((f) => f?.title.toLowerCase().includes(item?.toLowerCase()))
      if (!item) setSearchContents(contents)
      else setSearchContents(contentsData)
    }
  }
  const renderDeleteChapter = () => {
    return (
      <div className={'flex flex-col -mt-7 w-[600px]'}>
        <span className={'pb-3'}>
          {`${isChapter ? 'このチャプター' : 'のこバナー'}を削除してもよろしいですか？`}
        </span>
        <div className={'bg-[#F5F7FB] rounded'}>
          {
            isChapter ?
              <div className={'flex text-center gap-4'}>
                <img src={chapter?.thumbnail ? chapter?.thumbnail : '/icons/no-image-frees.png'} alt={'thumb'}
                     className={'w-[50px] h-[70px] rounded'}/>
                <span className={'my-auto max-w-3/4 text-wrap'}>{chapter.title}</span>
              </div> :
              <div>
                <img src={chapter?.thumbnail} alt={'thumb'} className={'w-full h-[50px] object-cover'}/>
              </div>
          }
        </div>
      </div>
    )
  }
  return (
    <div>
      <div className={"text-right flex flex-col text-black text-xs items-end mt-0 mr-2"}>
        <div className={'flex flex-col max-w-fit cursor-pointer'}>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <div className={'w-[137px] h-[34px] flex  rounded bg-white items-center'}>
              <img
                className='w-[20px] ml-2 cursor-pointer'
                src={'/icons/moveChapter.svg'}
                alt={'move'}
                onClick={() => {
                  setError(false)
                  setOpenSelectContent(true)
                }}
              />
              <div className={'border border-solid border-gray-300 border-r border-l-0 border-y-0 h-4/5 mx-1'}/>
              <img className={'w-[20px] ml-2 cursor-pointer'}
                   src={'/icons/copy.svg'}
                   alt={'copy'}
                   onClick={handleCopyChapter}/>
              <div className={'border border-solid border-gray-300 border-r border-l-0 border-y-0 h-4/5 mx-1'}/>
              <img
                className='w-[20px] ml-2 cursor-pointer'
                src={'/icons/edit.svg'} alt={'edit'}
                onClick={(event) => {
                  `${isChapter ? onUpdateChapter(event, chapter?.id, folderId, chapter) : onUpdateBanner()}`
                }}
              />
              <div className={'border border-solid border-gray-300 border-r border-l-0 border-y-0 h-4/5 mx-1'}/>
              <img
                className='w-[20px] cursor-pointer'
                src='/icons/trash-icon.svg' alt='trash-icon'
                onClick={() => setIsDelete(true)}
              />
            </div>
          </Popover>
          <BaseDeleteModal
            label={renderDeleteChapter()}
            isOpen={isDelete}
            handleClose={() => setIsDelete(false)}
            handleDelete={handleDelete ? handleDelete : onDeleteChapter}
          />
          <Modal open={openSelectContent}
                 titlePosition={'center'}
                 setOpen={setOpenSelectContent}
                 isDisabled={loading}
                 title={
                   <ModelTitle chapter={chapter}
                               selectedFolder={selectedFolder}
                               content={content}
                               moveToFolder={moveToFolder}
                               onSearch={(item) => onSearch(item)}
                               onChangeChapterIndex={(e) => {
                                 setChapterIndex(toNumber(e.target.value))
                                 if (toNumber(e.target.value) >= 1) setError(false)
                                 onChangeChapterIndex(e)
                               }}
                               selectedContent={selectedContent}
                               listFolders={listFolders}
                               inputRef={inputRef}
                               onBack={() => {
                                 setOpenFolder(openFolder - 1)
                                 handleSelectedFolder(openFolder - 1)
                                 setSelectedContent(null)
                                 setMoveToFolder(null)
                                 setError(false)
                               }}
                               error={error}
                               chapterIndex={chapterIndex}
                               disable={Boolean(openFolder)}
                   />
                 }
                 handleClose={() => onCloseModal()}
                 btnSubmit={`${openFolder ? '移動' : '続く'}`}
                 onSubmit={() => {
                   if (moveToFolder && !openFolder && !selectedContent) {
                     setOpenFolder(1)
                     return
                   }
                   if (!chapterIndex) {
                     setError(true)
                   } else {
                     setError(false)
                   }
                   handleMoverChapter(selectedContent)
                 }}
                 actionPosition={'center'}
          >
            <div className={'rounded-md h-[60vh] bg-[#F5F7FB] mx-auto overflow-y-auto'}>
              {
                searchFoldersData && openFolder <= 1 &&
                searchFoldersData?.map((item) => {
                    return (
                      <div key={item.id}
                           className={`flex mb-1 px-3 py-1 items-center gap-5 cursor-pointer relative ${item.id === moveToFolder?.id ? 'bg-[#DAE7F6] rounded' : ''}`}
                           onClick={() => {
                             setMoveToFolder(item)
                             setSelectedContent(null);
                           }}
                           onDoubleClick={() => {
                             setOpenFolder(openFolder + 1)
                             setMoveToFolder(null);
                             handleSelectedFolder(openFolder + 1, item)
                           }}
                      >
                        <img
                          src={`${item.id === moveToFolder?.id ? '/icons/folder.svg' : '/icons/unselectedFolder.svg'}`}
                          alt='content-image'
                        />
                        <span className={`${item.id === moveToFolder?.id ? 'text-blue-500' : ''} max-w-[70%] truncate`}>
                          {item?.name}
                        </span>
                        <div className={'absolute top-1 my-1/2 translate-y-1/2 right-3 flex justify-center'}>
                          {
                            item.id === moveToFolder?.id &&
                            <ArrowBackIosNewIcon fontSize={"small"}
                                                 onClick={() => {
                                                   setOpenFolder(openFolder + 1)
                                                   setMoveToFolder(null);
                                                   handleSelectedFolder(openFolder + 1, item)
                                                 }}
                                                 color={'primary'} className={'rotate-180'}/>
                          }
                        </div>

                      </div>
                    )
                  }
                )}
              {
                searchContents && openFolder >= 1 &&
                searchContents?.map((item) => {
                    return (
                      <div key={item.id}
                           className={`flex mb-1 px-3 py-1 items-center gap-5 cursor-pointer ${item.id === selectedContent?.id ? 'bg-[#DAE7F6] rounded' : ''}`}
                           onClick={(e) => {
                             setSelectedContent(item)
                             setMoveToFolder(null);
                             inputRef?.current?.focus()
                           }}>
                        <img className={'w-[50px] h-[70px] object-cover rounded-md mt-2'}
                             src={item.thumbnail || '/icons/no-image-frees.png'}
                             alt='content-image'
                        />
                        <span className={`${item.id === selectedContent?.id ? 'text-blue-500' : ''}`}>
                          {item.title}
                        </span>
                      </div>
                    )
                  }
                )}
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default MoveChapterDialog

type ModelTitleProps = {
  chapter: Chapter,
  selectedFolder: Folder,
  content: Content,
  moveToFolder: Folder,
  onSearch: (item) => void,
  chapterIndex?: number
  onChangeChapterIndex?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  error?: boolean
  disable?: boolean
  onBack?: () => void,
  listFolders?: ListFoldersProps[]
  selectedContent?: Content,
  inputRef?: any
}

export function ModelTitle({
                             chapter,
                             selectedFolder,
                             content,
                             moveToFolder,
                             onSearch,
                             error = false,
                             chapterIndex,
                             onChangeChapterIndex,
                             disable = false,
                             listFolders = [],
                             selectedContent,
                             inputRef,
                             onBack = () => {
                             }
                           }: ModelTitleProps) {
  const {query: {subFolder}} = useRouter();
  const {folder} = useFolder(subFolder as string);
  return (
    <div className={'flex flex-col w-full'}>
      <div className={'text-xl truncate max-w-fit'}>
        <span className={'font-normal'}> {`${chapter?.isBanner ? ' 移動のバナー :' : ' 移動のチャプター :'}`} </span>
        <span className={''}>{chapter?.title || chapter?.bannerTitle}</span>
      </div>
      <div className={'text-base my-1 truncate flex'}>
        <div className={'font-normal pr-2'}>現在の位置 :</div>
        <div className={'truncate max-w-[200px] pr-2'}>{selectedFolder.name}</div>
        {folder && (
          <div className={'truncate max-w-[200px] pr-2'}>{' / ' + folder?.name}</div>
        )}
        <div className={'truncate max-w-[200px]'}>{' / ' + content?.title}</div>
      </div>
      <div className={'text-base flex mt-1 truncate'}>
        <div className={'font-normal max-w-fit'}>
          {`${!disable ? 'フォルダーに移動 : ' : 'コンテンツーに移動 : '} `}
        </div>
        <div className={'max-w-[250px] pl-2 truncate'}>
          {listFolders.map(it => (
            <>
              <span key={it.id} className={''}> {it?.name} </span>
              <span className={'font-normal'}>/</span>
            </>
          ))}
          {
            moveToFolder?.name ?
              <span className={''}> {moveToFolder?.name} </span> : ''
          }
          {
            selectedContent?.title ?
              <span className={'font-normal'}> {selectedContent?.title} </span> : ''
          }
        </div>
      </div>
      <div className={'flex mb-2 text-base justify-between'}>
        <span
          className={`font-normal my-auto ${disable ? '' : 'text-gray-400'}`}>{`${chapter?.isBanner ? 'バナーの希望位置 :' : ' チャプターの希望位置  :'}`} </span>
        <TextField type={'number'}
                   disabled={!disable}
                   error={error}
                   inputProps={{min: 1}}
                   placeholder={'希望位置'}
                   id={'numberIndex'}
                   inputRef={inputRef}
                   value={convertInputNumber(chapterIndex)}
                   variant={'outlined'}
                   size={'small'} className={'ml-2 w-[40%]'}
                   onChange={(event) => {
                     onChangeChapterIndex(event)
                   }}
        />
      </div>
      <div className={'flex -mb-2 justify-between'}>
        <div className={'text-sm -mb-1 font-normal my-auto flex'}>
          {disable && <IconButton onClick={onBack}>
            <ArrowBackIosNewIcon fontSize={"small"} color={'primary'}/>
          </IconButton>}
          <div className={'m-auto'}>
            {!disable ? 'フォルダーのリスト' : 'コンテンツのリスト'}
          </div>
        </div>
        <Search onSearch={(item) => onSearch(item)}/>
      </div>
    </div>
  )
}
