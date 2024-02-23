'use client'

import React, {useEffect, useRef, useState} from 'react';
import HeaderScenario from "@/app/components/custom/chapter/contents/HeaderTemplate";
import CenterScenario from "@/app/components/custom/chapter/contents/CenterScenario";
import RightScenario from "@/app/components/custom/chapter/contents/RightScenario";
import {useRouter, useSearchParams} from "next/navigation";
import useChapter from "@/app/hooks/useChapterById";
import HistoryList from "@/app/components/history/HistoryList";
import {useAtom, useAtomValue} from "jotai";
import {showHistoryAtom} from "@/app/store/atom/showHistory.atom";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import dayjs from "dayjs";
import useBlocks from "@/app/hooks/useBlocks";
import {useAllHistories} from "@/app/hooks/useAllBlocks";
import {VirtuosoHandle} from "react-virtuoso";
import {isShowTabPanelAtom} from "@/app/store/atom/isShowTabPanel";
import LeftScenario from "@/app/components/custom/chapter/contents/LeftScenario";

type props = {}

function Chapter({}: props) {
  const [innerWidth, setInnerWidth] = useState(1920)
  const {createChapter: chapterId, subFolder: subFolderId}: any = useSearchParams()
  const {chapter, setChapter, oldChapter} = useChapter(chapterId as string)
  const [loading, setLoading] = useState<boolean>(false)
  const [fixed, setFixed] = useState(false)
  const [showHistory] = useAtom(showHistoryAtom)
  const [userInfo] = useAtom(userAtomWithStorage)
  const {allBlocks, blocks, setBlocks, loading: loadingBlocks} = useBlocks(chapterId as string)
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);
  const virtuosoHistoryRef = useRef<VirtuosoHandle | null>(null);
  const isShowTabPanel = useAtomValue(isShowTabPanelAtom)
  const [isFullFieldUroid, setIsFullFieldUroid] = useState(false)
  const isCreateRoid = chapter?.chapterType === 'createURoid'
  useEffect(() => {
    const handleScroll = () => {
      const topHeight = document.getElementById("topContainer")?.offsetHeight;
      if (topHeight && window.scrollY >= topHeight) {
        setFixed(true);
      } else {
        setFixed(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  useEffect(() => {
    setInnerWidth(window.innerWidth)
  }, [])

  const {allHistories} = useAllHistories(chapterId as string)

  const author = userInfo?.first_name + " " + userInfo?.last_name || "Anonymous"

  const histories = allHistories?.map((item) => {
    return {
      date: dayjs.unix(item.createdAt).format('M月DD日、HH:mm'),
      author: author,
      blockIds: item.oldBlockIds,
    }
  })
  return (
    <div className={'text-black h-full overflow-y-auto'}>
      {
        showHistory &&
        <div className={'fixed right-5 top-[76px]'} style={{zIndex: 100}}>
          <HistoryList historyList={histories}
                       virtuosoHistoryRef={virtuosoHistoryRef} allBlocks={allBlocks} setBlocks={setBlocks}/>
        </div>
      }
      <div id={"topContainer"}>
        <HeaderScenario subFolderId={subFolderId} chapter={chapter} setChapter={setChapter} loading={loading}
                        setLoading={setLoading} innerWidth={innerWidth}
                        oldChapter={oldChapter}
                        virtuosoRef={virtuosoRef}
                        setIsFullFieldUroid={setIsFullFieldUroid}
        />
      </div>
      {
        innerWidth > 3500 ?
          <div className={'pt-5 grid gap-2 grid-cols-12'}>
            {
              <div className={'col-span-2 h-full bg-white w-full flex justify-center'}>
                <LeftScenario chapter={chapter} setChapter={setChapter}
                              isFullFieldUroid={isFullFieldUroid}
                              virtuosoRef={virtuosoRef} fixed={fixed}/>
              </div>
            }

            <div
              className={`${!isCreateRoid && isShowTabPanel ? 'col-span-7' : !isCreateRoid && !isShowTabPanel ? 'col-span-9' :
                isCreateRoid && isShowTabPanel ? 'col-span-7' : 'col-span-5'} overflow-auto`}>
              <CenterScenario chapter={chapter} loading={loadingBlocks} blocks={blocks} setBlocks={setBlocks}
                              virtuosoRef={virtuosoRef}/>
            </div>
            <div
              className={`${!isCreateRoid && isShowTabPanel ? 'col-span-3' : !isCreateRoid && !isShowTabPanel ? 'col-span-1' :
                isCreateRoid && isShowTabPanel ? 'col-span-3' : 'col-span-5'} h-full w-full`}>
              <RightScenario fixed={fixed} virtuosoRef={virtuosoRef}/>
            </div>

          </div>
          :
          <div className={`grid grid-cols-12 gap-2`}>
            {
              <div className={`col-span-2 h-full bg-white w-full flex justify-center`}>
                <LeftScenario chapter={chapter}
                              setChapter={setChapter}
                              isFullFieldUroid={isFullFieldUroid}
                              virtuosoRef={virtuosoRef} fixed={fixed}/>
              </div>
            }
            <div
              className={`${!isCreateRoid && isShowTabPanel ? 'col-span-7' : !isCreateRoid && !isShowTabPanel ? 'col-span-9' :
                isCreateRoid && isShowTabPanel ? 'col-span-7' : 'col-span-9'} overflow-auto`}>
              <CenterScenario chapter={chapter} loading={loadingBlocks} blocks={blocks} setBlocks={setBlocks}
                              virtuosoRef={virtuosoRef}/>
            </div>
            <div
              className={`${!isCreateRoid && isShowTabPanel ? 'col-span-3' : !isCreateRoid && !isShowTabPanel ? 'col-span-1' :
                isCreateRoid && isShowTabPanel ? 'col-span-3' : 'col-span-1'} h-full w-full`}>
              <RightScenario fixed={fixed} virtuosoRef={virtuosoRef}/>
            </div>
          </div>
      }
    </div>
  );
}

export default Chapter;
