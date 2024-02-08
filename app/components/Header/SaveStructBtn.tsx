import SaveIcon from "@mui/icons-material/Save";
import {Button} from "@mui/material";
import React from "react";
import {useSnapshot} from "valtio";
import {saveStructBtnPropsProxy} from "@/app/store/proxy/saveStructBtnProps.proxy";

export const SaveStructBtn = () => {
  const {handleSubmit, disabled} = useSnapshot(saveStructBtnPropsProxy)
  return (
    <Button
      className="capitalize font-bold px-6"
      variant="contained"
      startIcon={<SaveIcon/>}
      onClick={handleSubmit}
      disabled={disabled}
    >
      保存
    </Button>
  )
}
