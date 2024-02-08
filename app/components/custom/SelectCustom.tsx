import React from 'react';
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";

type Props = {
  width?: number,
  dataSelect?: any[]
  value?: string
  handleChange?: any
}

function SelectCustom({width, dataSelect, value, handleChange}: Props) {

  return (
    <Box sx={{minWidth: width ?? 140}}>
      <FormControl fullWidth>
        <Select
          size='small'
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          onChange={handleChange}
          sx={{border: 0}}
        >
          {
            dataSelect.length > 0 && dataSelect.map(item => {
              return <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
            })
          }
        </Select>
      </FormControl>
    </Box>
  );
}

export default SelectCustom;
