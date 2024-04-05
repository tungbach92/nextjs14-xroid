'use client'

import React, {ReactNode, useEffect} from 'react';
import Header from "@/app/components/Header/Header";
import SideBarLeft from "@/app/components/Layout/Sidebar/side-bar-left";
import {QueryClientProvider} from "@tanstack/react-query";
import {QueryClient} from "@tanstack/react-query";
import {ToastContainer} from "react-toastify";
import {axiosConfigs} from "@/app/configs/axios";
import {useAtom, useAtomValue} from "jotai";
import {accessTokenAtom} from "@/app/store/atom/accessToken.atom";
import {onAuthStateChanged, onIdTokenChanged} from "@firebase/auth";
import {auth} from "@/app/configs/firebase";
import store from "store";
import {ACCESS_TOKEN_KEY, COOKIE_GENIAM_ACCESS_TOKEN_KEY} from "@/app/configs/constants";
import Cookies from "js-cookie";
import {revalidatePath} from "next/cache";
import {useRouter} from "next/navigation";

type Props = {
  children: ReactNode,
}
const queryClient = new QueryClient()
axiosConfigs()
const isProd = process.env.NEXT_PUBLIC_APP_ENV === 'production'
const domain = isProd ? '.geniam.com' : null
const expires = 365 //days

function setCookie(name, value, options = {}) {
  if (!value) return
  return Cookies.set(name, value, {domain, expires, ...options})
}

function MainPageLayout({children}: Props) {
  const [accessToken, setAccessToken] = useAtom(accessTokenAtom)
  const router = useRouter();
  useEffect(() => {
    onAuthStateChanged(auth,
      async (user) => {
        // @ts-ignore
        setAccessToken(user.accessToken)
        // @ts-ignore
        setCookie(COOKIE_GENIAM_ACCESS_TOKEN_KEY, user.accessToken)
        router.refresh();
      })
  }, [])
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
