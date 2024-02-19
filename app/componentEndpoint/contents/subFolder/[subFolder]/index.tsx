import React, {useEffect, useMemo, useState} from "react";
import ArrowDown from "@/app/common/data/svgData/arrow-down-icon.svg";
import ArrowUp from "@/app/common/data/svgData/arrow-up-icon.svg";
import ButtonGroupCustom from "@/app/components/ButtonCustom";
import {Button} from "@mui/material";
import {useRouter, useSearchParams} from "next/navigation";
import {useAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {contentRef, getCountContent} from "@/app/common/firebase/contentRef";

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
import Layout1 from "@/app/common/data/svgData/layout-icon-1.svg";
import Layout2 from "@/app/common/data/svgData/layout-icon-2.svg";
import LayoutList from "@/app/components/Home/ContentLayout/LayoutList";
import LayoutGrid from "@/app/components/Home/ContentLayout/LayoutGrid";
import {foldersAtom} from "@/app/store/atom/folders.atom";
import {selectedFolderAtom} from "@/app/store/atom/selectedFolder.atom";
import {toDate} from "@/common/date";
import SideBarRight from "@/app/components/Layout/Sidebar/side-bar-right";

type Props = {}

function Index({}: Props) {
  const [arrange, setArrange] = useState(1);
  const [layout, setLayout] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [contents, setContents] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [firstVisible, setFirstVisible] = useState(null);
  const [curPage, setCurPage] = useState(null)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false);
  const [userInfo] = useAtom<any>(userAtomWithStorage);
  const userId = userInfo?.user_id;
  const [countContent, setCountContent] = useState(0)
  const router = useRouter();
  const searchParams = useSearchParams();
  const [folders, setFolders] = useAtom(foldersAtom)
  const [selectedFolder, setSelectedFolder] = useAtom(selectedFolderAtom);
  const subFolderId = searchParams.get('subFolder') as string;

  useEffect(() => {
    if (!userInfo.user_id)
      return
    setLoading(true)
    const firstContent = userId && subFolderId && contentRef(userId, subFolderId, pageSize,arrange);
    const unsubscribe = onSnapshot(firstContent, (documents) => {
      const _contents = [];
      documents.forEach((document) => {
        _contents.push({
          id: document.id,
          ...document.data(),
        });
      });
      getCountContent(userId, subFolderId).then(res => {
        setCountContent(res)
      })
      setContents(_contents);
      setFirstVisible(documents.docs[documents.docs.length - 1]);
      setLastVisible(documents.docs[0]);
      setLoading(false)
    });
    return () => unsubscribe();
  }, [userInfo.user_id, subFolderId, pageSize]);

  useEffect(() => {
    if (!curPage) return
    const unsub = onSnapshot(curPage, async documents => {
      if (documents.empty && page > 0) {
        previousPage(page === 1).then(() => {
          setPage(page - 1)
        })
      } else {
        updateState(documents)
        const res = await getCountContent(userId, subFolderId)
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
      where("folderId", "==", subFolderId),
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
    const firstContent = userId && subFolderId && contentRef(userId, subFolderId, pageSize,arrange);
    const prevPage = isFirstPage ? firstContent : query(
      collection(db, "contents"),
      where("userId", "==", userId),
      where("isDeleted", "==", false),
      where("folderId", "==", subFolderId),
      orderBy("updatedAt", "desc"),
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
      toDate(b.createdAt).valueOf() - toDate(a.createdAt).valueOf() :
      toDate(a.createdAt).valueOf() - toDate(b.createdAt).valueOf()), [contents, arrange])
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
        setPageSize(3)
      },
    },
    {
      checkActive: layout,
      button: <Layout2 fill={`${layout === 1 ? "gray" : "white"}`}/>,
      onClick: () => {
        setLayout(2)
        setPageSize(15)
      },
    },
  ];

  return (
    <div className="flex justify-between ">
      <div className="home flex flex-col w-full p-7 tablet:mr-[70px]">
        <div className="flex flex-col gap-7">
          <div className="w-full flex items-center justify-between">
            <Button variant='contained'
                    onClick={() => router.push(`/contents`)}>戻る</Button>
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
                parentId={subFolderId}
                isSubFolder
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
                parentId={subFolderId}
                isSubFolder
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
        <SideBarRight folders={folders} selectedFolder={selectedFolder} setFolders={setFolders}
                      setSelectedFolder={setSelectedFolder} folderType={'content'}/>
      </div>
    </div>
  );
}

export default Index;
