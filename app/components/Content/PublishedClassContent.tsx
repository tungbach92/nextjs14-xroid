import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import React, {Dispatch, SetStateAction, useMemo} from "react";
import {ViewOptionsForm} from "@/app/types/types";
import {Content, ContentState, ContentStateValues} from "@/app/types/content";
import {saveError, saveSuccess} from "@/app/services/content";
import {updateContent} from "@/app/common/commonApis/contentsApi";
import {LockContent} from "@/app/components/base/lockContent/LockContent";

interface ViewOptionsContentProps {
  state?: ContentState;
  handleChangeState?: (field: string) => (value: ContentStateValues) => void
  content: Content
  setContent: Dispatch<SetStateAction<Content>>
  id: string
}

export default function PublishedClassContent({
  state, handleChangeState = () => () => {
  }, content, setContent, id
}: ViewOptionsContentProps) {

  const listCheck: ViewOptionsForm[] = useMemo(
    () => [
      {
        id: 1,
        content: <div className={"text-sm"}>AIスクール</div>,
        name: "schoolAI",
        check: state.schoolAI,
      },
      {
        id: 2,
        content: <div className={"text-sm"}>B社の企業研修</div>,
        name: "businessB",
        check: state.businessB,
      },
      {
        id: 3,
        content: <div className={"text-sm"}>友人とキャリア研究</div>,
        name: "withFriend",
        check: state.withFriend,
      },
      {
        id: 4,
        content: <div className={"text-sm"}>C社コンシャルティング</div>,
        name: "adviceC",
        check: state.adviceC,
      },
    ],
    [state]
  );
  const handleChange = async (e) => {
    const checked = e.target.checked
    const field = e.target.name
    handleChangeState(field)(checked)

    if (id === "create") {
      return
    }

    try {
      const _content = {...content, [field]: checked}
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
    <div className={"bg-white rounded"}>
      <div
        className={"font-bold text-sm text-black text-center py-2  border-solid border-0 border-b-2 border-b-gray-300"}>クラスへ限定公開
      </div>
      <div className={"flex flex-col"}>
        {
          listCheck?.map((item) =>
            <LockContent
              className={'flex-row-reverse justify-end px-2.5 py-2 gap-2 rounded-none'}
              key={item.id}>
              <FormControlLabel
                control={<Checkbox checked={item.check} onChange={handleChange} name={item.name}/>}
                label={item.content} className={'m-0 pr-2'}/>
            </LockContent>
          )
        }
        <div className={`text-end px-2`}>
          ＞もっと見る
        </div>
      </div>
    </div>
  )
}
