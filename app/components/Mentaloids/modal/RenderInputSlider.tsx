import React from 'react';
import {Slider, Stack} from "@mui/material";
import Remove from "@mui/icons-material/Remove";
import Add from "@mui/icons-material/Add";

type props = {
  label: string
  type: string
  min: number
  max: number
  stateValue: number
  handleChange: (e, value) => void
  handleClickAdjust: (type: string, isAdd: boolean, min: number, max: number) => void
}

function RenderInputSlider({label, type, min, max, stateValue, handleChange, handleClickAdjust}: props) {
  return (
    <div className="w-full items-center">
      <span>{label}</span>
      <Stack spacing={2} direction="row" width={"100%"} alignItems="center">
        <Remove className={"cursor-pointer hover:scale-110"} fontSize={"small"}
                onClick={() => handleClickAdjust(type, false, min, max)}/>
        <Slider
          size={'small'}
          min={min}
          max={max}
          valueLabelDisplay="auto"
          aria-label={label}
          value={stateValue}
          onChange={handleChange}
        />
        <Add className={"cursor-pointer hover:scale-110"} fontSize={"small"}
             onClick={() => handleClickAdjust(type, true, min, max)}/>
        <div>
          {(max < stateValue) ? max : stateValue}
        </div>
      </Stack>
    </div>
  );
}

export default RenderInputSlider;
