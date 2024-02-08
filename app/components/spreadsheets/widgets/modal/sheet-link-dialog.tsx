import React from "react";
import { BaseModal, BaseModalProps } from "@/app/components/base";
import { imageUri } from "@/app/components/assets";
import { Button, Checkbox, FormControlLabel, FormGroup, TextField } from "@mui/material";

interface SheetLinkDialogProps extends BaseModalProps {}

export const SheetLinkDialog: React.FC<SheetLinkDialogProps> = ({ isOpen, handleClose }) => {
  return (
    <BaseModal isOpen={isOpen} handleClose={handleClose}>
      <div>
        <div className={"flex items-center gap-5"}>
          <img src={imageUri.iconImg.spreadsheetsIcon} />
          <label className={"font-medium text-xl text-[#000000] mt-1"}>エネビーストデータ</label>
          <Button variant="contained">読み込み</Button>
        </div>
        <TextField variant="outlined" size="small" placeholder={"シートID"} className={"bg-white my-6"} fullWidth />
        <div className={"font-medium text-sm text-[#000000]"}>全てのシート</div>
        <FormGroup className={"my-4"}>
          <FormControlLabel
            className={"text-[#ADADAD]"}
            control={<Checkbox className={"text-lightGreen"} defaultChecked />}
            label="シート3"
          />
          <FormControlLabel
            className={"text-[#ADADAD]"}
            control={<Checkbox className={"text-lightGreen"} />}
            label="シート4"
          />
          <FormControlLabel
            className={"text-[#ADADAD]"}
            control={<Checkbox className={"text-lightGreen"} />}
            label="シート5"
          />
        </FormGroup>
        <div className={"flex justify-end gap-2"}>
          <Button onClick={handleClose} className={"text-lightGreen"}>
            キャンセル
          </Button>
          <Button className="shadow-lg bg-lightGreen duration-300 hover:bg-lightGreenHover text-white">同意</Button>
        </div>
      </div>
    </BaseModal>
  );
};
