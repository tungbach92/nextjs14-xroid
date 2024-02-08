'use client'

import {useTitle} from "@/app/hooks/useTitle";
import Head from "next/head";
import HomePage from "@/app/components/Home/HomePage";
import React from "react";
import {Metadata} from "next";

// export const metadata: Metadata = {
//   title: 'Invoices',
// };

export default function ContentsPage() {
  const title = useTitle();
  return (
    <>
      <Head>
        <title>{title} - Content</title>
      </Head>
      <HomePage/>
    </>
  );
}
