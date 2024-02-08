import * as React from 'react';
import {ReactNode} from 'react';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import Image from "next/image";
import {toast} from "react-toastify";
import {deleteFolder} from "@/app/common/commonApis/folderApi";
import {getListFolder} from "@/app/common/folders";
import {useAtom} from "jotai";
import {foldersAtom, imageFoldersAtom} from "@/app/store/atom/folders.atom";
import AddSubFolderDialog from "@/app/components/Home/AddSubFolder/AddSubFolderDialog";
import {BaseDeleteModal} from "@/app/components/base";
import {Folder} from "@/app/types/folders";

type Props = {
  icon: ReactNode,
  subFolder: Folder,
  className?: string,
  folderType?: string
}

export default function ActionSubFolderPopover({icon, subFolder, className = '', folderType = 'content'}: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [isEdit, setIsEdit] = React.useState(false);
  const [isDelete, setIsDelete] = React.useState(false);
  const [, setFolders] = useAtom(foldersAtom)
  const [, setImageFolders] = useAtom(imageFoldersAtom)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDelete = async () => {
    try {
      await deleteFolder(subFolder.id)
      const listFolder = await getListFolder(folderType || 'content');
      if(folderType === 'image') {
        setImageFolders(listFolder)
      } else {
        setFolders(listFolder)
      }
      setIsDelete(false)
      toast.success("フォルダーを削除しました。", {autoClose: 3000})
      setAnchorEl(null)
    } catch (e) {
      console.log(e)
      toast.error(e)
    }
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Button aria-describedby={id} variant="text" onClick={handleClick} className={className}>
        {icon}
      </Button>
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
        <div className='flex flex-col p-4'>
          <Button
            className='flex items-center gap-3 cursor-pointer'
            onClick={() => setIsEdit(true)}
          >
            <Image src='/icons/edit-icon.svg' alt='edit-icon' width={20} height={20}/>
            <span className={'text-black'}>名前を変更</span>
          </Button>
          <Button
            className='flex justify-start items-center gap-3 cursor-pointer'
            onClick={() => setIsDelete(true)}
          >
            <Image src='/icons/trash-icon.svg' alt='edit-icon' width={24} height={24}/>
            <span className={'text-black'}>消去</span>
          </Button>
        </div>
      </Popover>
      {
        isEdit && <AddSubFolderDialog isSubFolder={true} subFolder={subFolder} open={isEdit} setOpen={setIsEdit}
                                      setAnchorEl={setAnchorEl} setFolders={folderType === 'image' ? setImageFolders : setFolders} folderType={folderType}/>
      }
      <BaseDeleteModal isOpen={isDelete} handleClose={() => setIsDelete(false)} handleDelete={handleDelete}
                       label={`このフォルダを削除してもよろしいですか？`}/>
    </div>
  );
}
