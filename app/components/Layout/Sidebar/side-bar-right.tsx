import React, {useMemo, useState} from "react";
import {Button} from "@mui/material";
import AddFolder from "@/app/common/data/svgData/folder-add-icon.svg";
import Folder from "@/app/common/data/svgData/folder-open-icon.svg";
import AddSubFolderDialog from "@/app/components/Home/AddSubFolder/AddSubFolderDialog";
import ButtonGroupCustom from "@/app/components/ButtonCustom";
import FolderUpdatePopup from "@/app/components/DialogCustom/FolderUpdatePopup";
import {useRouter} from 'next/navigation'

type Props = {
  className?: string
  folders: any[],
  setFolders: (arg) => void
  selectedFolder: any
  setSelectedFolder: (arg) => void
  folderType?: string
  isInChapter?: boolean
  isNotPage?: boolean
};

function SideBarRight({
  className,
  folders,
  setFolders,
  selectedFolder,
  setSelectedFolder,
  folderType,
  isInChapter = false,
  isNotPage
}: Props) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const router = useRouter()

  const folder = useMemo(() => {
    if (!folders?.length) return []
    let result = []
    folders.forEach((folder, idx) => {
      if (!folder?.parentId)
        { // @ts-ignore
          result.push({
                    checkActive: selectedFolder?.id === folder?.id,
                    onClick: () => {
                      setSelectedFolder(folder)
                      if (isInChapter) return;
                      const hrefLink = window.location.href;
                      const originLink = window.location.origin;

                      if (folderType === 'content' && hrefLink !== `${originLink}/contents/` && hrefLink.includes(`${originLink}/contents/`))
                        router.push(`${originLink}/contents`)
                      if (folderType === 'struct' && hrefLink !== `${originLink}/structures/` && hrefLink.includes(`${originLink}/structures/`))
                        router.push(`${originLink}/structures`)
                      if (folderType === 'image' && hrefLink !== `${originLink}/images/` && hrefLink.includes(`${originLink}/images/`))
                        router.push(`${originLink}/images`)
                    },
                    onContextMenu: (event: React.MouseEvent<HTMLButtonElement>) => {
                      setAnchorEl(event.currentTarget)
                      setSelectedFolder(folder)
                      event.preventDefault()
                    },
                    button: <Folder fill={selectedFolder?.id === folder?.id ? "#1976D2" : "gray"} width={24} height={18}/>,
                    name: folder?.name,
                  })
        }
    })
    return result
  }, [folders, selectedFolder])

  const handleAddNewFolder = () => {
    setOpen(true);
  };

  return (
    isInChapter ? <div className={'mt-2'}>
        <div className="flex h-[70px] overflow-x-scroll">
          {/*<Button className="hover:bg-blue-100" onClick={handleAddNewFolder}>*/}
          {/*  <AddFolder/>*/}
          {/*</Button>*/}
          {folder?.length > 0 && <ButtonGroupCustom buttonProps={folder} className="rounded-none"/>}
        </div>
        <div className="h-px bg-[#D9D9D9] w-full mx-1.5"></div>
        {/*{open && <AddSubFolderDialog open={open} setOpen={setOpen} setAnchorEl={setAnchorEl} setFolders={setFolders}*/}
        {/*                             isImage={isImage}/>}*/}
        {/*<FolderUpdatePopup anchorEl={anchorEl} setAnchorEl={setAnchorEl} selectedFolder={selectedFolder}*/}
        {/*                   setFolders={setFolders} isImage={isImage}/>*/}
      </div>
      :
      <div
        className={`flex flex-col w-[70px] min-h-[calc(100vh-64px)] h-full gap-4 py-3 bg-white items-center overflow-x-hidden overflow-y-auto ${className}`}>
        <div className={`${isNotPage ? 'fixed' : 'flex flex-col gap-4'}`}>
          <div className="flex flex-col gap-4">
            {folder?.length > 0 && <ButtonGroupCustom buttonProps={folder} className="flex-col rounded-none"/>}
          </div>
        </div>
        <div className="h-px bg-[#D9D9D9] w-full mx-1.5"></div>
        {open && <AddSubFolderDialog open={open} setOpen={setOpen} setAnchorEl={setAnchorEl} setFolders={setFolders}
                                     folderType={folderType}/>}
        {!isNotPage &&
          <Button className="hover:bg-blue-100" onClick={handleAddNewFolder}>
            <AddFolder/>
          </Button>
        }
        <FolderUpdatePopup anchorEl={anchorEl} setAnchorEl={setAnchorEl} selectedFolder={selectedFolder}
                           setFolders={setFolders} folderType={folderType}/>
      </div>
  );
}

export default SideBarRight;
