import React, {Dispatch, SetStateAction, useState} from 'react';
import Chapter from "@/app/components/Chapter";
import {Content} from "@/app/types/content";
import TablePagination from "@mui/material/TablePagination";
import ActionIcon from "@/app/common/data/svgData/action-icon.svg";
import AddIcon from "@/app/common/data/svgData/add-icon.svg"
import FolderIcon from "@/app/common/data/svgData/folder-open-icon.svg"
import dayjs from "dayjs";
import ActionSubFolderPopover from "@/app/components/Home/ActionSubFolder";
import {useRouter} from "next/navigation";
import {Button} from "@mui/material";
import AddSubFolderDialog from "@/app/components/Home/AddSubFolder/AddSubFolderDialog";
import LinearProgress from "@mui/material/LinearProgress";
import {useSetAtom} from "jotai";
import {foldersAtom} from "@/app/store/atom/folders.atom";

type Props = {
  data: Content[],
  countContent?: number,
  page: number,
  setPage: Dispatch<SetStateAction<number>>,
  previousPage?: (boolean?) => void,
  nextPage?: () => void,
  pageSize: number,
  subFolders?: any[],
  parentId?: string,
  loading?: boolean,
  isSubFolder?: boolean,
}

function LayoutList({
                      isSubFolder,
                      data,
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
  const [open, setOpen] = useState(false);
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

  return (
    <div className='flex flex-col h-full'>
      {
        !isSubFolder && <div>
          <Button
            variant='text'
            className='flex items-center gap-3 mb-3 -ml-1.5 text-[#9B9B9B] normal-case'
            onClick={() => setOpen(true)}
          >フォルダ<span className='w-5 h-5 bg-[#1976D2] rounded-full'><AddIcon/></span>
          </Button>
          {
              open && <AddSubFolderDialog open={open} setOpen={setOpen} isSubFolder={true} parentId={parentId}
                                          setFolders={setFolders}/>
          }
              {
                  subFolders?.length > 0 ? <div className='flex flex-col gap-4'>
                          <div className="overflow-y-auto h-[160px] w-full">
                              <table className="w-full">
                                  <thead>
                                  <tr>
                                      <th className='text-start'>名前</th>
                                      <th className='text-center'>作成日</th>
                                      <th className='text-end'>編集</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                  {
                                      subFolders?.length > 0 && subFolders.map((item) => {
                                          return (
                                              <tr key={item.id}>
                                                  <th>
                                                      <Button
                                                          onClick={() => router.push(`/contents/subFolder/${item.id}`)}
                                                          className='flex items-center justify-start gap-3 text-black'>
                                                          <FolderIcon fill='gray' width={20} height={20}/>
                                                          {item.name}
                                                      </Button>
                                                  </th>
                                                  <td className='text-center'>{dayjs(item.updatedAt).format('DD/MM/YYYY')}</td>
                                                  <td className='text-end'>
                                                      <ActionSubFolderPopover subFolder={item}
                                                                              icon={<ActionIcon className='cursor-pointer'/>}/>
                                                  </td>
                                              </tr>
                                          )
                                      })
                                  }
                                  </tbody>
                              </table>
                          </div>
                      </div> :
                      <div
                          className={`flex items-center w-full bg-white rounded-md justify-center text-black h-12 font-semibold mb-4`}>フォルダがございません。</div>
              }
          </div>
      }
      <div>
        <Button
          variant='outlined'
          className='flex items-center gap-3 mb-3 text-white bg-[#1976D2] normal-case'
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
          <>
            <div className='flex flex-col gap-3'>
              <div
                className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3'>
                <Chapter
                  className='col-span-1 gap-3'
                  contentData={data}
                  isSubFolder={isSubFolder}
                />
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <TablePagination
                rowsPerPageOptions={[]}
                component="div"
                count={countContent}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={pageSize}
              />
            </div>
          </>
        }
        {!loading && data?.length === 0 &&
            < div
                className='flex items-center w-full bg-white rounded-md justify-center text-black h-12 font-semibold'>コンテンツがございません。</div>
        }
      </div>
    </div>
  )
}

export default LayoutList;
