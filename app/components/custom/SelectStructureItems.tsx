import React from 'react';
import Checkbox from "@mui/material/Checkbox";
import {FormControlLabel} from "@mui/material";

type Props = {
  item?: any
  onChange?: any
  checked?: boolean
}

function SelectStructureItems({item, onChange, checked}: Props) {
  return (
    <FormControlLabel
      key={item.id}
      className={'flex gap-2 bg-[#F5F7FB] py-2 min-w-fit my-2 mx-10 rounded-md'}
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          id={item.id}
          color="primary"
        />
      }
      label={item.name}
    />
  );
}

export default SelectStructureItems;
