import React from "react";
import {DataStructure} from "@/app/types/types";

interface Props {
  item: DataStructure
}

export default function DataStructureChapterItem({item}: Props) {
  return (
    <div className={'flex flex-col items-center w-full'}>
      <img src={'/icons/data-structure-icon.svg'} alt={'structure'} width={21}
           height={30}
      />
      <div title={item?.name} className={'max-w-full leading-[23.3px] truncate'}>{item?.name}</div>
    </div>
  )
}
