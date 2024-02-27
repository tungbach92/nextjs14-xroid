'use client'
import '@/app/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {PropsWithChildren, useEffect} from "react";
import {Metadata} from "next";
import {axiosConfigs} from "@/app/configs/axios";
import {useAtom, useAtomValue} from "jotai";
import {accessTokenAtom} from "@/app/store/atom/accessToken.atom";
import {onAuthStateChanged} from "@firebase/auth";
import {auth} from "@/app/configs/firebase";

interface Props extends PropsWithChildren {
}

function LoginLayout({children}: Props) {
  const [accessToken, setAccessToken] = useAtom(accessTokenAtom)
  useEffect(() => {
    onAuthStateChanged(auth,
      async (user) => {
        // @ts-ignore
        setAccessToken(user.accessToken)
      })
  },[])
  return (
    <html lang="en">
    <body>
    <div className='w-full h-full bg-gray-200'>
      {children}
    </div>
    </body>
    </html>

  );
}

export default LoginLayout;

