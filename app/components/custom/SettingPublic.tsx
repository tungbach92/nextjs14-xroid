import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from "@mui/material/Checkbox";
import {ViewOptionForm} from "@/app/types/types";
import {Check} from "@mui/icons-material";
import Box from "@mui/material/Box";

type props = {
  item: ViewOptionForm
  isLocked?: boolean
}

function SettingPublic({item, isLocked}: props) {
  return (
    <FormControlLabel
      className={'px-2 pointer-events-none'}
      control={isLocked ? (
        <Box className={`mx-2 my-1 ${!item.checked && 'mr-8 mt-9' }`} >
          {(item.checked) && <Check className={"text-blue-500"} />}
        </Box>
      ) : (
        <Checkbox
          key={item.id}
          defaultChecked={item.checked}
          className={`${(item.value === "proPlanMode" || item.value === "productionMode") && isLocked && 'hidden'}`}
        />
      )}
      label={item.label}
    />
  );
}

export default SettingPublic;
