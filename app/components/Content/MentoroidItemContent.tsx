import React, {useEffect, useState} from 'react';
import {Checkbox, FormControlLabel} from "@mui/material";
import DialogCustom from "@/app/components/DialogCustom";
import {updateContent} from "@/app/common/commonApis/contentsApi";
import {saveError, saveSuccess} from "@/app/services/content";
import {Character} from "@/app/types/types";
import {useAtomValue, useSetAtom} from "jotai";
import {charactersAtom} from "@/app/store/atom/characters.atom";
import {isFunction, isNull} from "lodash";
import {contentAtom} from "@/app/store/atom/contents.atom";
import {useGetChapterByContentId} from "@/app/hooks/useGetChaptersByContentId";
import {toast} from "react-toastify";

type Props = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  characters?: Character[]
  selectedChars?: Character[]
  contentLoading?: boolean
  onSave?: () => void
}

function MentoroidItemContent({open, setOpen, characters, selectedChars, contentLoading, onSave}: Props) {
  const content = useAtomValue(contentAtom)
  const [charactersState, setCharactersState] = useState<Character[]>([])
  const setCharacters = useSetAtom(charactersAtom)

  useEffect(() => {
    let _char: Character[] = characters?.map((item) => {
      if (content?.mentoroids?.find((id) => item?.id === id)) {
        return {...item, isChecked: true}
      } else {
        return {...item, isChecked: false}
      }
    })
    if (!content) {
      _char = [...characters]
    }
    setCharactersState(_char)
  }, [characters, content?.mentoroids, selectedChars])

  const {chapters,} = useGetChapterByContentId(content?.id)

  const handleChange = (e) => {
    const {id, checked} = e.target
    const filterCharactersIsUsing = chapters?.filter(item => item?.actionCharacterIds?.includes(id))
    if (!e.target.checked && filterCharactersIsUsing?.length > 0) {
      toast.error(`${charactersState?.find(item => item?.id === id)?.name}キャラクターはシナリオ${filterCharactersIsUsing?.map(item => item?.title).join(' ,')}で使われているため削除できません。`)
      return
    }
    const idx = charactersState.findIndex(item => item?.id === id)
    if (idx !== -1) {
      const _characters = [...charactersState]
      _characters[idx].isChecked = checked
      setCharactersState(_characters)
    }
  }
  const onSubmit = async () => {
    if (!content) {
      setCharacters(charactersState)
      setOpen(false)
      return
    }
    try {
      const data = {
        ...content,
        mentoroids: charactersState?.filter(item => item?.isChecked)?.map(item => item?.id)
      }
      await updateContent(data)
      saveSuccess()
      setOpen(false)
    } catch (err) {
      saveError()
    }
  }

  return (
    <DialogCustom open={open} setOpen={setOpen} title={'登場可能キャラクターを選択してください。'} onClick={() => {
      isFunction(onSave) ? onSave() : onSubmit()
    }}>
      <div className={'w-full'}>
        {
          ((!contentLoading && !isNull(content)) || charactersState) && charactersState?.map((item) => {
            if(item?.isURoidTemplate) return null
            return <FormControlLabel
              key={item.id}
              className={'w-full flex gap-2 bg-[#F5F7FB] py-2 my-2 rounded-md'}
              control={
                <Checkbox
                  checked={item?.isChecked || false}
                  onChange={handleChange}
                  id={item.id}
                  color="primary"
                />
              }
              label={item.name}
            />
          })
        }
      </div>
    </DialogCustom>
  );
}

export default MentoroidItemContent;
