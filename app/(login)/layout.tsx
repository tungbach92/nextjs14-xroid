import '@/app/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {PropsWithChildren} from "react";
import {Metadata} from "next";
import {axiosConfigs} from "@/app/configs/axios";

interface Props extends PropsWithChildren {
}

const title: string = process.env.NEXT_PUBLIC_APP_ENV === 'production' ? 'Xroid Studio β' : process.env.NEXT_PUBLIC_APP_ENV === 'stg' ? '[stg] Xroid Studio β' : '[dev] Xroid Studio β'
export const metadata: Metadata = {
  metadataBase: new URL('https://xroidstudio.geniam.com'),
  openGraph: {
    title: title,
    description: 'メントロイドアドミン',
    siteName: 'ロゴとxroid studio',
    type: 'website',
    // url: 'https://nextjs.org',
    // images: [
    //   {
    //     url: 'https://nextjs.org/og.png', // Must be an absolute URL
    //     width: 800,
    //     height: 600,
    //   },
    //   {
    //     url: 'https://nextjs.org/og-alt.png', // Must be an absolute URL
    //     width: 1800,
    //     height: 1600,
    //     alt: 'My custom alt',
    //   },
    // ],
    // locale: 'en_US',
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/xRoidFavicon.ico',
    // shortcut: '/shortcut-icon.png',
    // apple: '/apple-icon.png',
    // other: {
    //   rel: 'apple-touch-icon-precomposed',
    //   url: '/apple-touch-icon-precomposed.png',
  },
  // manifest: 'https://nextjs.org/manifest.json',
  // twitter: {},
  // verification: {},
  // itunes:{},
  // appleWebApp:{},
  // alternates:{},
  // appLinks:{},
  // archives:{},
  // assets: ['https://nextjs.org/assets'],
  // bookmarks: ['https://nextjs.org/13'],
  // category: 'technology',
  // other: {
  //   custom: 'meta',
  // },
}
axiosConfigs();

function BlankRootLayout({children}: Props) {
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

export default BlankRootLayout;

