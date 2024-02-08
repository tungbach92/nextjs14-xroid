import React, {useState} from 'react';
import Image from "next/image";
import {Popover} from "@mui/material";
import {BaseDeleteModal} from "@/app/components/base";
import AddSubFolderDialog from "@/app/components/Home/AddSubFolder/AddSubFolderDialog";
import {deleteFolder, getListFolder} from "@/app/common/folders";
import {toast} from "react-toastify";

type Props = {
  anchorEl: HTMLButtonElement | null
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement>>
  selectedFolder: any
  isSubFolder?: boolean
  parentId?: string
  folderType?: string
  setFolders: (arg) => void
}

function FolderUpdatePopup({
                             anchorEl,
                             setAnchorEl,
                             selectedFolder,
                             isSubFolder = false,
                             parentId = "",
                             folderType,
                             setFolders
                           }: Props) {
  const [open, setOpen] = useState<boolean>(false)
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
  const openPopover = Boolean(anchorEl);
  const id = openPopover ? 'simple-popover' : undefined;

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onDeleteFolder = async () => {
    try {
      if (!selectedFolder?.id) return
      const res = await deleteFolder(selectedFolder?.id)
      if (res?.status === 200) {
        const listFolder = await getListFolder(folderType)
        setFolders(listFolder)
      }
      setOpenDeleteModal(false)
      setAnchorEl(null)
      toast.success('フォルダーを削除しました。')
    } catch (e) {
      console.log(e);
      toast.error('フォルダーが削除できませんでした。')
    }
  }

  return (
    <div>
      {
        openPopover && <Popover
          id={id}
          open={openPopover}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <div className={'p-3 rounded-xl'}>
            <div className="flex gap-2 items-center cursor-pointer hover:opacity-70 mb-3"
                 onClick={() => setOpen(true)}
            >
              <Image src="/icons/content/edit.svg" alt="" width={30} height={25}/>
              <span className={'text-black'}>名前を変更</span>
            </div>
            <div className={'h-px bg-gray-300'}/>
            <div className="flex gap-2 items-center cursor-pointer hover:opacity-70 mt-3"
                 onClick={() => setOpenDeleteModal(true)}
            >
              <Image src="/icons/content/remove-gray.svg" alt="" width={30} height={25}/>
              <span className={'text-black'}>消去</span>
            </div>
          </div>
        </Popover>
      }
      {open && <AddSubFolderDialog open={open} setOpen={setOpen}
                                   isSubFolder={isSubFolder}
                                   setAnchorEl={setAnchorEl}
                                   selectedFolder={selectedFolder}
                                   parentId={parentId} setFolders={setFolders} folderType={folderType}/>}
      <BaseDeleteModal
        label={"このフォルダを削除してもよろしいですか？"}
        isOpen={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        handleDelete={onDeleteFolder}
      />
    </div>
  );
}

export default FolderUpdatePopup;
