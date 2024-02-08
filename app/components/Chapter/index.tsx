import React from 'react';
import {useRouter} from "next/navigation";
import ChapterList from "@/app/components/Chapter/ChapterList";
import {Content} from "@/app/types/content";

type Props = {
  contentData: Content[],
  className?: string,
  isSubFolder?: boolean
}

function Chapter({contentData, className, isSubFolder}: Props) {
  const router = useRouter();

  return (
    <>
      {
        contentData?.length > 0 && contentData.map((item, index) => {
          return (
            <div key={item.id} className={`flex flex-col ${className}`}>
              <div
                className='flex flex-col justify-between items-center cursor-pointer overflow-hidden px-4 xl:px-10 2xl:px-14'>
                <div className='h-10'>
                  {
                    item?.imageTitle && <span>{item?.imageTitle}</span>
                  }
                </div>
                <img
                  onClick={() => router.push(`${!isSubFolder ? `/contents/${item.id}` : `/contents/subFolder/${router.query.subFolder}/${item.id}`}`)}
                  className={'h-32 border rounded-md object-contain w-full'}
                  src={item.thumbnail || '/icons/no-image-frees.png'} alt='content-image'
                />
              </div>
              <ChapterList isSubFolder={isSubFolder} contentId={item.id} title={item.title}/>
            </div>
          )
        })
      }
    </>
  );
}

export default Chapter;
