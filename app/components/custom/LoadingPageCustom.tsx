import * as React from 'react';
import {CircularProgress, Stack} from "@mui/material";

export const LoadingPageCustom = (props: any) => {
    const {position = 'fixed'} = props
    return (
        <div
          className={`${position} top-0 left-0 right-0 bottom-0 h-full w-full z-50 overflow-hidden bg-gray-800/75 flex flex-col items-center justify-center`}>
          <Stack sx={{color: 'grey.500'}} spacing={2} direction="row">
            <CircularProgress color="inherit"/>
          </Stack>
          <h2 className={`text-center text-white`}>ローディング中</h2>
          <p className={`w-1/3 text-center text-white`}>開くには数秒かかる場合がございます。ページを閉じないでください。</p>
        </div>
    )
}
