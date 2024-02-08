import Image from "next/image";
import DataStructureContentModal from "@/app/components/Content/dialog/DataStructureContentModal";
import React from "react";
import {useAtomValue} from "jotai";
import {selectedDataStructureContentAtom} from "@/app/store/atom/structureData.atom";

interface DataStructureContentProps {
  isOpenModal?: boolean
  toggleOpenModal?: () => void
  handleChangeState: (field: string) => (value: any) => void
  loading?: boolean
}

export default function DataStructureContent({
                                               toggleOpenModal = () => {
                                               }, isOpenModal = false, handleChangeState, loading = false
                                             }: DataStructureContentProps) {
  const selectedDataStructureContent = useAtomValue(selectedDataStructureContentAtom)
  return (
    <div className={"flex"}>
      <div className='flex max-w-[200px] overflow-auto'>
        {
          selectedDataStructureContent?.map(data =>
            <div key={data?.id} className='col-span-1 text-center'>
              <Image
                src="/icons/content/database.svg"
                alt=""
                width={24}
                height={30}
                className="mb-1"
              />
              <div className={"text-xs w-[60px] line-clamp-1 text-black"}>{data?.name}</div>
            </div>)
        }
      </div>
      <div className={`flex items-center justify-center ${selectedDataStructureContent?.length > 0 ? 'ml-4' : ''}`}>
        <Image
          src="/icons/content/addBlue.svg"
          alt=""
          width={35}
          height={35}
          className="bg-[#DAE7F6] opacity-80 rounded-full  p-2 cursor-pointer "
          onClick={toggleOpenModal}
        />
      </div>
      <DataStructureContentModal isOpen={isOpenModal} loading={loading}
                                 toggleClose={toggleOpenModal} handleChangeState={handleChangeState}
      />

    </div>
  )
}
