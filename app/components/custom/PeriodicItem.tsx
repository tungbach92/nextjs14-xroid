import React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {ReleaseOptionsType} from "@/app/types/content";
import {Enumerate} from "@/app/types/computedRange";
import {numericalOrder, selectDay} from "@/app/components/Content/data/data";

type props = {
  dayValue?: Enumerate<7>
  weekValue?: Enumerate<6>
  title?: string
  handleChangeDay?: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleChangeMonth?: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  releaseOptionsType?: ReleaseOptionsType
}

function PeriodicItem({
                        dayValue,
                        weekValue,
                        title,
                        handleChangeDay,
                        handleChangeMonth,
                        type,
                        releaseOptionsType
                      }: props) {
  return (
    <div className={'flex gap-2 items-center bg-white'}>
      <div className={`min-w-fit`}>
        {title}
      </div>
      {
        type === "monthly" &&
        <Box>
          <FormControl fullWidth>
            <Select
              disabled={type !== releaseOptionsType}
              value={weekValue}
              size={"small"}
              className={"mb-2"}
              onChange={handleChangeMonth}
            >
              {
                numericalOrder?.map((item) => {
                  return (
                    <MenuItem value={item.value} key={item.value}>{item.label}</MenuItem>
                  )
                })
              }
            </Select>
          </FormControl>
        </Box>
      }
      <Box>
        <FormControl fullWidth>
          <Select
            disabled={type !== releaseOptionsType}
            value={dayValue}
            size={"small"}
            className={"mb-2"}
            onChange={handleChangeDay}
          >
            {
              selectDay?.map((item) => {
                return (
                  <MenuItem value={item.value} key={item.value}>{item.label}</MenuItem>
                )
              })
            }
          </Select>
        </FormControl>
      </Box>
    </div>
  );
}

export default PeriodicItem;
