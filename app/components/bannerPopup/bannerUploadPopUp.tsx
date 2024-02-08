import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

type Props = {
  loading: boolean,
  open?: boolean,
  setOpen?: any,
  setTitle?: React.Dispatch<React.SetStateAction<string>>,
  setText?: React.Dispatch<React.SetStateAction<string>>,
  setImage?: React.Dispatch<React.SetStateAction<string>>,
  setPageUrl?: React.Dispatch<React.SetStateAction<string>>,
  title?: string,
  data?: []
  onClick?: React.MouseEventHandler<HTMLElement>
  isPopup?: boolean
  isUrl?: boolean
  image?: string,
  popupTitle?: string,
  popupText?: string,
  popupLink?: string,
  handleChangeTitle?: any,
  handleChangeText?: any,
  handleChangeLink?: any,
  isError?: boolean
  setIsError?: React.Dispatch<React.SetStateAction<boolean>>,
  handleChangeImage?: (e) => void
  handleChangeTitleButton?: (e) => void
  setTitleButton?: React.Dispatch<React.SetStateAction<string>>,
  titleButton?: string
  setItemEdit: React.Dispatch<React.SetStateAction<any>>
}
export default function BannerUploadPopUp({
                                            loading,
                                            popupTitle,
                                            setTitle,
                                            setPageUrl,
                                            setText,
                                            setImage,
                                            popupText,
                                            popupLink,
                                            handleChangeTitle,
                                            handleChangeText,
                                            handleChangeLink,
                                            image,
                                            open,
                                            setOpen,
                                            title,
                                            isPopup = false,
                                            onClick = () => {
                                            },
                                            isError,
                                            setIsError,
                                            handleChangeImage,
                                            setTitleButton,
                                            titleButton,
                                            handleChangeTitleButton,
                                            setItemEdit
                                          }: Props) {
  const handleClose = () => {
    setOpen(false);
    setIsError(false)
    setTitle('')
    setText('')
    setImage('')
    setPageUrl('')
    setTitleButton('')
    setItemEdit(null)
  };

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth={"xs"}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {
        title &&
        <div className='flex flex-col relative'>
          <DialogTitle className='flex items-center justify-center py-2 text-[18px] text-black font-[500]' id="alert-dialog-title">
            <span>{title}</span>
          </DialogTitle>
          <div className='h-px w-full bg-[#ccc] '></div>
        </div>
      }
      <div className=' flex flex-col items-center w-full px-6 mt-6'>
        {
          isPopup ?
            <>
              <TextField
                id="outlined-basic" label="タイトル"
                multiline
                value={popupTitle}
                onChange={handleChangeTitle}
                variant="outlined"
                size={'small'}
                className={'w-full bg-[#F5F7FB]'}
              />
              <Button
                color="primary"
                aria-label="upload picture"
                component="label"
                className='border-[1px] border-dashed border-black/20 h-52 w-full rounded-md flex items-center justify-center overflow-hidden mt-5'
              >
                <input
                  onChange={(event) => handleChangeImage(event)}
                  hidden accept="image/*" type="file"/>
                {
                  loading ? <CircularProgress/>
                    :
                    <img src={image ? image : '/icons/add-image.svg'} alt="banner/popup"
                         className={`${image ? 'object-contain' : 'w-[40px] h-[40px]'}`}/>
                }
              </Button>
              <TextField
                id="outlined-basic" label="説明"
                multiline
                rows={2}
                value={popupText}
                onChange={handleChangeText}
                variant="outlined"
                className={'mt-5 w-full bg-[#F5F7FB]'}
              />
              <TextField
                id="outlined-basic" label="ボタンの文字"
                multiline
                value={titleButton}
                onChange={handleChangeTitleButton}
                variant="outlined"
                size={'small'}
                className={'mt-5 w-full  bg-[#F5F7FB]'}
              />
              <TextField
                id="outlined-basic" label="URL"
                value={popupLink}
                error={isError}
                onChange={handleChangeLink}
                variant="outlined"
                size={'small'}
                helperText={isError ? 'URLの形式が正しくありません。' : ''}
                className={'mt-5 w-full bg-[#F5F7FB]'}
                sx={{
                  input: {
                    color: "#1976D2",
                    background: "#F5F7FB",
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }
                }}
              />
            </>
            :
            (<><TextField
                id="outlined-basic" label="リンク"
                // multiline
                value={popupLink}
                error={isError}
                onChange={handleChangeLink}
                variant="outlined"
                size={'small'}
                helperText={isError ? 'URLの形式が正しくありません。' : ''}
                className={'w-full'}
                sx={{
                  input: {
                    color: "#1976D2",
                    background: "#F5F7FB",
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }
                }}
              />
                <Button
                  color="primary"
                  aria-label="upload picture"
                  component="label"
                  className='border-[1px] border-dashed border-black/20 h-52 w-full rounded-md flex items-center justify-center mt-5 overflow-hidden text-[red]'
                >
                  <input
                    onChange={(event) => handleChangeImage(event)}
                    hidden accept="image/*" type="file"/>
                  {loading ? <CircularProgress/>
                    :
                    <img src={image ? image : '/icons/add-image.svg'} alt="banner/popup"
                         className={`${image ? 'object-contain' : 'w-[40px] h-[40px]'}`}/>}
                </Button></>
            )
        }

      </div>
      <DialogActions className='my-4 flex justify-center'>
        {isPopup && <Button variant='outlined' onClick={handleClose}>閉じる</Button>}
        <Button
          variant='contained'
          onClick={onClick}
          autoFocus
        >
          アップロード
        </Button>
      </DialogActions>
    </Dialog>
  );
}
