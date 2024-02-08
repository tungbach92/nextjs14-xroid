import React, {useEffect, useState} from 'react';
import TextField from "@mui/material/TextField";
import {BlockPrompt, BlockPromptInput, BlockText, Enecolor} from "@/app/types/block";

type props = {
  item?: BlockPrompt | BlockPromptInput | BlockText | Enecolor
  groupIndex?: number
  idx?: number
  group?: { name: string, text: string, label?: string, color?: string },
  colInput?: number
  handleGroupTextChange: (e, grtIndex, grIndex) => void
  output_type?: string
  setFocusColorRankRight?: React.Dispatch<React.SetStateAction<string | number>>
}

function TextBlocksCustom({
  item,
  groupIndex,
  idx,
  group,
  colInput,
  handleGroupTextChange,
  output_type,
  setFocusColorRankRight,
}: props) {
  const [text, setText] = useState<string>('')
  useEffect(() => {
    if (item)
      setText("data" in item ? item?.data?.groupsText?.[idx]?.groups?.[groupIndex] : item?.groupsText?.groups?.[groupIndex])
  }, [item])


  return (
    <div className={'pt-5'}>
      <TextField
        inputProps={{'data-tempid': item?.id}}
        value={text}
        onChange={(e) => {
          handleGroupTextChange(e, idx, groupIndex)
          setText(e.target.value)
        }}
        onMouseOver={() => setFocusColorRankRight?.(group?.label ? group?.label : group.name)}
        label={group?.label ? group.label : group.name}
        InputLabelProps={{shrink: true}}
        multiline={true}
        variant="outlined"
        fullWidth={colInput === 1}
        size={'small'}
        className={`${colInput === 1 ? "" : `max-w-[${colInput === 2 ? "150px" : "100px"}]`}  outline-none`}
        sx={{
          input: {
            color: "#ddd",
            borderColor: group?.color ? group.color : "inherit"
          },
          "& label.Mui-focused": {
            color: `${group?.color ? "inherit" : "blue"} !important`
          },
          fieldset: {borderColor: `${group?.color ? group.color : "rgba(0, 0, 0, 0.23)"}`},
          "&:hover fieldset": {borderColor: `${group?.color ? group.color : "rgba(0, 0, 0, 0.87)"} !important`},
          '& .Mui-focused.fieldset, & .Mui-focused fieldset': {
            borderColor: `${group?.color ? group.color : "blue"} !important`,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: `${group?.color ? group.color : "rgba(0, 0, 0, 0.87)"} !important`,
          }
        }}
      />
    </div>
  );
}

export default TextBlocksCustom;
