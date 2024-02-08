import React, {useMemo, useState} from "react";
import {Button} from "@mui/material";
import AddFolder from "@/app/common/data/svgData/folder-add-icon.svg";
import Folder from "@/app/common/data/svgData/folder-open-icon.svg";
import AddSubFolderDialog from "@/app/components/Home/AddSubFolder/AddSubFolderDialog";
import ButtonGroupCustom from "@/app/components/ButtonCustom";
import FolderUpdatePopup from "@/app/components/DialogCustom/FolderUpdatePopup";
import {useRouter} from 'next/navigation'
import {useAtom} from "jotai";
import {topLeftMenuOpen} from "@/app/store/atom/useTopLeftMenuOpen";

type Props = {
  className?: string
  folders: any[],
  setFolders: (arg) => void
  selectedFolder: any
  setSelectedFolder: (arg) => void
  folderType?: string
  isInChapter?: boolean
  isShowModal: boolean
};

function SideBarRightContent({
                               className,
                               folders,
                               setFolders,
                               selectedFolder,
                               setSelectedFolder,
                               folderType,
                               isInChapter = false,
                               isShowModal = false
                             }: Props) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const router = useRouter()
  const [openTopLeftMenu] = useAtom(topLeftMenuOpen)

  const folder = useMemo(() => {
    if (!folders?.length) return []
    let result = []
    folders.forEach((folder, idx) => {
      if (!folder?.parentId)
        result.push({
          checkActive: selectedFolder?.id === folder?.id,
          onClick: () => {
            setSelectedFolder(folder)
            if (isInChapter) return
            if (folderType === 'content' && window.location.href === `${window.location.origin}/contents/`)
              router.push(`${window.location.origin}/contents`)
            if (folderType === 'struct' && window.location.href === `${window.location.origin}/structures/`)
              router.push(`${window.location.origin}/structures`)
            if (folderType === 'image' && window.location.href === `${window.location.origin}/images/`)
              router.push(`${window.location.origin}/images`)
          },
          onContextMenu: (event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl(event.currentTarget)
            setSelectedFolder(folder)
            event.preventDefault()
          },
          button: <Folder fill={selectedFolder?.id === folder?.id ? "#1976D2" : "gray"} width={24} height={18}/>,
          name: folder?.name,
        })
    })
    return result
  }, [folders, selectedFolder])

  const handleAddNewFolder = () => {
    setOpen(true);
  };

  return (
    isInChapter ? <div className={'mt-2 '}>
        {
          isShowModal ?
           <div className={'ml-[70px]'}>
             <div className="flex overflow-x-scroll w-[100%]">
               {folder?.length > 0 && <ButtonGroupCustom buttonProps={folder} className="rounded-none"/>}
             </div>
           </div>
            :
            <>
              {
                openTopLeftMenu ?
                  <div className="flex h-[40px] 2xl:h-[60px] overflow-x-scroll max-w-[150px] 2xl:max-w-[270px]">
                    {folder?.length > 0 && <ButtonGroupCustom buttonProps={folder} className="rounded-none"/>}
                  </div>
                  :
                  <div className="flex h-[40px] 2xl:h-[60px] overflow-x-scroll max-w-[190px] 2xl:max-w-[270px]">
                    {folder?.length > 0 && <ButtonGroupCustom buttonProps={folder} className="rounded-none"/>}
                  </div>
              }
            </>

        }
        <div className="h-px bg-[#D9D9D9] w-full mx-1.5"></div>
      </div>
      :
      <div
        className={`flex flex-col w-[70px] min-h-screen h-full gap-4 py-3 bg-white items-center overflow-x-hidden overflow-y-auto ${className}`}>
        <div className="flex flex-col gap-4">
          {folder?.length > 0 && <ButtonGroupCustom buttonProps={folder} className="flex-col rounded-none"/>}
        </div>
        <div className="h-px bg-[#D9D9D9] w-full mx-1.5"></div>
        {open && <AddSubFolderDialog open={open} setOpen={setOpen} setAnchorEl={setAnchorEl} setFolders={setFolders}
                                     folderType={folderType}/>}
        <Button className="hover:bg-blue-100" onClick={handleAddNewFolder}>
          <AddFolder/>
        </Button>
        <FolderUpdatePopup anchorEl={anchorEl} setAnchorEl={setAnchorEl} selectedFolder={selectedFolder}
                           setFolders={setFolders} folderType={folderType}/>
      </div>
  );
}

export default SideBarRightContent;
