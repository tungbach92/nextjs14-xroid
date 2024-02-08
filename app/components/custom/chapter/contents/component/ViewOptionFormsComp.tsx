import React from 'react';
import SettingPublic from "@/app/components/custom/SettingPublic";
import {useAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {ViewOptionForm} from "@/app/types/types";
import {LockContent} from "@/app/components/base/lockContent/LockContent";
import {plans} from "@/app/configs/constants";
import {CF_EMAIL, OWNER_EMAILS} from "../../../../../../common/ownerId";
import {isEnterpriseAtom} from "@/app/store/atom/isEnterprise.atom";

type Props = {
  viewOptionForms: ViewOptionForm[]
}

function ViewOptionFormsComp({viewOptionForms}: Props) {
  const [userInfo] = useAtom(userAtomWithStorage);
  const isLocked = (userInfo?.plan === plans.at(0) || !userInfo?.plan) && !userInfo?.email?.includes(CF_EMAIL) && !OWNER_EMAILS.includes(userInfo?.email)
  const [isEnterPrise, ] = useAtom(isEnterpriseAtom)


  return (
    <div className={'rounded mb-4 min-w-[180px] px-2'}>
      <div
        className={"font-bold text-sm bg-white text-center py-2 border-solid border-0 border-b-[1px] border-b-gray-300"}>
        このコースの公開先の設定
      </div>
      {
        viewOptionForms.map(item => {
          if (item.value === "enterpriseMode" && !isEnterPrise) return null
          return (
            <div key={item.id} className={'bg-white'}>
              <LockContent isLocked={(item.value === "proPlanMode" || item.value === "productionMode") && isLocked}
                           className={'flex-row-reverse justify-end py-2 gap-3 rounded-none px-1.5'}
                           key={item.id}>
                <SettingPublic item={item} isLocked={true}/>
              </LockContent>
            </div>
          )
        })
      }

      {
        <div
          className={"font-bold text-sm bg-white text-center py-2 border-solid border-0 border-b-[1px] border-b-gray-300"}>
          クラスへ限定公開
        </div>
      }
    </div>
  );
}

export default ViewOptionFormsComp;
