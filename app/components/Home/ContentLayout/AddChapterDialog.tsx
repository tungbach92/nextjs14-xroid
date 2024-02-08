import React from 'react';
import DialogCustom from "@/app/components/DialogCustom";
import AddChapter from "@/app/components/Chapter/AddChapter";
import AddIcon from "@mui/icons-material/Add";
import {Button} from "@mui/material";
import {useRouter} from "next/navigation";

type Props = {
  contentId: string
  isSubFolder?: boolean,
}

function AddChapterDialog({contentId, isSubFolder}: Props) {
  const router = useRouter()
  const subFolderId = router.query.subFolder

  return (
    <>
      <DialogCustom title='チャップター追加'>
        <AddChapter/>
      </DialogCustom>
      <Button
        className='normal-case flex items-center gap-1 w-full px-0 sm:text-[9px] lg:text-[13px]'
        variant='contained'
        onClick={() => router.push(!isSubFolder ? `/contents/${contentId}/createChapter` : `/contents/subFolder/${subFolderId}/subContent/${contentId}/createChapter`)}
        >チャプター<AddIcon/>
        </Button>
    </>
  );
}

export default AddChapterDialog;
