import DialogCustom from "@/app/components/DialogCustom";
import React, {ReactNode, useMemo, useState} from "react";
import {useAtomValue} from "jotai";
import {Chapter} from "@/app/types/types";
import {Enecolor} from "@/app/types/block";
import {enecolorsAtom} from "@/app/store/atom/enecolors.atom";
import {createEneColor, updateEneColor} from "@/app/common/commonApis/enecolorsApi";
import {toast} from "react-toastify";
import ModalEnecolorDetail from "@/app/components/Structures/ModalEnecolorDetail";
import {InitEnecolor} from "@/app/configs/constants";
import IconButton from "@mui/material/IconButton";
import {Close} from "@mui/icons-material";

export interface ModalEnecolorsProps {
  chapter?: Chapter
  setChapter?: React.Dispatch<React.SetStateAction<Chapter>>
  openEnecolorDialog: boolean
  setOpenEnecolorDialog?: React.Dispatch<React.SetStateAction<boolean>>
  enecolor?: Enecolor
  setEnecolor?: React.Dispatch<React.SetStateAction<Enecolor>>
  selectedEnecolor?: Enecolor
  setSelectedEnecolor?: React.Dispatch<React.SetStateAction<Enecolor>>
  getListDataStructure?: () => Promise<void>
  type?: string
  isImage?: boolean
  headerIcon?: ReactNode
  isPopover?: boolean
}

export default function ModalEnecolors({
                                         ...props
                                       }: ModalEnecolorsProps) {
  const {openEnecolorDialog, setOpenEnecolorDialog, enecolor, type, setEnecolor} = props
  const [isNameInValid, setIsNameInValid] = useState<boolean>(false)
  const [errors, setErrors] = useState<{ [p: string]: string }>({});
  const [crudLoading, setCrudLoading] = useState<boolean>(false)
  const enecolors = useAtomValue(enecolorsAtom)
  const [focusColorRankRight, setFocusColorRankRight] = useState<string | number>(null)

  const subName = useMemo(() => {
    let name = 'Enecolor4'
    if (enecolor?.output_type === 'enecolor_16_rank' || enecolor?.output_type === 'enecolor_16') {
      name = 'Enecolor16'
    }
    return name
  }, [enecolor?.output_type])

  const validateName = () => {
    let errors = '';
    setIsNameInValid(false);
    if (!enecolor.name) {
      setIsNameInValid(true);
      errors = "構造の名を入力してください";
    }
    setErrors((prevErrors) => ({...prevErrors, name: errors}));
  };
  const handleCreateEnecolor = async (e) => {
    validateName()
    try {
      setCrudLoading(true)
      enecolor?.groupsText && (enecolor.groupsText.userInput = `{{${subName}${type}${enecolor?.groupsText?.color || enecolor?.groupsText?.rank || ''}:${enecolor.name}}}`)
      const isExist = enecolors.findIndex(x => x?.id === enecolor.id) !== -1
      isExist ? await updateEneColor(enecolor) : await createEneColor(enecolor)
      setOpenEnecolorDialog?.(false)
      toast.success('作成しました。', {autoClose: 3000})
    } catch (e) {
      console.log(e)
      !e?.response?.data?.message?.includes('name') && toast.error(e?.response?.data?.message, {autoClose: 3000})
    } finally {
      setCrudLoading(false)
    }
  }

  const handleCloseEnecolorDialog = () => {
    // console.log('handleCloseEnecolorDialog')
    setErrors({})
    setIsNameInValid(false)
    setFocusColorRankRight(null)
    setOpenEnecolorDialog(false)
    if (!enecolor.id) {
      setEnecolor(InitEnecolor)
      return
    }
    const oldEneColor = enecolors.find(x => x.id === enecolor.id)
    setEnecolor(oldEneColor)
  }


  return (
    <DialogCustom
      open={openEnecolorDialog}
      setOpen={setOpenEnecolorDialog}
      isCancelBtn={false}
      classNameBtnOk={'m-auto w-[200px]'}
      title={''}
      onClick={handleCreateEnecolor}
      onClose={handleCloseEnecolorDialog}
      disable={crudLoading}
      maxWidth={(enecolor?.output_type === 'enecolor_16' || enecolor?.output_type === 'enecolor_16_rank') ? 'md' : 'sm'}
      contentBorderBottom={false}
      closeBtn={<IconButton onClick={handleCloseEnecolorDialog}
                            className={'absolute top-0 right-0'}><Close/></IconButton>}
    >
      <ModalEnecolorDetail {...props}
                           focusColorRankRight={focusColorRankRight}
                           setErrors={setErrors}
                           setIsNameInValid={setIsNameInValid}
                           isNameInValid={isNameInValid}
                           setFocusColorRankRight={setFocusColorRankRight}
                           errors={errors}/>
    </DialogCustom>
  )
}
