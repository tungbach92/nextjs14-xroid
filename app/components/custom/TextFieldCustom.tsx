import React from 'react';
import TextField from "@mui/material/TextField";


export default function TextFieldCustom({

                                          value,
                                          onChange,
                                          label = '',
                                          variant = 'outlined',
                                          fullWidth = true,
                                          id = '',
                                          ...props
                                        }: any) {

  return (
    <TextField
      {...props}
      id={id}
      autoFocus
      variant={variant}
      size={'small'}
      fullWidth={fullWidth}
      label={label}
      value={value}
      onChange={onChange}
    />
  );
}

