'use client'

import ArrowDown from "@/app/common/data/svgData/arrow-down-icon.svg";
import ArrowUp from "@/app/common/data/svgData/arrow-up-icon.svg";
import Layout1 from "@/app/common/data/svgData/layout-icon-1.svg";
import Layout2 from "@/app/common/data/svgData/layout-icon-2.svg";
import ButtonGroupCustom from "@/app/components/ButtonCustom";
import LayoutList from "@/app/components/Home/ContentLayout/LayoutList";
import LayoutGrid from "@/app/components/Home/ContentLayout/LayoutGrid";
import React, {useEffect, useMemo, useState} from "react";
import {useAtom, useAtomValue} from "jotai";
import {selectedFolderAtom} from "@/app/store/atom/selectedFolder.atom";
import {toDate} from "@/common/date";
import {
  collection,
  endBefore,
  limit,
  limitToLast,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  where
} from "firebase/firestore";
import {db} from "@/app/configs/firebase";
import {contentRef, getCountContent} from "@/app/common/firebase/contentRef";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import useFolders from "@/app/hooks/useFolders";
import {foldersAtom} from "@/app/store/atom/folders.atom";
import {layoutAtomWithStorage} from "@/app/store/atom/layout.atom";
import {arrangeAtomWithStorage} from "@/app/store/atom/arrange.atom";
import SideBarRight from "@/app/components/Layout/Sidebar/side-bar-right";
import {axiosConfigs} from "@/app/configs/axios";


type Props = {};

function HomePage({}: Props) {
  const [arrange, setArrange] = useAtom(arrangeAtomWithStorage);
  const [layout, setLayout] = useAtom(layoutAtomWithStorage)
  const [pageSize, setPageSize] = useState(4);
  const [contents, setContents] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [firstVisible, setFirstVisible] = useState(null);
  const [curPage, setCurPage] = useState(null)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false);
  const [userInfo] = useAtom<any>(userAtomWithStorage);
  const userId = userInfo?.user_id;
  const [countContent, setCountContent] = useState(0)
  const [folders, setFolders] = useAtom(foldersAtom)
  const [selectedFolder, setSelectedFolder] = useAtom(selectedFolderAtom);
  const [subFolder, setSubFolder] = useState([])
  useFolders()

  useEffect(() => {
    if (layout === 2) {
      setPageSize(18)
    } else {
      setPageSize(4)
    }
  }, [layout])

  useEffect(() => {
    if (!folders?.length || !selectedFolder?.id) return
    const result = folders?.filter(folder => folder.parentId === selectedFolder.id)
    setSubFolder(result)
  }, [folders, selectedFolder?.id])

  useEffect(() => {
    if (!userInfo.user_id || !selectedFolder.id)
      return
    setLoading(true)
    const firstContent = userId && selectedFolder.id && contentRef(userId, selectedFolder.id, pageSize, arrange);
    const unsubscribe = onSnapshot(firstContent, (documents) => {
      const _contents = [];
      documents.forEach((document) => {
        _contents.push({
          id: document.id,
          ...document.data(),
        });
      });
      getCountContent(userId, selectedFolder.id).then(res => {
        setCountContent(res)
      })
      setContents(_contents);
      setFirstVisible(documents.docs[documents.docs.length - 1]);
      setLastVisible(documents.docs[0]);
      setLoading(false)
    });
    return () => unsubscribe();
  }, [userInfo.user_id, selectedFolder.id, pageSize,arrange]);

  useEffect(() => {
    if (!curPage) return
    const unsub = onSnapshot(curPage, async documents => {
      if (documents.empty && page > 0) {
        previousPage(page === 1).then(() => {
          setPage(page - 1)
        })
      } else {
        updateState(documents)
        const res = await getCountContent(userId, selectedFolder.id)
        setCountContent(res)
      }
    })
    return () => {
      if (unsub)
        unsub()
    }
  }, [curPage, page])
  const nextPage = async () => {
    const next = query(
      collection(db, "contents"),
      where("userId", "==", userId),
      where("isDeleted", "==", false),
      where("folderId", "==", selectedFolder.id),
      orderBy("updatedAt", arrange === 1 ? "desc" : "asc"),
      startAfter(firstVisible),
      limit(pageSize)
    );
    setCurPage(next)
    // setLoading(true)
    // const documents = await getDocs(next);
    // updateState(documents);
    // setLoading(false)
  };
  const previousPage = async (isFirstPage = false) => {
    const firstContent = userId && selectedFolder.id && contentRef(userId, selectedFolder.id, pageSize, arrange);
    const prevPage = isFirstPage ? firstContent
      : query(
        collection(db, "contents"),
        where("userId", "==", userId),
        where("isDeleted", "==", false),
        where("folderId", "==", selectedFolder.id),
        orderBy("updatedAt", arrange === 1 ? "desc" : "asc"),
        endBefore(lastVisible),
        limitToLast(pageSize)
      );
    setCurPage(prevPage)
    // setLoading(true)
    // const documents = await getDocs(prevPage);
    // updateState(documents);
    // setLoading(false)
  };

  const updateState = (documents) => {
    if (!documents.empty) {
      const newPage = [];
      documents.forEach((document) => {
        newPage.push({
          id: document.id,
          ...document.data(),
        });
      });
      setContents(newPage);
    }
    if (documents?.docs[0]) {
      setLastVisible(documents.docs[0]);
    }
    if (documents?.docs[documents.docs.length - 1]) {
      setFirstVisible(documents.docs[documents.docs.length - 1]);
    }
  };

  const sortedContents = useMemo(() =>
    contents && [...contents]?.sort((a, b) => arrange === 1 ?
      toDate(b.updatedAt).valueOf() - toDate(a.updatedAt).valueOf() :
      toDate(a.updatedAt).valueOf() - toDate(b.updatedAt).valueOf()
    ), [contents, arrange])

  const buttonArrange = [
    {
      checkActive: arrange,
      button: <ArrowDown fill={`${arrange === 2 ? "gray" : "white"}`}/>,
      onClick: () => {
        setArrange(1)
      },
    },
    {
      checkActive: arrange,
      button: <ArrowUp fill={`${arrange === 1 ? "gray" : "white"}`}/>,
      onClick: () => {
        setArrange(2)
      },
    },
  ];


  const buttonLayout = [
    {
      checkActive: layout,
      button: <Layout1 fill={`${layout === 2 ? "gray" : "white"}`}/>,
      onClick: () => {
        setLayout(1)
        // setPageSize(4)
      },
    },
    {
      checkActive: layout,
      button: <Layout2 fill={`${layout === 1 ? "gray" : "white"}`}/>,
      onClick: () => {
        setLayout(2)
        // setPageSize(18)
      },
    },
  ];

  return (
    <div className="flex justify-between ">
      <div className="home flex flex-col w-full p-7 tablet:mr-[70px]">
        <div className="flex flex-col">
          <div className="w-full">
            <div className="flex justify-end gap-5">
              <ButtonGroupCustom
                className="bg-gray-200"
                buttonProps={buttonArrange}
              />
              <ButtonGroupCustom
                className="bg-gray-200"
                buttonProps={buttonLayout}
              />
            </div>
          </div>
          <div className="h-full">
            {layout === 1 ?
              <LayoutList
                parentId={selectedFolder?.id}
                subFolders={subFolder}
                previousPage={previousPage}
                nextPage={nextPage}
                page={page}
                setPage={setPage}
                data={sortedContents}
                countContent={countContent}
                pageSize={pageSize}
                loading={loading}
              /> :
              <LayoutGrid
                parentId={selectedFolder?.id}
                subFolders={subFolder}
                previousPage={previousPage}
                nextPage={nextPage}
                page={page}
                setPage={setPage}
                data={sortedContents}
                countContent={countContent}
                pageSize={pageSize}
                loading={loading}
              />}
          </div>
        </div>
      </div>
      <div className="hidden tablet:flex fixed right-0 top-0 pt-[64px] h-full">
        <SideBarRight folders={folders} setFolders={setFolders} selectedFolder={selectedFolder}
                      setSelectedFolder={setSelectedFolder} folderType={'content'}/>
      </div>
    </div>
  );
}

export default HomePage;
