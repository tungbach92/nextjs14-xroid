import React, {forwardRef, useState} from 'react';
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import {TextField} from "@mui/material";
import {TextFieldProps} from "@mui/material/TextField/TextField";
import {CssTextField} from "@/app/components/custom/CssTextField";

const TextOutlineCustom = forwardRef(function Com(props: TextFieldProps, ref) {
  const {
    id = '',
    value = '',
    onChange = null,
    label = '',
    ...otherProps
  } = props;

  const [showPassword, setShowPassword] = useState<boolean>(false)
  // console.log('ref', ref)
  const handleClickShowPassword = () => setShowPassword((show: boolean) => !show);

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  return (
    <FormControl sx={{width: "100%"}} variant="outlined">
      {/*<InputLabel size={"small"} htmlFor="outlined-adornment-password">{label}</InputLabel>*/}
      <TextField
        {...otherProps}
        id={id}
        inputRef={ref}
        size={"small"}
        type={showPassword ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <img src={'/icons/eye.png'} alt={'eye'}/> :
                  <img src={'/icons/hideEye.png'} alt={'hideEye'}/>}
              </IconButton>
            </InputAdornment>
          )
        }}
        InputLabelProps={{shrink: true}}
        label={label}
        onChange={onChange}
        value={value}
      />
    </FormControl>
  );
});


export default TextOutlineCustom;
