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
import {COOKIE_GENIAM_ACCESS_TOKEN_KEY} from "@/app/configs/constants";
import Cookies from "js-cookie";
import {revalidatePath} from "next/cache";
import {useRouter} from "next/navigation";

interface Props extends PropsWithChildren {
}

const isProd = process.env.NEXT_PUBLIC_APP_ENV === 'production'
const domain = isProd ? '.geniam.com' : null
const expires = 365 //days

function setCookie(name, value, options = {}) {
  if (!value) return
  return Cookies.set(name, value, {domain, expires, ...options})
}


function LoginLayout({children}: Props) {
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
    <div className='w-full h-full bg-gray-200'>
      {children}
    </div>
  );
}

export default LoginLayout;

