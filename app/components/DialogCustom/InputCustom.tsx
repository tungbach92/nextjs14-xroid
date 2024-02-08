import React from 'react';
import TextField from "@mui/material/TextField";
import {TextareaAutosize} from '@mui/base';

type Props = {
  title?: string,
  className?: string,
  textArea?: boolean,
  value?: string
  setValue?: React.Dispatch<React.SetStateAction<string>>
  onKeyDown?: (e) => void
  placeholder?: string
}

function InputCustom({title, className, textArea, value, setValue, onKeyDown, placeholder}: Props) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {
        title && <label>{title}</label>
      }
      {
        textArea ?
          <TextareaAutosize className='bg-[#F5F7FB] rounded-md outline-0 text-black' minRows={5}
                            placeholder={placeholder}
                            value={value} onChange={(e) => setValue(e.target.value)}/>
          :
          <TextField className='bg-[#F5F7FB]' onKeyDown={onKeyDown} fullWidth label="" id="fullWidth" size='small'
                     placeholder={placeholder}
                     value={value} onChange={(e) => setValue(e.target.value)}/>
      }
    </div>
  );
}

export default InputCustom;
