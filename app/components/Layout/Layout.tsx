import React, {ReactNode} from 'react';
import Head from "next/head";
import useMeasure from "react-use-measure";
import {useTitle} from "@/app/hooks/useTitle";
import Header from "@/app/components/Header/Header";
import SideBarLeft from "@/app/components/Layout/Sidebar/side-bar-left";

type Props = {
  children: ReactNode,
}

function Layout({children}: Props) {
  // @ts-ignore
  const [leftRef, {width: leftWidth}] = useMeasure();
  const title = useTitle();

  return (
    <div className=''>
      <Head>
        <title>{title}</title>
        {/*<meta name="description" content="Next-js structure by ClassFunc JSC"/>*/}
        <link rel="icon" href="/xRoidFavicon.ico"/>
      </Head>
      <div className='bg-white h-full relative'>
        <Header/>
        <div className='flex flex-row w-full'>
          <div className='mt-16' ref={leftRef}>
            <SideBarLeft/>
          </div>
          <div className='flex-1 bg-gray-100 pt-16 min-h-screen h-full w-full'>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
