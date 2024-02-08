import React, {Dispatch, SetStateAction, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Content} from '@/app/types/content'
import ConfirmDialog from "@/app/components/DialogCustom/ConfirmDialog";
import {deleteContent} from "@/app/common/commonApis/contentsApi";
import RemoveIcon from "@/app/common/data/svgData/remove-icon.svg"
import Folder from "@/app/common/data/svgData/folder-open-icon.svg"
import ActionIcon from "@/app/common/data/svgData/action1.svg"
import {toast} from "react-toastify";
import TablePagination from "@mui/material/TablePagination";
import ActionSubFolderPopover from "@/app/components/Home/ActionSubFolder";
import {Button} from "@mui/material";
import AddIcon from "@/app/common/data/svgData/add-icon.svg";
import AddSubFolderDialog from "@/app/components/Home/AddSubFolder/AddSubFolderDialog";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import {useSetAtom} from "jotai";
import {foldersAtom} from "@/app/store/atom/folders.atom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

type Props = {
  data: Content[],
  countContent?: number,
  previousPage?: (boolean?) => void,
  nextPage?: () => void,
  page: number,
  setPage: Dispatch<SetStateAction<number>>,
  pageSize: number,
  subFolders?: any[],
  parentId?: string,
  loading?: boolean,
  isSubFolder?: boolean,
}

function LayoutGrid({
                      data,
                      isSubFolder,
                      countContent,
                      previousPage,
                      nextPage,
                      page,
                      setPage,
                      pageSize,
                      subFolders,
                      parentId,
                      loading = false
                    }: Props) {
  const router = useRouter();
  const [isOpenAddSubFolder, setIsOpenAddSubFolder] = useState(false)
  const [open, setOpen] = useState(false)
  const [contentId, setContentId] = useState('');
  const setFolders = useSetAtom(foldersAtom)

  const handleChangePage = async (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    if (page < newPage) {
      await nextPage()
    } else {
      await previousPage(newPage === 0)
    }
    setPage(newPage)
  };

  const handleDelete = async () => {
    try {
      await deleteContent(contentId)
      setOpen(false)
      toast.success("コンテンツを削除しました。", {autoClose: 3000})
    } catch (e) {
      console.log(e)
      toast.error(e)
    }
  }

  return (
    <div className='flex flex-col min-h-[70vh]'>
      <div className='flex flex-col gap-7 mb-6'>
        {
          !isSubFolder && <>
            <Button
              variant='text'
              className='flex items-center gap-3 mb-3 -ml-1.5 text-[#9B9B9B] normal-case w-[120px]'
              onClick={() => setIsOpenAddSubFolder(true)}
            >
              フォルダ
              <span className='w-5 h-5 bg-[#1976D2] rounded-full'><AddIcon/></span>
            </Button>
            {
              isOpenAddSubFolder && <AddSubFolderDialog
                open={isOpenAddSubFolder}
                setOpen={setIsOpenAddSubFolder}
                isSubFolder={true}
                parentId={parentId}
                setFolders={setFolders}/>
            }
            <div className='flex gap-5 overflow-x-auto w-full'>
              {
                subFolders?.length > 0 && subFolders.map(item => {
                  return (
                    <div
                      key={item.id}
                      className='relative rounded-md min-w-[195px] p-6 bg-white group-item'
                    >
                      <div className='absolute top-0 right-0 h-10'>
                        <ActionSubFolderPopover className={"h-[30px] min-w-[40px] rounded-md flex items-center justify-center"} subFolder={item} icon={<ActionIcon/>}/>
                      </div>
                      <div className='flex flex-col items-center cursor-pointer' onClick={() => {
                        router.push(`/contents/subFolder/${item.id}`)
                      }}>
                        <Folder height={90} width={45} fill={'#9B9B9B'}/>
                        <span className='items-center text-black line-clamp-1'>{item.name}</span>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </>
        }
        <>
          <Button
            variant='outlined'
            className='flex items-center gap-3 mb-3 text-white bg-[#1976D2] normal-case w-[120px]'
            onClick={() => router.push(`${!isSubFolder ? '/contents/create' : `/contents/subFolder/${router.query.subFolder}/create/`}`)}
          >
            コース
            <span className='w-5 h-5 bg-[#1976D2] rounded-full'><AddIcon/></span>
          </Button>
          {
            (loading && (data === null || data?.length > 0)) && <LinearProgress className={`mb-3`}/>
          }
          {
            !loading && data?.length > 0 &&
            <div className='grid grid-cols-4 md:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-12 gap-y-8 gap-x-14 h-full overflow-auto'>
              {
                data?.map((item) => {
                    return (
                      <div key={item.id}
                           className='col-span-2 h-52 w-full bg-[#E5F1FF] rounded-md border overflow-hidden flex justify-center cursor-pointer relative'>
                        <img onClick={() => router.push(`/contents/${item.id}`)}
                             className={item?.thumbnail ? 'w-full h-full object-cover' : 'w-full h-full object-contain'}
                             src={item.thumbnail || '/icons/no-image-frees.png'}
                             alt='content-image'
                        />
                        <IconButton
                          className={"w-[34px] h-[34px] bg-white absolute top-1 right-1 group"}
                          onClick={() => {
                            setOpen(true)
                            setContentId(item.id)
                          }}>
                          <DeleteForeverIcon className='text-gray-200 transition-300 cursor-pointer group-hover:text-red-500'/>
                        </IconButton>
                      </div>
                    )
                  }
                )
              }
            </div>
          }
          {!loading && data?.length === 0 &&
            < div
              className='flex items-center w-full bg-white rounded-md justify-center text-black h-12 font-semibold'>コンテンツがございません。</div>
          }
        </>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-1 h-12">
        <TablePagination
          rowsPerPageOptions={([])}
          component="div"
          count={countContent}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={pageSize}
        />
      </div>
      {
        open && <ConfirmDialog
          open={open}
          setOpen={setOpen}
          onClick={handleDelete}
          title='このコンテンツを削除してもよろしいですか？'
        />
      }
    </div>
  );
}

export default LayoutGrid;
