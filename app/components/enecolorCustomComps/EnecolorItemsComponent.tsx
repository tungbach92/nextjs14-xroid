import * as React from "react";
import {ReactNode, useState} from "react";
import {useAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {Enecolor} from "@/app/types/block";
import {getListVarIndex} from "@/app/common/getListVarIndex";
import {ENECOLOR_RANK_IMG_V2, ENECOLOR_RANK_TEXT_V2, InitEnecolor, INPUT_ENECOLOR_IMAGE} from "@/app/configs/constants";
import EnecolorTemplateItem from "@/app/components/enecolorCustomComps/EnecolorTemplateItem";
import {Avatar} from "@mui/material";
import {EnecolorsProps} from "@/app/components/Enecolors/Enecolors";
import {TEST_AND_OWNER_ID} from "../../../common/ownerId";
import {copyEneColor} from "@/app/common/commonApis/enecolorsApi";
import {toast} from "react-toastify";
import {getIconEnecolorRC_CR_RCI_CRI} from "@/app/common/getIconEnecolorRC_CR_RCI_CRI";
import Loading from "@/app/components/custom/Loading";
import {iconImg} from "@/app/components/assets/image/icon";
import {typeOfNewEnecolorBlockAtom} from "@/app/store/atom/typeOfNewEnecolorBlock.atom";
import {RankColorProps} from "@/app/components/enecolorCustomComps/RankColorComponent";

interface EnecolorItemsComponentProps extends EnecolorsProps, RankColorProps {
  colorTitle?: string | ReactNode
  rankTitle?: string | ReactNode
  items: Enecolor[]
  tabValue?: number
}

function EnecolorItemsComponent({
  items,
  setDraftText,
  previewInputRef,
  isModal,
  type,
  draftSelectedEnecolors,
  setDraftSelectedEnecolors,
  block, tabValue, inEneColor, ownerStudios, loadingOwnerStudios
}: EnecolorItemsComponentProps) {
  const [userInfo] = useAtom<any>(userAtomWithStorage)
  const [enecolor, setEnecolor] = useState<Enecolor>(InitEnecolor)
  const isAdmin = TEST_AND_OWNER_ID.includes(userInfo?.user_id)
  const [newEnecolorBlockType,] = useAtom(typeOfNewEnecolorBlockAtom)

  const addSpecialTextVer2 = (x: Enecolor) => {
    let selectedEnecolors = draftSelectedEnecolors || []
    const specialText = x.groupsText?.userInput
    const inputElement = previewInputRef?.current;
    if (!inputElement) return
    const {selectionStart, selectionEnd} = inputElement;
    const currentValue = inputElement.value;
    inputElement.value = `${currentValue.slice(0, selectionStart)}${specialText}${currentValue.slice(selectionEnd)}`;
    // calculate focus position
    const indices = getListVarIndex(inputElement.value)
    const found = indices.find(x => x.value === specialText && x.endIndex > selectionStart) //fix when add multi enecolor var
    found && setTimeout(() => {
      inputElement.selectionStart = found.endIndex + 1
      inputElement.selectionEnd = found.endIndex + 1
      inputElement.focus();
    })
    setDraftText(inputElement.value)
    selectedEnecolors.push(x)
  }

  const handleClickEnecolorItem = (ene: Enecolor) => {
    if (newEnecolorBlockType === INPUT_ENECOLOR_IMAGE || newEnecolorBlockType === ENECOLOR_RANK_IMG_V2) {
      setDraftSelectedEnecolors([ene])
      return
    }
    addSpecialTextVer2?.(ene)
  }

  const onCopyEnecolor = async (x: Enecolor) => {
    try {
      await copyEneColor(x.id)
      toast.success('コピーしました。', {autoClose: 3000})
    } catch (e) {
      console.log(e)
      toast.error('コピーに失敗しました。', {autoClose: 3000})
    }
  }

  const getAvatar = (userId: string) => {
    const find = ownerStudios?.find(x => x.userId === userId)
    const studioIcon = find?.avatar || iconImg.andom
    return (TEST_AND_OWNER_ID.includes(userId) && !isAdmin) ? !loadingOwnerStudios ?
      <Avatar className={'w-7 h-7'} alt="avatar"
              src={studioIcon}/> : <Loading/> : ''
  }
  return (
    <div className={'flex flex-col gap-2 p-3 bg-white rounded-sm'}>
      <div
        className={`${isModal ? 'max-h-[300px] overflow-y-auto' : 'max-h-[500px] overflow-y-auto'} flex flex-col gap-2`}>
        {items?.map((x, index: number) => {
            return (
              <EnecolorTemplateItem
                setEnecolor={setEnecolor}
                subType={type}
                tabValue={tabValue}
                icon={getIconEnecolorRC_CR_RCI_CRI(x)}
                item={x}
                key={x.id + index}
                block={block}
                inEneColor={inEneColor}
                enecolor={enecolor}
                copyEnecolor={() => onCopyEnecolor(x)}
                padding={'p-3'}
                isSelected={Boolean(draftSelectedEnecolors?.find((item) => item.id === x?.id))}
                isAdmin={isAdmin || x.userId === userInfo?.user_id}
                avatar={getAvatar(x.userId)}
                handleClick={handleClickEnecolorItem}
              />
            )
          }
        )}
      </div>
    </div>
  )
}

export default EnecolorItemsComponent
