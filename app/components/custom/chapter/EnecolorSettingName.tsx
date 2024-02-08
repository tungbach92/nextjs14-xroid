import TextField from "@mui/material/TextField";
import {Button} from "@mui/material";
import React from "react";
import DialogCustom from "@/app/components/DialogCustom";

interface Props {
  saveSetting: (text: string) => void
  openNameDialog: boolean
  setOpenNameDialog: (p: boolean) => void
  text: string
  setText: (text: string) => void
}

export const EnecolorSettingName = ({saveSetting, openNameDialog, setOpenNameDialog, text, setText}: Props) => {
  const handleClose = () => {
    setOpenNameDialog(false)
    setText('')
  }

  const handleSubmit = () => {
    saveSetting(text)
  }
  return (
    <div className={'flex items-center justify-center gap-3 mt-3 mb-4'}>

      <Button variant="contained" color="primary" className={'w-40 h-10'}
              onClick={() => {
                setOpenNameDialog(true)
              }}>設定</Button>
      <
        DialogCustom open={openNameDialog}
                     setOpen={setOpenNameDialog}
                     disable={!text} title='名前設定'
                     onClick={handleSubmit}
        // loading={loading}
                     fullWidth={false}
                     onClose={handleClose}>
        <TextField
          label="名前設定"
          size="small"
          margin="none"
          variant={"filled"}
          value={text}
          onChange={e => {
            setText(e.target.value)
          }}
          helperText={'設定できるために、名前を設定してください。'}
          className={'flex-1'}
        />
      </DialogCustom>
    </div>
  )
}
