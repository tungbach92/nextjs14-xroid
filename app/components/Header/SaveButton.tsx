import React, {MutableRefObject, useMemo} from "react";
import dayjs from "dayjs";
import useLastSavedDate from "@/app/hooks/useLastSavedDate";
import {useChapterAtom} from "@/app/hooks/useChapterById";
import {atom, useAtomValue} from "jotai";
import isFunction from "lodash/isFunction";
import {Chapter} from "@/app/types/types";
import {isNull, throttle} from "lodash";
import LoadingButton from "@mui/lab/LoadingButton";
import {Block} from "@/app/types/block";
import {useMouseTrap} from "@/app/hooks/useMouseTrap";
import {useRouter} from "next/navigation";

type SaveButtonProps = {
  onSave: () => void,
  isDirty: boolean,
  loading?: boolean,
  title?: string,
  showConditionFn?: () => boolean,
  inputRef?: MutableRefObject<HTMLElement> | null
  blocks?: Block[]
  chapter?: Chapter
}

export const saveButtonPropsAtom = atom({} as SaveButtonProps)

const SaveButton = () => {
  const {
    title = "保存する",
    loading,
    isDirty,
    onSave,
    showConditionFn,
    inputRef,
    blocks,
    chapter,
  } = useAtomValue<SaveButtonProps>(saveButtonPropsAtom)

  const router = useRouter();

  const saveFn = useMemo(() => {

    // if !pathname contains [createChapter] then return empty function
    if (!router?.pathname || !router.pathname.includes('[createChapter]') || loading || !isDirty) {
      return Function
    }
    return throttle(onSave ?? Function, 1000)
  }, [onSave, router?.pathname, loading, isDirty]);

  // command + s, ctrl + s for save
  useMouseTrap(
    ['command+s', 'ctrl+s'], () => saveFn()
  );

  if (isFunction(showConditionFn) && !showConditionFn()) {
    return null
  }
  return (
    <div className={'flex items-center gap-2'}>
      <LoadingButton
        disabled={!isDirty || isNull(blocks) || isNull(chapter)}
        loading={loading}
        onMouseOver={() => inputRef?.current?.blur()}
        onClick={onSave}
        variant={'contained'}
        sx={{minWidth: 150}}>
        {title}
      </LoadingButton>
      <div>
        <LastSavedTextComp
          loading={loading}
        />
      </div>
    </div>
  );
};

export default SaveButton;
const LastSavedTextComp = (
  {
    loading = false
  }: {
    loading?: boolean
  }) => {
  const [chapter] = useChapterAtom();
  const [lastSaved] = useLastSavedDate();
  let text, timeString
  if (!loading) {
    // @ts-ignore
    text = dayjs(lastSaved[chapter?.id]).format()
    timeString = text.split("T")[1].split("+")[0]
  } else {
    timeString = 'saving...'
  }
  // @ts-ignore
  return (
    <div className={"text-xs text-gray-400"}>
      <span>最終保存: {dayjs(lastSaved[chapter?.id ?? '']).format("YYYY/MM/DD")}</span>{' '}
      <span className={'text-sm text-black'}>{timeString}</span>
    </div>
  )
}
