import * as React from 'react';
import {styled} from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BootstrapDialog = styled(Dialog)(({theme}) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const {children, onClose, ...other} = props;

  return (
    <DialogTitle sx={{m: 0, p: 2}} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon/>
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

type props = {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  children?: React.ReactNode
  title?: string
  back?: number
  handleBackToBefore?: () => void
}

function DialogCustom({open, setOpen, children, title, back, handleBackToBefore}: props) {

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          <div className='flex items-center gap-2'>
            {
              back === 2 &&
              <ArrowBackIcon className='text-black cursor-pointer hover:text-blue-400' onClick={handleBackToBefore}/>
            }
            {title}
          </div>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          {children}
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}

export default DialogCustom;
