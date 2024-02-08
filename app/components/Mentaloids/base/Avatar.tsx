import {Avatar as MuiAvatar, AvatarProps as MuiAvatarProps} from "@mui/material";
import React, {ReactNode} from "react";
import {twMerge} from "tailwind-merge";

type AvatarProps = MuiAvatarProps & {
  isBorder?: boolean
}
export const Avatar: React.FunctionComponent<AvatarProps> = ({
                                                               isBorder = false,
                                                               className,
                                                               children,
                                                               ...props
                                                             }) => {
  return <MuiAvatar
    className={twMerge(`min-w-[50px] min-h-[50px] cursor-pointer hover:scale-105 drop-shadow-xl ${isBorder ? 'border-4 border-solid border-shade-blue' : ''}`, className)} {...props}>{children}</MuiAvatar>
}
