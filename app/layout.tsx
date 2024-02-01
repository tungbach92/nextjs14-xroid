import "@/app/ui/global.css"
import '@/app/ui/home.module.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import Head from "next/head";
import Header from "@/app/components/Header";
import SideBarLeft from "@/app/components/SideBarLeft";
import HeaderTitle from "@/app/components/HeaderTitle";

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // return (
  //   <html lang="en">
  //     <body className={`${inter.className} antialiased`}>{children}</body>
  //   </html>
  // );
  return (
      <div className=''>
        <Head>
          <title>Pesudo title</title>
          {/*<meta name="description" content="Next-js structure by ClassFunc JSC"/>*/}
          <link rel="icon" href="/xRoidFavicon.ico"/>
        </Head>
        <div className='bg-white h-full relative'>
          <Header headerTitle={<HeaderTitle/>}/>
          <div className='flex flex-row w-full'>
            <div className='mt-16'
                 // ref={leftRef}
            >
              <SideBarLeft/>
            </div>
            <div className='flex-1 bg-gray-100 pt-16 min-h-screen h-full w-full'>
              {children}
            </div>
          </div>
        </div>
      </div>
  )
}
