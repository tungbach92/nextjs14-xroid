import MentoroidItemContent from "@/app/components/Content/MentoroidItemContent";
import React, {useEffect, useState} from "react";
import Image from "next/image";
import {Avatar} from "@mui/material";
import {Character} from "@/app/types/types";
import {Content} from "@/app/types/content";
import {useRouter, useSearchParams} from "next/navigation";

interface MentoroidListContentProps {
  content: Content
  characters: Character[]
  contentLoading: boolean
}

export default function MentoroidListContent({content, characters, contentLoading}: MentoroidListContentProps) {
  const router = useRouter()
  const {contentId}: any = useSearchParams();
  const [open, setOpen] = useState<boolean>(false)
  const [selectedChars, setSelectedChars] = useState<Character[]>([])

  useEffect(() => {
    let selectedChar: Character[] = []
    if (!content)
      selectedChar = characters?.filter((item) => item?.isSystem || item?.isChecked)
    else
      selectedChar = characters?.filter((item) => content?.mentoroids?.find((id) => item?.id === id))?.map((item) => {
        return {...item, isChecked: true}
      })
    setSelectedChars(selectedChar)
  }, [characters, content?.mentoroids])


  return (
    <div className={'mb-4'}>
      <div className={"text-sm mb-4 text-black"}>登場可能メンタロイド</div>
      <div className={"flex items-center gap-4"}>
          <div className={'max-w-[300px] flex gap-3 overflow-auto'}>
            {
              selectedChars?.map((item, index) => {
                if (!item?.isChecked) return null
                return <Avatar
                  className={'bg-white'}
                  key={item?.id || index}
                  src={item?.avatar}
                  alt={'avatar'}
                />
              })
            }
          </div>
        <Image
          src="/icons/content/addBlue.svg"
          alt=""
          width={35}
          height={35}
          className="bg-[#DAE7F6] opacity-80 rounded-full  p-2 cursor-pointer"
          onClick={() => setOpen(true)}
        />
      </div>
      {
        open &&
        <MentoroidItemContent open={open}
                              setOpen={setOpen}
                              characters={characters}
                              selectedChars={selectedChars}
        />
      }
    </div>
  )
}
