'use client'

import React, {ReactNode} from 'react';
import Head from "next/head";
import useMeasure from "react-use-measure";
import {useTitle} from "@/app/hooks/useTitle";
import Header from "@/app/components/Header/Header";
import SideBarLeft from "@/app/components/Layout/Sidebar/side-bar-left";
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";
import {ToastContainer} from "react-toastify";
import Layout from "@/app/components/Layout/Layout";
// These styles apply to every route in the application
import '@/app/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type Props = {
  children: ReactNode,
}
const queryClient = new QueryClient()

function RootLayout({children}: Props) {
  // @ts-ignore
  const [leftRef, {width: leftWidth}] = useMeasure();
  const title = useTitle();
  const metaSettings = [
    {
      name: "description",
      content: "メントロイドアドミン"
    }, {
      property: "og:site_name",
      content: "ロゴとxroid studio"
    }, {
      property: "og:type",
      content: "website"
    }
  ]
  return (
    <html lang="en">
    <QueryClientProvider client={queryClient}>
      <Layout>
        {children}
      </Layout>
    </QueryClientProvider>
    <ToastContainer/>
    </html>
  );
}

export default RootLayout;
