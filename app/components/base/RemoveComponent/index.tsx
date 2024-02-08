import React, {useState} from 'react';
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {deleteContent} from "@/app/common/commonApis/contentsApi";
import {toast} from "react-toastify";
import {BaseDeleteModal} from "@/app/components/base";
import {Button} from "@mui/material";
import {useRouter} from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import AddBannerDialog from "@/app/components/Home/ContentLayout/AddBannerDialog";
import {LockContent} from "@/app/components/base/lockContent/LockContent";
import {useAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {plans} from '@/app/configs/constants';
import {CF_EMAIL, OWNER_EMAILS, OWNER_ID} from "../../../../common/ownerId";
import ListButtonAddNewTypeOfChapter from "@/app/components/Content/custom/ListButtonAddNewTypeOfChapter";
import {chapterIndex} from "@/app/common/getMaxChapterIndex";
import {isEnterpriseAtom} from "@/app/store/atom/isEnterprise.atom";
import {getPlanJpText} from "@/app/common/getPlanJpText";

type Props = {
  title?: string,
  contentId?: string
  subFolder?: boolean
  subFolderId?: string
  chapters?: any[]
}

function RemoveComponent({title, contentId, subFolder, subFolderId, chapters}: Props) {
  const router = useRouter()
  const [addBanner, setAddBanner] = useState(false)
  const [userInfo] = useAtom<any>(userAtomWithStorage)
  const isLocked = (userInfo?.plan === plans.at(0) || !userInfo?.plan) && !userInfo?.email?.includes(CF_EMAIL) && !OWNER_EMAILS.includes(userInfo?.email)
  const checkIsClassFUnc = userInfo?.email.includes(CF_EMAIL)
  const plan = getPlanJpText(userInfo?.plan)
  const checkIsFreePlan = plan === 'フリー'
  const [isEnterprise, setIsEnterprise] = useAtom(isEnterpriseAtom)
  const isSuperAdmin = userInfo?.user_id === OWNER_ID
  const lockCondition = checkIsFreePlan && !checkIsClassFUnc && !isEnterprise && !isSuperAdmin && !OWNER_EMAILS.includes(userInfo?.email)
  const handleDelete = async () => {
    try {
      await deleteContent(contentId)
      setOpen(false)
      toast.success("コンテンツを削除しました。", {autoClose: 3000})
    } catch (e) {
      console.log(e)
      toast.error('コンテンツが削除できませんでした。')
    }
  }
  const [open, setOpen] = useState(false);
  const getMaxIndex = () => {
    if (chapters?.length) {
      return Math.max(...chapters?.map((chapter) => chapter?.chapterIndex));
    }
    return 0;
  }
  return (
    <div className='flex flex-col items-center gap-2'>
      <div className='flex justify-between h-10 items-center flex-1'>
        <div className={'flex flex-col justify-items-center gap-2 '}>
          <div className='flex gap-1 flex-wrap pl-3 items-center'>
            <Button
              className={`capitalize font-bold text-xs h-9 ${isLocked && 'px-1'}`}
              variant='contained'
              onClick={() => router.push(!subFolder ? `/contents/${contentId}/createChapter` :
                `/contents/subFolder/${subFolderId}/subContent/${contentId}/createChapter`)}
            >
              <div className={'flex items-center text-center gap-1'}>
                シナリオ
                <AddIcon className={'w-5'}/>
              </div>
            </Button>
            <Button
              className={`capitalize text-xs h-9 font-bold ${lockCondition && 'opacity-50 px-2'}`}
              variant='contained'
              onClick={() => lockCondition ? {} : setAddBanner(true)}
              endIcon={
                lockCondition &&
                <div className={'w-6 h-6 bg-white flex rounded-full'}>
                  <img src={'/icons/lock-icon.svg'} alt='icon' className={'w-4 h-4 m-auto'}/>
                </div>
              }
            >
              <div className={'flex items-center text-center'}>
                バナー
                <AddIcon className={'w-5'}/>
              </div>
            </Button>
            <ListButtonAddNewTypeOfChapter className={''}
                                           maxIndex={getMaxIndex()}
                                           isLink={true}
                                           contentId={contentId}/>
          </div>
          <ListButtonAddNewTypeOfChapter className={'flex flex-wrap gap-1 pl-3'}
                                         maxIndex={getMaxIndex()}
                                         contentId={contentId}/>
        </div>

        {
          open && <BaseDeleteModal
            label={`コンテンツを削除してもよろしいですか？`}
            handleDelete={handleDelete}
            isOpen={open}
            handleClose={() => setOpen(false)}
          />
        }
        {
          addBanner &&
          <AddBannerDialog
            maxIndex={chapterIndex(chapters)}
            isCreate
            open={addBanner}
            setOpen={setAddBanner}
            contentId={contentId}
          />
        }
      </div>
      <div className='px-3 flex items-center justify-between w-full'>
        <label className='text-black flex items-center font-bold line-clamp-1'>{title}</label>
        <DeleteForeverIcon onClick={() => setOpen(true)}
                           className='text-gray-200 transition-300 cursor-pointer hover:text-red-500'/>
      </div>
    </div>
  );
}

export default RemoveComponent;
