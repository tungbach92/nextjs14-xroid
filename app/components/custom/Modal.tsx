import * as React from 'react';
import Button from '@mui/material/Button';
import {styled} from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogContent from "@mui/material/DialogContent";


const BootstrapDialog = styled(Dialog)(({theme}) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(1),

  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
  titlePosition?: string
  bgColor?: string
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const {children, onClose, ...other} = props;

  return (
    <DialogTitle sx={{m: 0, p: 2}} {...other} className={`bg-[${props.bgColor}]`}>
      <div className={`text-base text-light-primary flex
      ${props.titlePosition === "left" ? 'justify-start' : props.titlePosition === "center" ?
        'justify-center' : 'justify-end'} font-bold`}>{children}</div>
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
};

type TemplateDialogProps = {
  open: boolean,
  setOpen: (e: boolean) => void,
  onSubmit?: any,
  onClose?: () => void,
  title: string | React.ReactNode,
  size?: "xs" | "sm" | "md" | "lg" | "xl",
  btnSubmit?: string
  btnCancel?: string
  handleClose?: any
  children?: React.ReactNode
  isChapterStruct?: boolean
  loading?: boolean
  actionPosition?: "left" | "right" | "center" | "between" | ""
  titlePosition?: string
  isDisabled?: boolean
  actionChildren?: React.ReactNode,
  dividers?: boolean,
  bgColor?: string
  isBtnGroupCenter?: boolean
}

function Modal({
                 open = false,
                 title = '',
                 onSubmit = () => {
                 },
                 btnSubmit = "設定する",
                 btnCancel = "キャンセル",
                 handleClose = () => {},
                 children,
                 isChapterStruct = false,
                 loading = false,
                 actionPosition = "right",
                 titlePosition = "center",
                 isDisabled = false,
                 size = "sm",
                 actionChildren,
                 dividers = true, bgColor, isBtnGroupCenter
               }: TemplateDialogProps) {

  return (
    <div className={''}>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth={true}
        maxWidth={size}
      >
        <BootstrapDialogTitle id="customized-dialog-title" bgColor={`${bgColor}`} onClose={handleClose}
                              titlePosition={titlePosition}>
          {title}
        </BootstrapDialogTitle>
        {title && !children && <div className={' bg-[#CCCCCC] h-[2px] w-full mb-5'}/>}
        {loading && <div className={'flex justify-center items-center'}>
          <LoadingButton
            loading={loading}
            variant="outlined"
            color="primary"
          />
        </div>}
        {
          children &&
          <DialogContent dividers={dividers} className={`bg-[${bgColor}]`}>
            {children}
          </DialogContent>
        }
        <DialogActions
          className={`bg-[${bgColor}] ${actionPosition === "left" ? 'justify-start' : actionPosition === "center" ?
            'justify-center' : actionPosition === "between" ? 'justify-between' : 'justify-end'} flex py-5 ${actionChildren ? 'grid grid-cols-12 gap-3' : ''}`}>
          <div className={'col-span-9'}>
            {actionChildren}
          </div>
          <div
            className={`${actionChildren ? 'flex flex-col-reverse col-span-3' : ''} ${isBtnGroupCenter && 'm-auto'}`}>
            {
              !isChapterStruct && btnCancel &&
              <Button disabled={loading} variant={'text'} onClick={handleClose}>
                {btnCancel}
              </Button>
            }
            {btnSubmit &&
              <LoadingButton className={`px-10`} loading={loading} disabled={isDisabled} onClick={onSubmit}
                             variant="contained">
                <span className={`${actionChildren ? 'text-xs' : ''}`}>{btnSubmit}</span>

              </LoadingButton>
            }
          </div>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

export default Modal

