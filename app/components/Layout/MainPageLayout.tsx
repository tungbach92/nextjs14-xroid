'use client'

import React, {ReactNode} from 'react';
import useMeasure from "react-use-measure";
import Header from "@/app/components/Header/Header";
import SideBarLeft from "@/app/components/Layout/Sidebar/side-bar-left";
import {QueryClientProvider} from "@tanstack/react-query";
import {QueryClient} from "@tanstack/react-query";
import {ToastContainer} from "react-toastify";
import {axiosConfigs} from "@/app/configs/axios";

type Props = {
  children: ReactNode,
}
const queryClient = new QueryClient()
axiosConfigs();

function MainPageLayout({children}: Props) {
  return (
    <div className='bg-white h-full relative'>
      <Header/>
      <QueryClientProvider client={queryClient}>
        <div className='flex flex-row w-full'>
          <SideBarLeft/>
          <div className='flex-1 bg-gray-100 pt-16 min-h-screen h-full w-full'>
            {children}
          </div>
        </div>
      </QueryClientProvider>
      <ToastContainer/>
    </div>
  )
    ;
}

export default MainPageLayout;
