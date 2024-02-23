import HomePage from "@/app/components/Home/HomePage";
import React from "react";
import {Metadata} from "next";

const title: string = process.env.NEXT_PUBLIC_APP_ENV === 'production' ? 'Xroid Studio β' : process.env.NEXT_PUBLIC_APP_ENV === 'stg' ? '[stg] Xroid Studio β' : '[dev] Xroid Studio β'

export const metadata: Metadata = {
  openGraph: {
    title: `${title} - Content`,
  }
}
export default function ContentsPage() {
  console.log('ContentsPage')
  return (
    <HomePage/>
  );
}
