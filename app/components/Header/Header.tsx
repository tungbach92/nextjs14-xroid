'use client'

import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MuiAppBar, {AppBarProps as MuiAppBarProps} from "@mui/material/AppBar";
import React, {useEffect, useState} from "react";
import {styled} from "@mui/material/styles";
import {Avatar, MenuItem, Popover} from "@mui/material";
import Image from "next/image";
import axios from "axios";
import {LOGOUT_URL} from "@/app/auth/urls";
import {auth} from "@/app/configs/firebase";
import {removeLoginOrRegisterKeys} from "@/app/auth/removeLoginOrRegisterKeys";
import showAxiosError from "@/app/common/showAxiosError";
import {removeAllTokens} from "@/app/auth/removeAllTokens";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {useAtom, useAtomValue} from "jotai";
import ShareLink from "@/app/components/ShareLink";
import {selectedFolderAtom} from "@/app/store/atom/selectedFolder.atom";
import {useTitle} from "@/app/hooks/useTitle";
import SaveButton from "./SaveButton";
import {contentAtom} from "@/app/store/atom/contents.atom";
import {useChapterAtom} from "@/app/hooks/useChapterById";
import EnvButtonWithMenu from "@/app/components/EnvButton/EnvButtonWithMenu";
import {isProd, mentoroidApiClientChapterUri, plans} from "@/app/configs/constants";
import {Chapter} from "@/app/types/types";
import HistoryIcon from '@mui/icons-material/History';
import {showHistoryAtom} from "@/app/store/atom/showHistory.atom";
import {getPlanJpText} from "@/app/common/getPlanJpText";
import {CF_EMAIL, MORE_OWNERS, OWNER_EMAILS, OWNER_ID} from "@/common/ownerId";
import {getEnterprise} from "@/app/common/commonApis/enterPriseApis";
import {isEnterpriseAtom} from "@/app/store/atom/isEnterprise.atom";
import KudenUsingSetting, {Enterprise} from "./KudenUsingSetting";
import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {USER_INFO_KEY} from "@/app/lib/constants";
import store from "store";
import {onIdTokenChanged} from "@firebase/auth";
import {axiosConfigs} from "@/app/configs/axios";
import {accessTokenAtom} from "@/app/store/atom/accessToken.atom";

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({theme, open}) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: "white",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

type Props = {};

function Header({}: Props) {
  const router = useRouter();
  const query: any = useSearchParams()
  const pathname = usePathname()
  const [userInfo, setUserInfo] = useAtom(userAtomWithStorage)
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [isShare, setIsShare] = useState(false)
  const [, setSelectedFolder] = useAtom(selectedFolderAtom);
  const title = useTitle();
  const [isSaveButtonShowed, setIsSaveButtonShowed] = useState(false)
  const [isStructBtnShowed, setIsStructBtnShowed] = useState(false)
  const [showHistory, setShowHistory] = useAtom(showHistoryAtom)
  const [oldChapterId, setOldChapterId] = useState(query?.createChapter)
  // const isLocked = (userInfo?.plan === plans.at(0) || !userInfo?.plan) && !userInfo?.email?.includes(CF_EMAIL) && !OWNER_EMAILS.includes(userInfo?.email)
  const [enterprise, setEnterprise] = useState<Enterprise>({})
  const moreOwners = MORE_OWNERS.map(item => item.id)
  // @ts-ignore
  const planText = OWNER_ID === userInfo?.user_id ? getPlanJpText(plans.at(4)) :
    // @ts-ignore
    enterprise?.isEnterprise ? getPlanJpText(plans.at(3)) :
      // @ts-ignore
      moreOwners.includes(userInfo?.user_id) ? getPlanJpText(plans.at(1)) :
        getPlanJpText(userInfo?.plan)
  const [, setIsEnterprise] = useAtom(isEnterpriseAtom)
  const accessToken = useAtomValue(accessTokenAtom)

  useEffect(() => {
    const getDataEnterPrise = async () => {
      try {
        console.log(userInfo?.user_id)
        const data = await getEnterprise(userInfo?.user_id)
        console.log({data})
        setEnterprise(data)
        setIsEnterprise(data?.isEnterprise)
      } catch (e) {
        console.log(e);
      }
    }
    getDataEnterPrise()
  }, [userInfo?.user_id, accessToken])

  useEffect(() => {
    if (query?.createChapter !== oldChapterId) {
      setOldChapterId(query?.createChapter)
      setShowHistory(false)
    }
  }, [query?.createChapter])
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleShowHistory = () => {
    setShowHistory(!showHistory)
  }
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const handleLogOut = async (e) => {
    try {
      await axios.post(LOGOUT_URL);
      await auth.signOut()
      setUserInfo({})
      setSelectedFolder({id: null})
      removeAllTokens();
      removeLoginOrRegisterKeys();
      router.push("/auth/login")
    } catch (e) {
      showAxiosError(e);
      console.log(e)
    }
  };

  useEffect(() => {
    setIsSaveButtonShowed(!!query?.createChapter)
  }, [query?.createChapter])
  useEffect(() => {
    pathname && setIsStructBtnShowed(pathname.includes("/structures"))
  }, [pathname])
  return (
    <AppBar position="fixed">
      <Toolbar className={"flex justify-between"}>
        <Box className={"flex flex-row justify-center items-center gap-4"}>
          <label
            className='flex flex-wrap justify-center items-center gap-2 text-black font-bold text-lg cursor-pointer'
            onClick={() => {
              router.push('/')
            }}>
            {
              isSaveButtonShowed
                ? <>
                  <img src={'/title.png'} alt={'title-img'} className={'w-8'}/>
                  <HeaderTitle/>
                </>
                : <>
                  <img src={'/title.png'} alt={'title-img'} className={'w-8'}/>
                  {title}
                </>

            }
          </label>
        </Box>
        {
          isSaveButtonShowed &&
          <SaveButton/>
        }
        {/*{*/}
        {/*  isStructBtnShowed &&*/}
        {/*  <SaveStructBtn/>*/}
        {/*}*/}
        <div className='flex gap-5 items-center'>
          {
            // <EnvButton
            //   link={process.env.NEXT_PUBLIC_MENTOROID_API `+ '/docs'}
            // />
            !isProd()
              ? <EnvButtonWithMenu
                MenuItems={
                  [
                    <MenuItem key={"mentoroid"}
                              onClick={() => window.open(process.env.NEXT_PUBLIC_MENTOROID_API + '/docs', "_blank", 'noopener, noreferrer')}>
                      Mentoroid API
                    </MenuItem>,
                    <MenuItem key={'enecolor'}
                              onClick={() => window.open(process.env.NEXT_PUBLIC_ENECOLOR_API + '/docs', "_blank", 'noopener, noreferrer')}>
                      Enecolor API
                    </MenuItem>,
                    <MenuItem key={'MENTOROID_CONSOLE'}
                              onClick={() => window.open(process.env.NEXT_PUBLIC_MENTOROID_CONSOLE_URL, "_blank", 'noopener, noreferrer')}>
                      Mentoroid Console
                    </MenuItem>,
                    <MenuItem key={'GENIAM_CONSOLE'}
                              onClick={() => window.open(process.env.NEXT_PUBLIC_GENIAM_CONSOLE_URL, "_blank", 'noopener, noreferrer')}>
                      Geniam Console
                    </MenuItem>,
                  ]
                }
              />
              : null

          }
          {
            query?.createChapter && query?.createChapter !== 'createChapter' &&
            <div className={'cursor-pointer text-black w-10 flex justify-center'}
                 onClick={handleShowHistory}>
              <HistoryIcon/>
            </div>
          }
          {/*<LockContent isLocked={isLocked} className={'flex-row-reverse gap-0'}>*/}
          {/*  <Button className={`${isLocked && 'opacity-50'}`} onClick={() => setIsShare(!isShare)}>*/}
          {/*    <Image src='/icons/share-icon.svg' alt='share-icon' width={20} height={20}/>*/}
          {/*  </Button>*/}
          {/*</LockContent>*/}
          <div className={'text-darkBlue'}>{planText}</div>
          {
            ((isProd() && enterprise?.isEnterprise) || userInfo?.email?.includes(CF_EMAIL) || userInfo?.user_id === OWNER_ID) &&
            <KudenUsingSetting enterprise={enterprise} setEnterprise={setEnterprise}/>
          }
          <IconButton onClick={handleOpen}>
            <Avatar src={userInfo?.avatar || userInfo?.photoURL}/>
          </IconButton>
        </div>
      </Toolbar>
      {
        isShare && <ShareLink open={isShare} setOpen={setIsShare}/>
      }
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >

        <div className="flex p-3 items-center"><Avatar className={"mr-3"}
                                                       src={userInfo?.avatar || userInfo?.photoURL}/><span>{userInfo?.email}</span>
        </div>
        <div className={"h-[1px] bg-[#cccccc]"}/>
        <div
          className="flex items-center p-3 cursor-pointer hover:opacity-70"
          onClick={handleLogOut}
        >
          <Image
            src="/icons/logOut.svg"
            alt=""
            width={40}
            height={35}
            className={"mr-3"}
          /><span>ログアウト</span></div>
      </Popover>
    </AppBar>
  );
};

const HeaderTitle = () => {

  const content = useAtomValue(contentAtom);
  const [chapter] = useChapterAtom()
  const router = useRouter()
  const query: any = useSearchParams()

  const onToContent = () => {
    router.push(`/contents/${content?.id}`)
  }

  return (
    <div className="breadcrumbs text-sm">
      <ul className={'m-0'}>
        {/* append content thumbnail */}

        <li onClick={onToContent}>
          <a className={'flex gap-1'}>
            {content?.thumbnail &&
              <img src={content.thumbnail} width={40} height={'auto'} alt={'content'}/>}
            <div className={'truncate max-w-[150px]'}>
              {content?.title}
            </div>
          </a>
        </li>
        <li>
          <div className={'flex flex-col'}>
            {
              query?.createChapter !== 'createChapter' ?
                chapter?.title : null
            }

            {!isProd() && query?.createChapter !== 'createChapter' ?
              <div className={'flex flex-col'}>
                <ChapterUrlComponent chapter={chapter} blocks={false}/>
                <ChapterUrlComponent chapter={chapter} blocks={true}/>
              </div> : null
            }
          </div>
        </li>
      </ul>
    </div>
  )
}

const ChapterUrlComponent = ({chapter, blocks = false}: { chapter: Chapter, blocks?: boolean }) => {
  const path = chapter.id + (blocks ? '/blocks' : '');
  const open = (link) => {
    window.open(link, '_blank', 'noopener, noreferrer')
  }
  return (
    <span className={"hover:underline hover:cursor-pointer"}
          onClick={() => open(mentoroidApiClientChapterUri(path))}
    >
      {path}
    </span>
  )
}

export default React.memo(Header);

