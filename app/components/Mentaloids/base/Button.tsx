import {Button as MuiButton, ButtonProps as MuiButtonProps} from "@mui/material";
import React from "react";
import {Add} from "@mui/icons-material";
import {twMerge} from "tailwind-merge";

type ButtonProps = MuiButtonProps & {}
export const Button: React.FunctionComponent<ButtonProps> = ({children, className, ...props}) => {
  return <MuiButton variant='contained' className={twMerge(`laptop:w-auto min-w-[31px] laptop:p-1 laptop:aspect-square rounded-md w-full py-3 aspect-auto`, className)} {...props}>
    {children ? children : <Add className={`text-white`}/>}
  </MuiButton>
}
