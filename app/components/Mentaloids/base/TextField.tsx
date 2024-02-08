import {TextField as MuiTextField, TextFieldProps as MuiTextFieldProps} from "@mui/material";
import React from "react";
import {twMerge} from "tailwind-merge";

type TextFieldProps = MuiTextFieldProps & {}
export const TextField: React.FunctionComponent<TextFieldProps> = ({className , ...props}) => {
    return <MuiTextField variant={"outlined"} className={twMerge(`max-w-full laptop:min-w-[200px] laptop:min-h-[40px]`, className)} {...props}></MuiTextField>
}
