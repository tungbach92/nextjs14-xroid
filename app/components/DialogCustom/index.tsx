import * as React from 'react';
import {ReactNode} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from "@mui/material/DialogContent";
import {Breakpoint} from "@mui/system";
import LoadingButton from "@mui/lab/LoadingButton";


type Props = {
  open?: boolean,
  setOpen?: any,
  title?: string | ReactNode,
  children?: ReactNode,
  subHeader?: ReactNode,
  data?: []
  onClick?: React.MouseEventHandler<HTMLElement>
  loading?: boolean,
  onClose?: () => void,
  disable?: boolean,
  titleOk?: string,
  action?: boolean,
  fullWidth?: boolean,
  maxWidth?: false | Breakpoint,
  isCancelBtn?: boolean,
  classNameBtnOk?: string,
  closeBtn?: ReactNode
  noBtnOk?: boolean
  dialogHeight?: string
  bgColor?: string
  titleBorderBottom?: string
  contentBorderBottom?: boolean
  isNoDialogTitle?: boolean
}
export default function DialogCustom({
  open,
  setOpen,
  title,
  children,
  subHeader,
  disable,
  titleOk = '保存',
  onClick = () => {},
  onClose = () => {},
  loading = false,
  action = true,
  fullWidth = true,
  maxWidth = 'sm',
  isCancelBtn = true,
  classNameBtnOk = '',
  closeBtn,
  noBtnOk = false,
  dialogHeight,
  bgColor,
  titleBorderBottom,
  contentBorderBottom = true,
  isNoDialogTitle = false,
}: Props) {

  const handleClose = () => {
    onClose();
    setOpen(false);
  };
  return (
    <Dialog
      open={open}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: `${bgColor}`
        }
      }}
      className={`${dialogHeight}`}
    >
      {

        !isNoDialogTitle &&
        <div className='flex flex-col relative'>
          <DialogTitle className='font-bold flex items-center justify-center' id="alert-dialog-title"
                       sx={{
                         "&.MuiDialogTitle-root": {
                           borderBottom: `${titleBorderBottom}`
                         },
                       }}>
            {closeBtn}
            <div className={'w-full text-center'}>{title}</div>
            <div className='absolute right-6'>
              {subHeader}
            </div>
          </DialogTitle>
          {/*<div className='h-px w-full bg-gray-100'></div>*/}
        </div>
      }
      <DialogContent dividers sx={{
        "&.MuiDialogContent-root": {
          borderTop: 'none',
          borderBottom: `${!contentBorderBottom ? 'none' : ''}`,
        },
      }}>
        <div className='inline-flex items-center justify-center w-full'>
          {children}
        </div>
      </DialogContent>
      {
        action && <DialogActions className='p-5' sx={{
          "&.MuiDialogActions-root": {
            borderTop: 'none'
          },
        }}>
          {isCancelBtn && <Button variant='text' onClick={handleClose}>
            キャンセル
          </Button>}
          {!noBtnOk &&
            <LoadingButton
              disabled={disable}
              loading={loading}
              variant='contained'
              onClick={onClick}
              autoFocus
              className={classNameBtnOk}
            >
              {titleOk}
            </LoadingButton>
          }
        </DialogActions>
      }
    </Dialog>
  );
}
