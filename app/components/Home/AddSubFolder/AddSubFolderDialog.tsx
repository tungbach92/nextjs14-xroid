import React, {useState} from 'react';
import DialogCustom from "@/app/components/DialogCustom";
import InputCustom from "@/app/components/DialogCustom/InputCustom";
import {toast} from "react-toastify";
import {isFunction} from "lodash";
import {createFolder, editFolder, getListFolder} from "@/app/common/folders";
import {Folder} from "@/app/types/folders";

type Props = {
  open?: boolean,
  setOpen?: any,
  isSubFolder?: boolean
  selectedFolder?: any
  setAnchorEl?: React.Dispatch<React.SetStateAction<HTMLButtonElement>>
  parentId?: string,
  subFolder?: Folder
  setFolders: any
  folderType?: string
}

function AddSubFolderDialog({
                              open,
                              setOpen,
                              subFolder,
                              isSubFolder = false,
                              selectedFolder = {},
                              setAnchorEl,
                              parentId = "",
                              setFolders,
                              folderType = 'content'
                            }: Props) {
  const [folderName, setFolderName] = useState<string>(subFolder?.name || selectedFolder?.name || "")
  const [isDisable, setIsDisable] = useState(false);

  const handleSubmit = async () => {
    try {
      if (!folderName.trim())
        return toast.error('フォルダー名を入力してください。')

      const dataFolder = {
        name: folderName || subFolder?.name,
        type: folderType || 'content'
      }
      const dataSubFolder = {
        name: folderName || subFolder?.name,
        parentId: subFolder?.parentId || parentId,
        type: folderType || 'content'
      }
      let res
      if (!selectedFolder?.id && !subFolder) {
        res = await createFolder(isSubFolder ? dataSubFolder : dataFolder)
        setIsDisable(true)
        toast.success('フォルダーを追加しました。')
      } else {
        res = await editFolder(isSubFolder ? {...dataSubFolder, id: subFolder.id} : {
          ...dataFolder,
          id: selectedFolder?.id
        })
        toast.success("フォルダーを編集しました。")
        setAnchorEl(null)
        setIsDisable(true)
      }
      if (res?.status === 200) {
        const listFolder = await getListFolder(folderType || "content")
        setFolders(listFolder)
      }
      setOpen(false);
      if (isFunction(setAnchorEl))
        setAnchorEl(null)

    } catch (e) {
      console.log(e);
      toast.error(e.message)
    } finally {
      setFolderName("")
    }
  }

  return (
    <DialogCustom
      title={subFolder?.id || selectedFolder?.id ? 'フォルダを編集する' : 'フォルダ追加'}
      open={open}
      setOpen={setOpen}
      onClick={handleSubmit}
      disable={!folderName || isDisable}
    >
      <InputCustom className='flex-col w-full' title='タイトル' value={folderName} setValue={setFolderName}/>
    </DialogCustom>
  );
}

export default AddSubFolderDialog;

