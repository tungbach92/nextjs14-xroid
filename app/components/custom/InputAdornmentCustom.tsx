import React from 'react';
import {TextField} from "@mui/material";

type props = {
  text: string
  onChange: (e) => void
  value: string
}

function InputAdornmentCustom({text, onChange, value}: props) {
  return (
    <div className={'flex flex-row items-center'}>
      <TextField
        size={'small'}
        sx={{width: '60%'}}
        placeholder={text}
        onChange={onChange}
        value={value}
      />
      <span className={'pl-2'}>{text}</span>
    </div>
  );
}

export default InputAdornmentCustom;
