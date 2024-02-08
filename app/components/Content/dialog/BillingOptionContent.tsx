import {LockContent} from "@/app/components/base/lockContent/LockContent";
import Image from "next/image";
import Button from "@mui/material/Button";
import React, {SetStateAction} from "react";
import {useAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {plans} from "@/app/configs/constants";
import {CF_EMAIL, OWNER_EMAILS} from "../../../../common/ownerId";

interface Props {
  setOpenBilling: React.Dispatch<SetStateAction<boolean>>
  cube: number
  courseId?: string
}

export const BillingOptionContent = ({setOpenBilling, cube,courseId}: Props) => {
  const [userInfo] = useAtom<any>(userAtomWithStorage)
  const isLocked = (userInfo?.plan === plans.at(0) || !userInfo?.plan) && !userInfo?.email?.includes(CF_EMAIL) && !OWNER_EMAILS.includes(userInfo?.email)

  return (
    <div className='flex flex-col items-center flex-auto max-w-max'>
      <LockContent isLocked={isLocked} className={'flex-row-reverse items-start gap-0'}>
        <div className={`flex flex-col items-center gap-4 ${isLocked && 'opacity-50'}`}>
          <div className={"mb-[5px] mt-[5px] text-black"}>課金種別</div>
          <div className={"flex items-center"}
          >
            <Image
              src="/icons/content/billingType.svg"
              alt=""
              width={40}
              height={40}
              className=" mr-2  "
            />
            {/*<span className={'text-black'}>*/}
            {/*{cube}*/}
            {/*</span>*/}
          </div>
          <Button disabled={isLocked || courseId === 'create'} className="capitalize" variant='contained'
                  size={'large'}
                  onClick={() => {
                    setOpenBilling(true)
                  }}>課金設定一覧</Button>
        </div>
      </LockContent>
    </div>
  )
}
