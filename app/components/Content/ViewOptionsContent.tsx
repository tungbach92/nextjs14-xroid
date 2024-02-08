import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import React, {Dispatch, SetStateAction, useMemo} from "react";
import {Chapter, ViewOptionsForm} from "@/app/types/types";
import {Content} from "@/app/types/content";
import {saveError, saveSuccess} from "@/app/services/content";
import {updateContent} from "@/app/common/commonApis/contentsApi";
import {LockContent} from "@/app/components/base/lockContent/LockContent";
import {useAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {plans} from "@/app/configs/constants";
import {CF_EMAIL, OWNER_EMAILS} from "../../../common/ownerId";
import {toast} from "react-toastify";

interface ViewOptionsContentProps {
  viewOptions?: string[]
  setViewOptions?: (value: string[]) => void
  content: Content
  setContent: Dispatch<SetStateAction<Content>>
  id: string
  chapters: Chapter[]
  className?: string
  isEnterprise?: boolean
}

export default function ViewOptionsContent({
                                             viewOptions = [],
                                             chapters,
                                             setViewOptions = () => {},
                                             className,
                                             content, setContent, id,
                                             isEnterprise
                                           }: ViewOptionsContentProps) {
  const [userInfo] = useAtom<any>(userAtomWithStorage)
  const isLocked = (userInfo?.plan === plans.at(0) || !userInfo?.plan) && !userInfo?.email?.includes(CF_EMAIL) && !OWNER_EMAILS.includes(userInfo?.email)
  const listCheck: ViewOptionsForm[] = useMemo(
    () => [
      {
        id: 1,
        content: <div className={"text-sm"}>自分限定公開（自作タブ）</div>,
        name: "onlyMe",
        check: viewOptions?.indexOf("onlyMe") > -1,
      },
      {
        id: 2,
        content: <div className={"text-sm"}>ラボへ公開</div>,
        name: "productionMode",
        check: viewOptions?.indexOf("productionMode") > -1 && chapters?.length > 0 && Boolean(chapters?.find(item => item.isPublicByContent))
      },
      // {
      //   id: 3,
      //   content: <div className={"text-sm"}>開発環境に表示</div>,
      //   name: "testMode",
      //   check: viewOptions?.indexOf("testMode") > -1,
      // },
      {
        id: 4,
        content: <div className={"text-sm"}>プロへ公開</div>,
        name: "proPlanMode",
        check: viewOptions?.indexOf("proPlanMode") > -1,
      },
      {
        id: 5,
        content: <div className={"text-sm"}>企業へ公開</div>,
        name: "enterpriseMode",
        check: viewOptions?.indexOf("enterpriseMode") > -1,
      }
    ],
    [viewOptions, chapters]
  );

  const publicByContentChapter = chapters?.filter(item => item.isPublicByContent && !item?.thumbnail)
  const publicByContentChapterTitles = publicByContentChapter?.map(item => item.title)
  const handleChange = async (e) => {
    const value = e.target.name
    if (value === 'productionMode' && !Boolean(chapters?.find(item => item.isPublicByContent))) {
      toast.error('コースを公開するのに、一つ以上のシナリオを公開してください。')
      return
    }
    // if (value === 'productionMode' && (!content?.mentoroids || content?.mentoroids?.length === 0)) {
    //   toast.error('キャラクターを１つ以上選択してください。')
    //   return
    // }
    if (value === 'productionMode' && !content?.thumbnail) {
      toast.error('サムネイルを設定してください。')
      return
    }
    if (value === 'productionMode' && publicByContentChapter.length) {
      toast.error(`${publicByContentChapterTitles.join(', ')}` + 'の表紙画像を設定してください。')
      return
    }
    const isCheck = viewOptions.indexOf(value) > -1
    let _viewOptions = []
    if (isCheck) {
      _viewOptions = viewOptions.filter(item => item !== value)
    } else
      _viewOptions = [...viewOptions, value]
    if (id === "create") {
      setViewOptions(_viewOptions)
      return
    }

    try {
      const _content = {...content, viewOptions: _viewOptions}
      setContent(_content)
      await updateContent(_content)
      saveSuccess()
    } catch (e) {
      setContent(content)
      saveError()
      console.log(e);
    }
  }

  return (
    <div className={`bg-white rounded mb-4 ${className}`}>
      <div
        className={"font-bold text-sm text-black text-center py-2  border-solid border-0 border-b-2 border-b-gray-300"}>公開設定
      </div>
      <div className={"flex flex-col"}>
        {
          listCheck.map((item) =>{
            if(item.name === 'enterpriseMode' && !isEnterprise) return null
            return (
              <LockContent isLocked={(item.name === "proPlanMode" || item.name === "productionMode") && isLocked}
                           className={'flex-row-reverse justify-end px-2.5 py-2 gap-2 rounded-none'}
                           key={item.id}>
                <FormControlLabel
                  control={<Checkbox checked={item.check} onChange={handleChange} name={item.name}
                                     className={`${(item.name === "proPlanMode" || item.name === "productionMode") && isLocked && 'hidden'}`}
                                     disabled={(item.name === "proPlanMode" || item.name === "productionMode")  && isLocked || (item.name === 'productionMode' && id === "create")}
                    // disabled={item.name === "proPlanMode" && isLocked || (item.name === 'productionMode' && id === "create")}
                  />}
                  label={item.content} className={'m-0 pr-2'}/>
              </LockContent>
            )
          }
          )
        }
      </div>
    </div>
  )
}
