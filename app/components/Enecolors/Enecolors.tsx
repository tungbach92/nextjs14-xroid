import * as React from "react";
import {ReactNode, useState} from "react";
import {iconImg} from "@/app/components/assets/image/icon";
import {BlockInputEnecolorImage, BlockInputEnecolorText, BlockText, Enecolor} from "@/app/types/block";
import useEnecolors from "@/app/hooks/useEnecolors";
import RankColorComponent from "@/app/components/enecolorCustomComps/RankColorComponent";
import HeaderIcon from "@/app/components/enecolorCustomComps/HeaderIcon";
import {Button} from "@mui/material";
import useAdminEnecolors from "@/app/hooks/useAdminEnecolor";
import {useGetAllUserEnecolor} from "@/app/hooks/useGetAllUserEnecolor";
import {useGetOwnerStudios} from "@/app/hooks/useGetOwnerStudios";


export interface EnecolorsProps {
  previewTextBlock?: ReactNode
  draftText?: string
  setDraftText?: React.Dispatch<React.SetStateAction<string>>
  previewInputRef?: React.MutableRefObject<HTMLInputElement> | null
  isTextOnly?: boolean
  isModal?: boolean
  type?: string
  draftSelectedEnecolors?: Enecolor[]
  setDraftSelectedEnecolors?: React.Dispatch<React.SetStateAction<Enecolor[]>>
  block?: BlockText | BlockInputEnecolorText | BlockInputEnecolorImage
  previewDisabled?: boolean
  inEneColor: boolean
}

function Enecolors({...props}: EnecolorsProps) {
  const {previewTextBlock, isModal, previewDisabled,draftSelectedEnecolors, setDraftSelectedEnecolors} = props
  const [typeValue, setTypeValue] = useState<number>(0)
  useEnecolors()
  const {adminEnecolors} = useAdminEnecolors()
  useGetAllUserEnecolor(adminEnecolors)
  const {ownerStudios, loadingOwnerStudios} = useGetOwnerStudios()

  const handleClick4 = () => {
    setTypeValue(0)
  }

  const handleClick16 = () => {
    setTypeValue(1)
  }
  return (
    <div className={'w-full p-3 flex flex-col gap-1'}>
      {previewTextBlock}
      <div className={'flex w-full gap-12 items-center justify-center'}>
        <Button onClick={handleClick4}
                className={`flex flex-col items-center justify-center gap-2 rounded-md cursor-pointer text-black ${typeValue === 0 && 'bg-[#DAE7F6] border-2 border-solid border-[#1976D2]'}`}
        >
          <HeaderIcon icon={iconImg.enecolor4}
                      bottomTitle={'4色'}
                      className={`flex flex-col gap-2 px-4 py-3`}
          />
        </Button>
        <Button onClick={handleClick16}
                className={`flex flex-col items-center justify-center gap-2 rounded-md cursor-pointer text-black ${typeValue === 1 && 'bg-[#DAE7F6] border-2 border-solid border-[#1976D2]'}`}
        >
          <HeaderIcon icon={iconImg.enecolor16}
                      bottomTitle={'16分割'}
                      className={`flex flex-col gap-2 px-4 py-3`}
          />
        </Button>
      </div>
      <div className={`flex flex-col gap-1 ${isModal && !previewDisabled && 'max-h-[300px] overflow-y-auto'}`}>
        {typeValue === 0 &&
          <RankColorComponent {...props} typeValue={typeValue} icon={iconImg.enecolor4} ownerStudios={ownerStudios}
                              loadingOwnerStudios={loadingOwnerStudios}
                              draftSelectedEnecolors = {draftSelectedEnecolors}
                              setDraftSelectedEnecolors = {setDraftSelectedEnecolors}
          />}
        {typeValue === 1 &&
          <RankColorComponent {...props} typeValue={typeValue} icon={iconImg.enecolor16} ownerStudios={ownerStudios}
                              loadingOwnerStudios={loadingOwnerStudios}
                              draftSelectedEnecolors = {draftSelectedEnecolors}
                              setDraftSelectedEnecolors = {setDraftSelectedEnecolors}
          />}
      </div>
    </div>
  )
}

export default Enecolors








