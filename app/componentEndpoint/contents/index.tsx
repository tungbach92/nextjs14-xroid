import React from 'react';
import HomePage from "@/app/components/Home/HomePage";
import Head from "next/head";
import {useTitle} from "@/app/hooks/useTitle";

function Contents() {
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

export default Contents;
