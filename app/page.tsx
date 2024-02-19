'use client'

import '@/app/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import type {ReactElement, ReactNode} from 'react'
import React, {useEffect, useState} from "react";
import type {Metadata, NextPage} from 'next'
import type {AppProps} from 'next/app'
import {axiosConfigs} from "@/app/configs/axios";
import {onAuthStateChanged} from "@firebase/auth";
import {auth} from "@/app/configs/firebase";
import {usePathname, useRouter} from "next/navigation";
import {ToastContainer} from "react-toastify";
import {LoadingPageCustom} from "@/app/components/custom/LoadingPageCustom";
import {useAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {useTitle} from "@/app/hooks/useTitle";
import Head from "next/head";
import {CF_EMAIL, OWNER_EMAILS} from "@/common/ownerId";
import {QueryClient, QueryClientProvider,} from '@tanstack/react-query'



const unAuthRoute = ["/auth/register", '/auth/login', '/auth/passwordRetrieval']
const unCheckAuthRoute = ["/auth/register", '/auth/passwordRetrieval']
const adminPermissionRoute = ["/categories", "/bannerPopup"]

function Page() {
  const router = useRouter()
  const pathName = usePathname()
  const isProd = process.env.NEXT_PUBLIC_APP_ENV === 'production'
  const [userInfo] = useAtom<any>(userAtomWithStorage);
  const [user, setUser] = useState(null)

  useEffect(() => {
    router.push("/contents")
  }, [])

  useEffect(() => {
    if (isProd && pathName && userInfo.email && !(OWNER_EMAILS.includes(userInfo?.email) || userInfo?.email.includes(CF_EMAIL)) && adminPermissionRoute.includes(pathName)) {
      router.back()
    }
    if (!isProd && pathName && userInfo.email && !userInfo?.email.includes(CF_EMAIL) && adminPermissionRoute.includes(pathName)) {
      router.back()
    }
  }, [isProd, userInfo.email]);

  useEffect(() => {
    // if keydown is Command+S or Ctrl+S, prevent default behavior
    const keydownHandler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
      }
    }
    window.addEventListener('keydown', keydownHandler);
    return () => {
      window.removeEventListener('keydown', keydownHandler);
    }
  }, [])


  useEffect(() => {
    return onAuthStateChanged(auth,
      (user) => {
        if (!user && pathName && !unCheckAuthRoute.includes(pathName)) {
          router.push('/login')
        }
        // @ts-ignore
        setUser(user)
        // router web from deeplink
        if (window) {
          const host = process.env.NEXT_PUBLIC_WEB_APP
          if (window.location.href.includes('chapterPage')) {
            let url = new URL(window.location.href);
            const contentId = url.searchParams.get("contentId");

            // v1: redirect to content page on XRoid web
            // if (contentId) router.push(`/contents/${contentId}`)

            // redirect to content page Roid web app
            // ex: https://roidemia.geniam.com/home/chapter/content_kRMYpe1b0t
            if (contentId) router.push(`${host}/home/chapter/${contentId}`)
            return
          }
          if (window.location.href.includes('conversation')) {
            let url = new URL(window.location.href);
            const contentId = url.searchParams.get("contentId");
            const chapterId = url.searchParams.get("chapterId");

            // v1: redirect to chapter page on XRoid web
            // if (contentId && chapterId) router.push(`/contents/${contentId}/${chapterId}`)

            // redirect to chapter page Roid web app
            // ex: https://roidemia.geniam.com/home/chapter/content_kRMYpe1b0t/conversation/chapter_q3O6TGWS
            if (contentId && chapterId) router.push(`${host}/home/chapter/${contentId}/conversation/${chapterId}`)
            if (contentId && !chapterId) router.push(`${host}/home/chapter/${contentId}`)
            return
          }
          if (window.location.href.includes('contentId=')) {
            const pattern = /contentId=(\w+)/;
            const match = window.location.href.match(pattern);
            if (match) {
              const extractedContentId = match[1];
              if (extractedContentId) router.push(`/contents/${extractedContentId}`)
            }
          }
        }
      }
    );
  }, [])


  // if (!user && !unAuthRoute.includes(pathName)) return <LoadingPageCustom/>
  return <LoadingPageCustom/>
}

export default Page
