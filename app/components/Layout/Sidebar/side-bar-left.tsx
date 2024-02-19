'use client'
import {Button, Divider, IconButton, List} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import {CSSObject, styled, Theme} from "@mui/material/styles";
import React, {ReactNode, useEffect, useState} from "react";
import {navSidebar} from "@/app/common/data/ScenarioData";
import {useAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {topLeftMenuOpen} from "@/app/store/atom/useTopLeftMenuOpen";
import DialogCustom from "@/app/components/DialogCustom";
import InputCustom from "@/app/components/DialogCustom/InputCustom";
import {handleUploadFile} from "@/app/common/uploadImage/handleUploadFile";
import CircularProgress from "@mui/material/CircularProgress";
import {toast} from "react-toastify";
import useStudio from "@/app/hooks/useStudios";
import isURL from "validator/lib/isURL";
import {KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight} from "@mui/icons-material";
import {isCF, isProd, isSuperAdmin, plans} from "@/app/configs/constants";
import {CF_EMAIL, OWNER_EMAILS} from "@/common/ownerId";
import EditIcon from '@mui/icons-material/Edit';
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Studio} from "@/app/types/types";
import MenuItem from "@/app/components/Layout/MenuItem/MenuItem";
import useMeasure from "react-use-measure";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({theme, open}) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ".MuiDrawer-paper": {
    paddingTop: 56,
    [theme.breakpoints.up("sm")]: {
      paddingTop: 64,
    },
  },
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

type Props = {
  children?: ReactNode;
  setFullWidth?: React.Dispatch<React.SetStateAction<boolean>>
};


const Sidebar = ({children}: Props) => {
  const [open, setOpen] = useAtom(topLeftMenuOpen)
  const [userInfo] = useAtom<any>(userAtomWithStorage);
  const {studio, loading} = useStudio(userInfo?.user_id)
  const [isOpen, setIsOpen] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [loadingImage, setLoadingImage] = useState(false)
  const fullName = (userInfo?.first_name && userInfo?.last_name) ? (userInfo.last_name + " " + userInfo.first_name) : (userInfo?.first_name || userInfo?.last_name)
  const hiddenTab = ['バナー&ポップアップ', 'カテゴリー']
  const isLocked = (userInfo?.plan === plans.at(0) || !userInfo?.plan) && !userInfo?.email?.includes(CF_EMAIL) && !OWNER_EMAILS.includes(userInfo?.email)
  const queryClient = useQueryClient()
  const [leftRef, {width: leftWidth}] = useMeasure();

  const handleChange = async (e) => {
    if (e.target.files.length === 0) return
    setLoadingImage(true)
    const url = await handleUploadFile(e.target.files[0], userInfo.id)
    setAvatar(url)
    setLoadingImage(false)
  }

  useEffect(() => {
    setAvatar(studio?.avatar || '/icons/no-image-free.png')
    setAuthorName(studio?.authorName || fullName)
    setCompanyName(studio?.name ?? '')
  }, [studio]);
  const handleClose = () => {
    setAvatar(studio?.avatar || '/icons/no-image-free.png')
    setAuthorName(studio?.authorName || fullName)
    setCompanyName(studio?.name ?? '')
  }

  //useMutation, invalidateQueries
  const {mutate: updateStudio, isPending} = useMutation(
    {
      mutationFn: async (newStudio: Studio) => await updateStudio(newStudio),
      onSuccess: () => {
        toast.success('スタジオの更新が成功しました。')
        setIsOpen(false)
        queryClient.invalidateQueries({
          queryKey: ['ownerStudios']
        })
      },
      onError: (e) => {
        toast.error('スタジオの更新が失敗しました。')
        setIsOpen(true)
      }
    }
  )

  const handleUpdateStudio = async () => {
    if (!companyName || !avatar)
      return toast.error('空白にすることはできません')
    updateStudio(({
      name: companyName,
      authorName: authorName,
      avatar: avatar
    }))
  }

  const handleShowSideBar = () => {
    setOpen(!open)
  }

  let anDomName = isLocked ? 'スタジオ名追加' : 'Andom'
  let anDomLogo = isLocked ? '/icons/no-image-free.png' : '/images/logo.png'

  return (
    <div className='mt-16' ref={leftRef}>
      <Drawer
        variant="permanent"
        open={open}
        className='hidden md:flex'
      >
        <Divider/>
        <div className={`text-black items-center p-3 pb-0`}>
          <IconButton onClick={handleShowSideBar} sx={{padding: '0px'}} className={'flex-1'}>
            {open ? <KeyboardDoubleArrowLeft/> :
              <KeyboardDoubleArrowRight/>}
          </IconButton>
          {
            loading ? <div className='flex items-center justify-center w-full my-8'><CircularProgress/></div> :
              <div className='flex flex-col gap-4 items-center'>
                <Button className='' onClick={() => setIsOpen(true)}>
                  <img className={!open ? 'w-[60px]' : 'w-full'} alt={'logo'}
                       src={studio?.avatar ? studio?.avatar : anDomLogo}/>
                </Button>
                <div
                  onClick={() => setIsOpen(true)}
                  className={`flex items-center font-bold text-center transition cursor-pointer ${
                    open ? "mt-2 mb-4 opacity-100 text-[20px]" : "mt-0 mb-0 opacity-0 text-[0px]"
                  }`}
                >
                  {studio?.name ? studio?.name : anDomName}
                  {
                    isLocked && !studio?.name &&
                    <EditIcon/>
                  }
                </div>
              </div>
          }
          <DialogCustom
            disable={!isURL(avatar) || !companyName || !authorName || (avatar === studio?.avatar && companyName === studio?.name && authorName === studio?.authorName)}
            open={isOpen}
            setOpen={setIsOpen}
            title='スタジオの設定'
            onClick={handleUpdateStudio}
            onClose={handleClose}
            loading={isPending}
          >
            <div className='flex flex-col items-center justify-center gap-4 w-full md:px-16'>
              <div
                className='relative h-[180px] w-[160px] border border-dashed flex flex-col items-center justify-center rounded-md overflow-hidden'>
                <Button
                  color="primary"
                  aria-label="upload picture"
                  component="label"
                >
                  <input hidden accept="image/*" type="file" onChange={handleChange}/>
                  {
                    loadingImage ? <CircularProgress/> :
                      <img className='object-contain w-[140px]' src={avatar} alt={'noImage'}/>
                  }
                </Button>
              </div>
              <InputCustom
                placeholder={'スタジオ名を入力してください。'}
                className='flex-col w-full'
                title='スタジオ名'
                value={companyName}
                setValue={setCompanyName}
              />
              <InputCustom
                placeholder={'著者名を入力してください。'}
                className='flex-col w-full'
                title='著者名'
                value={authorName}
                setValue={setAuthorName}
              />
            </div>
          </DialogCustom>
          {/*<div className={`text-center transition ${open ? "opacity-100 text-[20px]" : "opacity-0 text-[0px]"}`}>*/}
          {/*ダッシュボード*/}
          {/*</div>*/}
        </div>
        <List
          sx={{width: "100%", maxWidth: 360, bgcolor: "background.paper", paddingTop: "8px"}}
          component="nav"
          aria-labelledby="nested-list-subheader"
          className={`${open ? "open" : "no-open px-1"}`}
        >
          {
            // (navSidebar && isProd && emailProd) || (navSidebar && !isProd && isCF(userInfo)) &&
            navSidebar?.map((item, index: any) => {
              if (isProd() && !(isCF(userInfo) || isSuperAdmin(userInfo)) && hiddenTab.includes(item.name)) return null;
              return <MenuItem key={index} icon={item.icon} path={item.path} name={item.name} open={open}/>;
            })
          }
          {children}
        </List>
      </Drawer>
      {
        open &&
        <div className='fixed top-0 right-0 left-0 bottom-0 bg-black/30 z-20 md:hidden'
             onClick={() => setOpen(false)}>
          <div className='z-30 bg-white w-[300px] h-full'>
            <div className={`text-black items-center p-3 pt-20`}>
              {
                loading ? <div className='flex items-center justify-center w-full my-8'><CircularProgress/></div> :
                  <div className='flex flex-col gap-4 items-center'>
                    <Button className='' onClick={() => setIsOpen(true)}>
                      <img className="w-full" src={studio?.avatar ? studio?.avatar : anDomLogo} alt={'avatar'}/>
                    </Button>
                    <div
                      onClick={() => setIsOpen(true)}
                      className={`font-bold text-center transition cursor-pointer ${
                        open ? "mt-2 mb-4 opacity-100 text-[20px]" : "mt-0 mb-0 opacity-0 text-[0px]"
                      }`}
                    >
                      {studio?.name ? studio?.name : anDomName}
                    </div>
                  </div>
              }
              <DialogCustom
                disable={!isURL(avatar) || !companyName || !authorName || (avatar === studio?.avatar && companyName === studio?.name && authorName === studio?.authorName)}
                open={isOpen}
                setOpen={setIsOpen}
                title='スタジオの設定'
                onClick={handleUpdateStudio}
                onClose={handleClose}
                loading={isPending}
              >
                <div className='flex flex-col items-center justify-center gap-4 w-full md:px-16'>
                  <div
                    className='relative h-[180px] w-[160px] border border-dashed flex flex-col items-center justify-center rounded-md overflow-hidden'>
                    <Button
                      color="primary"
                      aria-label="upload picture"
                      component="label"
                    >
                      <input hidden accept="image/*" type="file" onChange={handleChange}/>
                      {
                        loadingImage ? <CircularProgress/> :
                          <img className='object-contain w-[140px]' src={avatar} alt={'avatar'}/>
                      }
                    </Button>
                  </div>
                  <InputCustom
                    className='flex-col w-full'
                    title='スタジオ名'
                    value={companyName}
                    setValue={setCompanyName}
                  />
                  <InputCustom
                    className='flex-col w-full'
                    title='著者名'
                    value={authorName}
                    setValue={setAuthorName}
                  />
                </div>
              </DialogCustom>
              {/*<div className={`text-center transition ${open ? "opacity-100 text-[20px]" : "opacity-0 text-[0px]"}`}>*/}
              {/*ダッシュボード*/}
              {/*</div>*/}
            </div>
            <List
              sx={{width: "100%", maxWidth: 360, bgcolor: "background.paper", paddingTop: "8px"}}
              component="nav"
              aria-labelledby="nested-list-subheader"
              className={`${open ? "open" : "no-open px-1"}`}
            >
              {
                navSidebar?.map((item, index: any) => {
                  if (isProd() && !(isCF(userInfo) || isSuperAdmin(userInfo)) && hiddenTab.includes(item.name)) return null;
                  return <MenuItem key={index} icon={item.icon} path={item.path} name={item.name} open={open}/>;
                })
              }
              {children}
            </List>
          </div>
        </div>
      }
    </div>
  );
};

export default React.memo(Sidebar);
