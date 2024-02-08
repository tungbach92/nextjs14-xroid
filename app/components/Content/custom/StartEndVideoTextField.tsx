import React from 'react';
import TextField from "@mui/material/TextField";
import {convertInputNumber} from "@/app/common/convertNumber";

type Props = {
  hours: number
  minutes: number
  seconds: number
  handleChangeTime: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, type: string) => void
  title: string
  className?: string
}

function StartEndVideoTextField({hours, minutes, seconds, handleChangeTime, className,title}: Props) {

  return (
      <div className={`flex flex-wrap gap-2 items-center ${className}`}>
        <p className={`${title === 'End' ? 'ml-1' : ''}`}>{title} :</p>
        <TextField name='startAt'
                   id="outlined-basic"
                   value={convertInputNumber(hours)}
                   onChange={(e) => handleChangeTime(e, `${title === 'Start' ? 'startHour' : 'endHour'}`)}
                   variant="outlined" size={'small'}
                   label={'hours'}
                   className={'w-1/6'}
                   type={'number'}
                   inputProps={{min: 0}}
        />
        <TextField name='startAt'
                   id="outlined-basic"
                   onChange={(e) => handleChangeTime(e, `${title === 'Start' ? 'startMinute' : 'endMinute'}`)}
                   variant="outlined" size={'small'}
                   value={convertInputNumber(minutes)}
                   label={'minutes'}
                   className={'w-1/6'}
                   type={'number'}
                   inputProps={{min: 0}}

        />
        <TextField name='startAt'
                   id="outlined-basic"
                   onChange={(e) => handleChangeTime(e, `${title === 'Start' ? 'startSecond' : 'endSecond'}`)}
                   variant="outlined" size={'small'}
                   value={convertInputNumber(seconds)}
                   label={'seconds'}
                   className={'w-1/6'}
                   type={'number'}
                   inputProps={{min: 0}}
        />
      </div>
  );
}

export default StartEndVideoTextField;
