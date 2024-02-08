import React, {DetailedHTMLProps, HTMLAttributes} from "react";
import {MenuItem, Select} from "@mui/material";

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  value: string | number
  onChange?: (any) => void
}

export const SelectRow = ({value, onChange, className}: Props) => {
  let classTxt = "w-full rounded bg-white h-[30px] ";
  if (className) classTxt += className;

  const handleChange = (e) => {
    if (onChange) onChange(e);
  }

  const optionArr = Array.from({length: 100}, (v, i) => i + 1);

  return (
    <>
      <Select
        className={classTxt}
        value={value}
        onChange={handleChange}
        size={"small"}
        SelectDisplayProps={{
          style: {
            paddingTop: 10,
            paddingBottom: 8
          }
        }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 250
            }
          }
        }}
      >
        {optionArr.map(item => (
          <MenuItem value={item} key={item}>{item}</MenuItem>
        ))}
      </Select>
    </>
  )
}