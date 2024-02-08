import {Button, Tab, Tabs} from "@mui/material";
import React, {useEffect, useState} from "react";
import BannerUploadPopUp from "@/app/components/bannerPopup/bannerUploadPopUp";
import {
  createBanner,
  createPopup,
  deleteBanner,
  deletePopup,
  updateBanner,
  updatePopup
} from "@/app/common/commonApis/bannerAndUploadApis";
import {toast} from "react-toastify";
import {handleUploadFile} from "@/app/common/uploadImage/handleUploadFile";
import useAdminPopups from "@/app/hooks/useAdminPopups";
import {usePopup} from "@/app/store/atom/popups.atom";
import useAdminBanners from "@/app/hooks/useAdminBanners";
import {useBanner} from "@/app/store/atom/banners.atom";
import Popup from "@/app/componentEndpoint/bannerPopup/Popup";
import {BannerData, PopupData} from "@/app/types/types";
import Banner from "@/app/componentEndpoint/bannerPopup/Banner";
import {useAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";

const pattern = /^(https?:\/\/)/i;
export default function BannerPopup() {
  useAdminPopups()
  useAdminBanners()
  const [imagePopupData, setImagePopupData] = useState<PopupData[]>([])
  const [adminPopup,] = usePopup();
  const [imageBannerData, setImageBannerData] = useState<BannerData[]>([])
  const [adminBanner,] = useBanner();
  const [tabValue, setTabValue] = useState<number>(0)
  const [image, setImage] = useState<string>('')
  const [openPopup, setOpenPopup] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [titleButton, setTitleButton] = useState<string>('')
  const [text, setText] = useState<string>('')
  const [pageUrl, setPageUrl] = useState<string>('')
  const [itemEdit, setItemEdit] = useState<PopupData | BannerData>(null)
  const [isError, setIsError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [userInfo] = useAtom(userAtomWithStorage);

  useEffect(() => {
    if (tabValue === 0) {
      setImageBannerData(adminBanner || [])
    } else {
      setImagePopupData(adminPopup || [])
    }
  }, [tabValue, adminPopup, adminBanner]);

  const handleChangeTitle = (e) => {
    if (e.target.value.length > 20) {
      toast.error('最大20文字を入力してください。')
      return
    }
    setTitle(e.target.value)
  }

  const handleChangeTitleButton = (e) => {
    if (e.target.value.length > 20) {
      toast.error('最大20文字を入力してください。')
      return
    }
    setTitleButton(e.target.value)
  }

  const handleChangeText = (e) => {
    if (e.target.value.length > 140) {
      toast.error('最大140文字を入力してください。')
      return
    }
    setText(e.target.value)
  }

  const validateLink = (link: string) => {
    setIsError(false)
    const regex = new RegExp(pattern)
    if (!regex.test(link))
      setIsError(true)
  }

  const handleChangeLink = (e) => {
    setPageUrl(e.target.value.trim())
    validateLink(e.target.value.trim())
  }

  const handleUploadFiles = async () => {
    const maxIndex = imageBannerData?.length || 0
    const dataBanner = {
      url: image ?? '',
      pageUrl: pageUrl ?? '',
      index: maxIndex,
      userId: userInfo?.user_id
    }
    const maxIndexPopup = imagePopupData?.length || 0
    const dataPopup = {
      title: title?.trim() ?? '',
      url: image ?? '',
      text: text?.trim() ?? '',
      pageUrl: pageUrl?.trim() ?? '',
      titleButton: titleButton?.trim() ?? '',
      userId: userInfo?.user_id,
      index: maxIndexPopup,
    }
    const regex = new RegExp(pattern)

    try {
      switch (tabValue) {
        case 0:
          if (!itemEdit) {
            if (regex.test(pageUrl)) {
              if (!dataBanner.url) {
                toast.error('画像をアップロードしてください。')
              } else {
                await createBanner(dataBanner)
                toast.success('バナー作成完了')
                setOpenPopup(false)
                setPageUrl('')
                setImage('')
              }
            } else {
              setIsError(true)
            }
          } else {
            if (regex.test(pageUrl)) {
              await updateBanner({...itemEdit, ...dataBanner})
              toast.success('バナー編集完了')
              setPageUrl('')
              setImage('')
              setOpenPopup(false)
            } else {
              setIsError(true)
            }
          }
          break;
        case 1:
          if (!itemEdit) {
            if (!dataPopup.url) {
              toast.error('画像をアップロードしてください。')
            } else if (!dataPopup.title) {
              toast.error('タイトルを入力してください。')
            } else if (!dataPopup.titleButton) {
              toast.error('ボタンの文字を入力してください。')
            } else if (!regex.test(dataPopup.pageUrl)) {
              toast.error('URL を入力してください。')
            } else {
              await createPopup(dataPopup)
              toast.success('ポップアップ作成完了')
              setText('')
              setTitle('')
              setImage('')
              setPageUrl('')
              setTitleButton('')
              setOpenPopup(false)
            }
          } else {
            if (!regex.test(dataPopup.pageUrl)) {
              setIsError(true)
            } else {
              await updatePopup({...itemEdit, ...dataPopup})
              toast.success('ポップアップ編集完了')
              setText('')
              setTitle('')
              setImage('')
              setPageUrl('')
              setOpenPopup(false)
            }
          }
      }
    } catch (e) {
      console.log(e)
    } finally {
      setItemEdit(null)
    }
  }

  const handleChangeImage = async (e) => {
    const file = e.target.files[0]
    if (image) setImage('')
    try {
      if (!file) return
      setLoading(true)
      await handleUploadFile(file, 'bannerPopup').then((url) => {
        setImage(url)
        if (tabValue === 0) {
          setImageBannerData([...imageBannerData])
        } else {
          setImagePopupData([...imagePopupData])
        }
      })
    } catch (e) {
      console.log(e);
    } finally {
      setOpenPopup(true)
      setLoading(false)
    }
  }

  const onOpenLink = (url) => {
    window.open(url)
  }

  const handleDelete = async (item) => {
    const deleteId = item.id as string
    try {
      if (tabValue === 0) {
        await deleteBanner(deleteId)
        toast.success('バナー削除完了')
        setIsOpen(false)
      }
      if (tabValue === 1) {
        await deletePopup(deleteId)
        toast.success('ポップアップ削除完了')
        setIsOpen(false)
      }
    } catch (e) {
      console.log(e);
      toast.error('エラーが発生しました。もう一度お試しください。')
      setIsOpen(true)
    }
  }

  const onEdit = (item) => {
    setItemEdit(item)
    setOpenPopup(true)
    setImage(item.url)
    setTitle(item?.title)
    setPageUrl(item.pageUrl)
    setTitleButton(item.titleButton)
    setText(item.text)
  }

  const onchangeHide = async (item) => {
    const editBanner = {
      ...item,
      isHidden: !item.isHidden
    }
    try {
      if (tabValue === 0) {
        await updateBanner(editBanner)
      } else if (tabValue === 1) {
        await updatePopup(editBanner)
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className={`max-w-[690px] min-h-[3px] bg-white mt-6 mx-3 p-0 md:ml-6`}>
      <Tabs value={tabValue}
            onChange={(event: any, newValue: any) => {
              setTabValue(newValue)
            }}
            aria-label="anim_tab"
            variant={'scrollable'}
      >
        <Tab value={0} label="バナー"/>
        <Tab value={1} label="ポップアップ"/>
      </Tabs>
      <hr className={`-mt-0.5`}/>
      <div className={'p-6'}>
        <div className={'flex justify-start items-start'}>
          <Button
            className={'max-h-[40px]'}
            variant="contained"
            component="label"
            startIcon={<img src={'/images/addImageIcon.svg'} alt={''}/>}
            onClick={() => setOpenPopup(true)}
          >
            より多くの写真
          </Button>
          {tabValue === 0 && (
            <div className={'ml-6 text-xs text-[#9B9B9B]'}>バナーのサイズ推奨<br/>
              <span className="h-[5px] w-[5px] bg-[#9B9B9B] rounded-[50%] inline-block mx-3"></span>バナーに設定するすべての画像のサイズは同じで<br/>
              <span className="h-[5px] w-[5px] bg-[#9B9B9B] rounded-[50%] inline-block mx-3"></span>縦＝横 x 0.6にしてください。
            </div>
          )}
        </div>
        {
          tabValue === 0 ?
            <Banner
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              imageBannerData={imageBannerData}
              openLink={onOpenLink}
              onChangeHidden={onchangeHide}
              handleDelete={handleDelete}
              handleEdit={onEdit}
            />
            :
            <Popup
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              imagePopupData={imagePopupData}
              openLink={onOpenLink}
              onChangeHidden={onchangeHide}
              handleDelete={handleDelete}
              handleEdit={onEdit}
            />
        }
      </div>
      {
        <BannerUploadPopUp
          loading={loading}
          isError={isError}
          setIsError={setIsError}
          setText={setText}
          setImage={setImage}
          setTitle={setTitle}
          setPageUrl={setPageUrl}
          setTitleButton={setTitleButton}
          open={openPopup}
          setOpen={setOpenPopup}
          title={`${tabValue === 0 ? 'バナー追加' : 'ポップアップ追加'}`}
          isPopup={tabValue === 1}
          image={image}
          onClick={handleUploadFiles}
          handleChangeLink={(e) => handleChangeLink(e)}
          handleChangeTitle={(e) => handleChangeTitle(e)}
          handleChangeText={(e) => handleChangeText(e)}
          handleChangeTitleButton={(e) => handleChangeTitleButton(e)}
          popupTitle={title}
          popupText={text}
          popupLink={pageUrl}
          titleButton={titleButton}
          handleChangeImage={handleChangeImage}
          setItemEdit={setItemEdit}
        />
      }
    </div>
  )
}
