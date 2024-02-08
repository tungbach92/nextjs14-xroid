import React from 'react';
import DialogCustom from "@/app/components/DialogCustom/index";

type Props = {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  data?: [],
  onClick?: React.MouseEventHandler<HTMLElement>
  title?: string,
}

function ConfirmDialog({open, setOpen, onClick, title = 'このフォルダを削除してもよろしいですか？'}: Props) {

  return (
    <>
      {
        open && <DialogCustom open={open} setOpen={setOpen} onClick={onClick} titleOk={'OK'}>
              <div className='flex flex-col items-center gap-4'>
                  <img src='/icons/delete-icon.svg' alt='delete-icon'/>
                  <span>{title}</span>
              </div>
          </DialogCustom>
      }
    </>
  );
}

export default ConfirmDialog;
