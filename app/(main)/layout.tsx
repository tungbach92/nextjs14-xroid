
// These styles apply to every route in the application
import '@/app/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, {ReactNode} from 'react';
import MainPageLayout from "@/app/components/Layout/MainPageLayout";
import {Metadata} from "next";
import {axiosConfigs} from "@/app/configs/axios";
import {onIdTokenChanged} from "@firebase/auth";
import {auth} from "@/app/configs/firebase";
import store from "store";
import {ACCESS_TOKEN_KEY} from "@/app/configs/constants";

type Props = {
  children: ReactNode,
}

function MainLayout({children}: Props) {
  return (
    <html lang="en">
    <body>
      <MainPageLayout>
        {children}
      </MainPageLayout>
    </body>
    </html>
  );
}

export default MainLayout;
