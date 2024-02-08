import React from 'react';
import FormControl from "@mui/material/FormControl";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import InputLabel from '@mui/material/InputLabel';

type props = {
  dataSelect: { value: string, label: string }[]
  value: any
  maxWidth?: number
  minWidth?: number
  className?: string
  isInPutLabel?: boolean
  label?: string
  variant?: 'standard' | 'outlined' | 'filled'
  onChange?: (event: SelectChangeEvent) => void
  disabled?: boolean
  renderValue?: string | number
}

function Dropdown({
  onChange, dataSelect, maxWidth, minWidth, value,
  className, isInPutLabel, label, variant, disabled = false
}: props) {
  return (
    <Box sx={{maxWidth: maxWidth, minWidth: minWidth}} className={className}>
      <FormControl size='small' fullWidth variant={variant} disabled={disabled}>
        {
          isInPutLabel && <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        }
        <Select
          value={value ?? ''}
          displayEmpty
          label={label}
          onChange={onChange}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300,
                overflowY: 'auto'
              }
            }
          }}
        >
          {/*<MenuItem key={0} value={""} className={"text-[#A9A9A9] italic"}>No data</MenuItem>*/}
          {
            dataSelect?.map((item: any, index: number) => {
              return (
                <MenuItem key={index} value={item?.value}>
                  {item?.label}
                </MenuItem>
              )
            })
          }
        </Select>
      </FormControl>
    </Box>
  );
}

export default Dropdown;
