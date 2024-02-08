import React, {useState} from 'react';
import {Button} from "@mui/material";
import AddFolder from '@/app/common/data/svgData/folder-add-icon.svg';
import AddSubFolderDialog from "@/app/components/Home/AddSubFolder/AddSubFolderDialog";
import {foldersAtom} from "@/app/store/atom/folders.atom";
import {useSetAtom} from "jotai";

type Props = {
  parentId: string
}

function AddSubFolder({parentId}: Props) {
  const [open, setOpen] = useState(false);
  const setFolders = useSetAtom(foldersAtom)
  return (
    <div>
      {
        open && <AddSubFolderDialog open={open} setOpen={setOpen} isSubFolder={true} parentId={parentId}
                                    setFolders={setFolders}/>
      }
      <Button
        className='fixed bottom-14 right-24 w-16 h-16 bg-[#E5F1FF] rounded-full hover:bg-blue-200'
        onClick={() => setOpen(true)}
      >
        <AddFolder/>
      </Button>
    </div>
  );
}

export default AddSubFolder;
