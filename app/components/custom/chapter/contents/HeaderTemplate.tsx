import React, {Dispatch, MutableRefObject, SetStateAction, useEffect, useMemo, useState} from 'react';
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {blocksAtom} from "@/app/store/atom/blocks.atom";
import {cloneDeep, includes, toNumber, uniqBy} from "lodash";
import {createDataChapter, updateDataChapter} from "@/app/common/commonApis/chaptersApi";
import {useRouter, useSearchParams} from "next/navigation";
import "react-datepicker/dist/react-datepicker.css";
import 'moment/locale/it.js';
import {useGetChapterByContentId} from "@/app/hooks/useGetChaptersByContentId";
import {toast} from "react-toastify";
import {toDate} from "@/common/date";
import {customBlocks} from "@/app/common/customBlocks";
import {getDeeplink} from "@/app/common/deeplink"
import {genId} from "cf-gen-id";
import {Chapter, Character, DataStructure, DataStructureItem, ViewOptionForm} from "@/app/types/types";
import {getContentById, updateContent} from "@/app/common/commonApis/contentsApi";
import useLastSavedDate from "@/app/hooks/useLastSavedDate";
import {chapterIndex} from "@/app/common/getMaxChapterIndex";
import useContent from "@/app/hooks/useContent";
import PageTransferConfirmationDialog from "@/app/components/DialogCustom/PageTransferConfirmationDialog";
import {oldBlocksAtom} from "@/app/store/atom/oldBlocks.atom";
import isEqual from "react-fast-compare";
import {useCharacters} from "@/app/hooks/useCharacters";
import {selectedCharacterInContentAtom} from "@/app/store/atom/selectedCharacterInContent.atom";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {selectedStructureFolderAtom} from "@/app/store/atom/selectedFolder.atom";
import {deleteDataStructureItem,} from "@/app/common/commonApis/dataStructure";
import {getId} from "@/app/common/getId";
import {useStructureDataAtom} from "@/app/store/atom/structureData.atom";
import {BlockChatGptVersionSetting, BlockChatGptVersionUserChoice} from "@/app/types/block";
import CubeInputComp from "@/app/components/custom/chapter/contents/component/CubeInputComp";
import ChapterTitleComp from "@/app/components/custom/chapter/contents/component/ChapterTitleComp";
import {setCharsInContent} from "@/app/components/custom/chapter/contents/common/setCharsInConten";
import {hasVersionAtom} from "@/app/store/atom/hasVersion.atom";
import {publicList} from "@/app/components/custom/chapter/contents/common/publicList";
import {catchErrorWhenSaveChapter} from "@/app/common/catchErrorWhenSaveChapter";
import {getIdInValidVideo} from "@/app/common/getIdInValidVideo";
import {
  createAndUpdateDataStructureAtChapter
} from "@/app/components/custom/chapter/createAndUpdateDataStructureAtChapter";
import {dataStructureItems} from "@/app/components/custom/chapter/customDataStructureItems";
import {changeChapter} from "@/app/components/custom/chapter/switchChapter";
import MRoidAndUroidComp from "@/app/components/custom/chapter/contents/component/MRoidAndUroidComp";
import DeepLink from '../../DeepLink';
import CustomizedSwitch from "@/app/components/base/CustomizedSwitch";
import CollapseTitle from "@/app/components/custom/chapter/contents/component/CollapseTitle";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {IconButton} from "@mui/material";
import {useSetViewOptionByContent} from "@/app/hooks/useSetViewOptionByContent";
import {VirtuosoHandle} from "react-virtuoso";
import {chapterErrorAtom, updateChapterErrorAtom} from "@/app/store/atom/chapterError.atom";
import {isShowTabPanelAtom} from "@/app/store/atom/isShowTabPanel";
import useGetStructFolders from "@/app/hooks/useGetStructFolders";
import {structureIdInnChapterAtom} from "@/app/store/atom/structureIdsInChapter.atom";
import {FULL_FIELD_UROID, IMAGE_TYPE_UROID, isProd, PROMPT_TYPES} from "@/app/configs/constants";
import useStructureData from "@/app/hooks/useStructureData";
import KudenEmbedComp from "@/app/components/custom/chapter/contents/component/KudenEmbedComp";
import useEnecolors from "@/app/hooks/useEnecolors";
import useAdminEnecolors from "@/app/hooks/useAdminEnecolor";
import {useGetAllUserEnecolor} from "@/app/hooks/useGetAllUserEnecolor";
import SeparateCustom from "@/app/components/custom/SeparateCustom";
import useBlocks from "@/app/hooks/useBlocks";
import {saveButtonPropsAtom} from "@/app/components/Header/SaveButton";

type props = {
  subFolderId?: string | string[],
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
  chapter: Chapter
  setChapter: Dispatch<SetStateAction<Chapter>>
  oldChapter: Chapter
  innerWidth: number
  virtuosoRef: MutableRefObject<VirtuosoHandle | null>
  setIsFullFieldUroid?: Dispatch<SetStateAction<boolean>>
}

let id = genId({prefix: "chapter_", size: 8})

function HeaderScenario({
                          subFolderId,
                          loading,
                          setLoading,
                          chapter,
                          oldChapter,
                          setChapter,
                          innerWidth,
                          virtuosoRef,
                          setIsFullFieldUroid
                        }: props) {
  const router = useRouter()
  const {chapterId, contentId}: any = useSearchParams()
  const [blocks, setBlocks] = useAtom(blocksAtom)
  // const [ oldBlocks, setOldBlocks] = useAtom(oldBlocksAtom)
  const [contentData, setContentData] = useState<any>({})
  const [openInput, setOpenInput] = useState<boolean>(false)
  const [valueInput, setValueInput] = useState<number>(0)
  const {content} = useContent(contentId)
  const {chapters, loadingChapters} = useGetChapterByContentId(contentId as string)
  const {oldBlocks} = useBlocks(chapterId)

  const [viewOptionForms, setViewOptionForms] = useState<ViewOptionForm[]>([])
  // const [ids] = useAtom(structureIdInnChapterAtom)
  const [showQRCode, setShowQRCode] = useState<boolean>(false)
  const [loadingImg, setLoadingImg] = useState(false)
  const [collapse, setCollapse] = useState(true)
  const listOnlyChapter = chapters?.length ? chapters?.filter(i => !i.isBanner) : []
  // lastSaved
  const [lastSaved, setLastSaved] = useLastSavedDate();
  const [isShowDialog, setIsShowDialog] = useState<boolean>(false)
  const [isSwitch, setIsSwitch] = useState<string>('')
  const [pathName, setPathName] = useState<string>('')
  const [selectedCharsInContent, setSelectedCharacterContent] = useAtom(selectedCharacterInContentAtom)
  const [selectedCharsInContentState, setSelectedCharacterContentState] = useState<Character[]>([])
  const {characters} = useCharacters()
  const [theLatestChapter, setTheLatestChapter] = useState<Chapter>({})
  const [checkIsCreate, setCheckIsCreate] = useState<boolean>(true)
  const [userInfo] = useAtom(userAtomWithStorage);
  const [selectedStructFolder,] = useAtom(selectedStructureFolderAtom);
  const [listDataStructure] = useStructureDataAtom();
  const [isGetListDataStructure, setIsGetListDataStructure] = useState<boolean>(false);
  const contentStructItems = listDataStructure?.find((item) => item?.contentId === contentId)?.items || []
  const [, setHasVer] = useAtom(hasVersionAtom)
  const [checkThumb, setCheckThumb] = useState<boolean>(false)
  const setChapterError = useSetAtom(chapterErrorAtom)
  const chapterError = useAtomValue(chapterErrorAtom)
  const setIsShowTabPanel = useSetAtom(isShowTabPanelAtom)
  const updateChapterError = useSetAtom(updateChapterErrorAtom)
  const setIds = useSetAtom(structureIdInnChapterAtom)
  const [createId, setCreateId] = useState<string>('')

  useStructureData()
  useEnecolors()
  const {adminEnecolors} = useAdminEnecolors()
  useGetAllUserEnecolor(adminEnecolors)

  useEffect(() => {
    setCreateId(id)
  }, [])

  useEffect(() => {
    setIds(chapter?.dataStructureIds)
  }, [chapter?.dataStructureIds])

  useGetStructFolders()

  useEffect(() => {
    setChapterError({})
  }, [])

  useEffect(() => {
    if (chapter?.thumbnail || !chapter?.isPublicByContent ||
      (chapter?.isPublicByContent && !content?.viewOptions?.includes('productionMode'))) setCheckThumb(false)
  }, [chapter?.thumbnail, chapter?.isPublicByContent, content?.viewOptions])


  useSetViewOptionByContent(content?.viewOptions, setChapter, chapter)

  useEffect(() => {
    if (chapters?.length) {
      const _theLatestChapter = chapters.at(-1)
      setTheLatestChapter(_theLatestChapter)
    }
  }, [chapters])

  useEffect(() => {
    if (chapterId === 'createChapter' && !checkIsCreate) {
      // setTheLatestChapter(chapter)
      if (!subFolderId) {
        router.push(`/contents/${contentId}/${theLatestChapter.id}`)
      } else {
        router.push(`/contents/subFolder/${subFolderId}/subContent/${contentId}/${theLatestChapter.id}`)
      }
    }
  }, [theLatestChapter])
  const chars = useMemo(() => {
    const contentChars = characters?.filter((item) => content?.mentoroids?.find((id) => item?.id === id))
    const chapterChars = characters?.filter((item) => chapter?.mentoroids?.find((id) => item?.id === id))
    return uniqBy(contentChars?.concat(chapterChars), 'id')
  }, [characters, content?.mentoroids, chapter?.mentoroids])

  useEffect(() => {
    const _chars = chars?.map((item) => {
      return {
        ...item,
        isShow: !!chapter?.actionCharacterIds?.find((id) => item?.id === id),
        isChecked: !!chapter?.mentoroids?.concat(chapter?.uRoidTemplateIds).find((id) => item?.id === id)
      }
    })
    setSelectedCharacterContent(_chars)
    setSelectedCharacterContentState(_chars)
  }, [characters, content?.mentoroids, chapter?.actionCharacterIds])

  const isDirtyChapter = useMemo(() => {
    let _chapter = {...chapter} as Chapter
    if (chapterId === 'createChapter') return checkIsCreate
    if (content?.viewOptions?.includes('productionMode')) {
      _chapter = {
        ..._chapter,
        viewOptions: _chapter?.viewOptions?.filter(item => item !== 'productionMode')
      }
    }
    return (!isEqual(oldBlocks, blocks) ||
      !isEqual(_chapter, oldChapter) ||
      !isEqual(chapter?.uRoidTemplateId, oldChapter?.uRoidTemplateId))
  }, [oldBlocks, blocks, chapter, oldChapter, chapterId, checkIsCreate, oldChapter?.uRoidTemplateId, chapter?.uRoidTemplateId])
  const link = async (contentId, chapterId) => {
    try {
      return await getDeeplink({contentId, chapterId})
    } catch (err) {
      console.log(err);
      return {deeplink: ''}
    }
  }
  useEffect(() => {
    router.beforePopState((cb) => {
      if (window["isDirtyChapter"]) {
        setIsShowDialog(true)
        setPathName(cb.as)
        return false;
      }
      if (includes(cb.as ?? '', chapterId)) {
        router.push(`/contents/${contentId}/${chapterId}`)
        setIsShowDialog(false)
        setPathName('')
        return
      }
      setIsShowDialog(false)
      setPathName('')
      return true;
    })
  }, [])

  useEffect(() => {
    const newMode = publicList?.map((i: any) => {
      i.value === "isTool" ? i.checked = chapter?.isTool : i.checked = includes(content?.viewOptions ?? [], i.value);
      return i
    })
    setViewOptionForms(newMode)
  }, [chapter?.isTool, content?.viewOptions])


  useEffect(() => {
    if (chapterId !== "createChapter" || !viewOptionForms?.length || !content?.viewOptions?.length) return
    let newViewOptionForms = [...viewOptionForms]
    content.viewOptions.forEach(option => {
      const idx = newViewOptionForms.findIndex(item => item.value === option)
      if (idx !== -1)
        newViewOptionForms[idx].checked = true
    })
    setViewOptionForms(newViewOptionForms)
  }, [chapterId, content?.viewOptions])

  useEffect(() => {
    setValueInput(toNumber(chapter?.cube) || 0)
  }, [chapter])

  useEffect(() => {
    if (contentId) {
      if (chapterId === "createChapter" && !chapter?.deeplink)
        link(contentId, id).then(({deeplink}) => setChapter({
          deeplink
        }))
      getContentById(contentId)
        .then((res) => {
          setContentData(res)
        })
        .catch((e) => {
          console.log(e);
        })
    }
  }, [contentId, chapterId, chapter?.deeplink])

  const charIds = useMemo(() => {
    return selectedCharsInContentState?.reduce((acc, obj) => {
      if (!obj.isShow) return [...acc]
      return [...acc, obj.id];
    }, []);
  }, [selectedCharsInContentState])

  const oldVersionUserChoiceBlock = oldBlocks?.find(item => item.type === 'versionUserChoice' ||
    item.type === 'versionSetting') as (BlockChatGptVersionUserChoice | BlockChatGptVersionSetting)

  const findPublicChapter = chapters?.find(item => item.isPublicByContent)

  useEffect(() => {
    if (loadingChapters) return;
    const updateContentData = async () => {
      try {
        if (!findPublicChapter) {
          await updateContent({
            ...content,
            viewOptions: content?.viewOptions?.filter(item => item !== 'productionMode')
          })
        }
      } catch (e) {
        console.log(e);
      }
    }
    updateContentData().then()
  }, [findPublicChapter])

  const createRoidBlocks = blocks?.filter(item => FULL_FIELD_UROID.includes(item?.type))?.map(item => item?.type)
  const condition = isEqual(createRoidBlocks?.sort(), FULL_FIELD_UROID?.sort())
  const checkHasImageBlock = blocks?.find(item => IMAGE_TYPE_UROID.includes(item?.type))
  useEffect(() => {
    if (condition && checkHasImageBlock) {
      setIsFullFieldUroid(false)
    }
  }, [condition, checkHasImageBlock])
  const mentoroids = chapter?.mentoroids?.filter(item => !content?.mentoroids?.find(c => c === item) && !item?.includes('uRoidTemp_')) ?? chapter?.actionCharacterIds ?? [];

  const onSaveChapter = async (type ?: string) => {
    setChapterError({})
    const _blocks = cloneDeep(blocks)
    const checkHasChatGPT = _blocks?.find(item => PROMPT_TYPES.includes(item?.type))
    const isCreateChapter = chapter?.chapterType === "createURoid"
    if (isCreateChapter) {
      if (!condition || !checkHasImageBlock) {
        setIsFullFieldUroid(true)
        toast.error('全てURoidのブロックを追加してください。', {autoClose: 3000});
        return;
      }
    }
    const checkHasVer = _blocks.find(block => block.type === 'versionUserChoice' || block.type === 'versionSetting' || block.type === 'continuousChat')
    setIsGetListDataStructure(!isGetListDataStructure)
    try {
      catchErrorWhenSaveChapter(chapter, _blocks, virtuosoRef, updateChapterError, collapse, setCollapse)
    } catch (e) {
      toast.error(e.message, {autoClose: 3000});
      return;
    }
    const dataStructures: DataStructure[] = [{
      id: listDataStructure?.find((item) => item?.contentId === contentId)?.id || getId('storage_', 10),
      name: content?.title,
      items: dataStructureItems({_blocks, contentStructItems}) as DataStructureItem[],
      contentId: contentId,
      folderId: selectedStructFolder?.id,
      userId: userInfo?.user_id,
      index: listDataStructure?.find((item) => item?.contentId === contentId)?.index || listDataStructure?.length || 0
    }satisfies DataStructure]

    try {
      setLoading(true)
      setHasVer(checkHasChatGPT && !checkHasVer)
      if (checkHasChatGPT && !checkHasVer) {
        updateChapterError({checkHasChatGPT: 'バージョンを設定してください。'})
        setIsShowTabPanel(true)
        virtuosoRef.current.scrollToIndex({
          index: 1,
          align: "start",
          behavior: "auto"
        });
        toast.error('バージョンを設定してください。', {autoClose: 3000});
        return;
      }

      if (!chapter?.thumbnail && chapter?.isPublicByContent && content?.viewOptions?.includes('productionMode') ||
        (chapter?.chapterType === 'createURoid' && !chapter?.thumbnail)) {
        if (!collapse) {
          setCollapse(true)
        }
        setCheckThumb(true)
        updateChapterError({thumb: 'サムネイルを設定してください。'})
        virtuosoRef.current.scrollToIndex({
          // @ts-ignore
          index: _blocks[0],
          align: "start",
          behavior: "auto"
        });
        toast.error('サムネイルを設定してください。', {autoClose: 3000});
        return
      }
      const storage = listDataStructure?.find(item => item?.contentId === contentId)
      const newBlocks = await Promise.all(_blocks?.map(async (block) => {
        const props = {
          _blocks: _blocks,
          block: block,
          dataStructures: dataStructures,
          storage: storage,
          oldVersionUserChoiceBlock: oldVersionUserChoiceBlock,
          contentId: contentId,
          contentStructItems: contentStructItems
        }
        return createAndUpdateDataStructureAtChapter(props)
      }))
      const versionBlock = blocks?.find(item => item.type === 'versionUserChoice' || item.type === 'versionSetting') as (BlockChatGptVersionUserChoice | BlockChatGptVersionSetting)
      const checkItemIsExist = dataStructureItems({
        _blocks: _blocks,
        contentStructItems: contentStructItems
      })?.find(item => item.id === versionBlock?.data?.dataStructureId)
      if (versionBlock && !versionBlock?.data.chatTitle && Boolean(checkItemIsExist)) {
        await deleteDataStructureItem(storage.id, versionBlock?.data?.dataStructureId)
      }
      const theSameData: Chapter = {
        ...chapter,
        contentId: contentId,
        // isTool: viewOptionForms.some(item => item.value === "isTool" && item.checked),
        isPublicByContent: chapter?.isPublicByContent,
        isAbleComment: chapter?.isAbleComment,
        isBanner: false,
        publishedDate: chapter?.publishedDate ? toDate(chapter.publishedDate) : null,
        // viewOptions: viewOptionForms.filter((i: any) => i.checked === true && i.value !== "isTool")?.map((i: any) => i.value),
        blocks: customBlocks(newBlocks),
        actionCharacterIds: charIds,
        uRoidTemplateId: chapter?.uRoidTemplateId || '',
        chapterType: chapter?.chapterType || 'standard',
        viewOptions: chapter?.viewOptions?.filter((i: string) => i !== "productionMode"),
        mentoroids: mentoroids,
        uRoidTemplateIds: chapter?.mentoroids.filter(item => item?.includes('uRoidTemp_')) || [],
        embedData: chapter?.embedData,
        separateSettings: chapter?.separateSettings,
      }
      const data: Chapter = {
        ...theSameData,
        id,
        chapterIndex: chapterIndex(chapters),
      }
      const updateData: Chapter = {
        ...theSameData,
        id: chapterId,
        chapterIndex: chapter?.chapterIndex,
      }
      if (chapterId === "createChapter") {
        await createDataChapter(data)
        id = genId({prefix: "chapter_", size: 8})
        toast.success('チャプターを作成しました', {autoClose: 3000})
        if (type === 'preview') {
          if (isProd()) {
            window.open(`https://embed.geniam.com/run/${chapterId === "createChapter" ? createId : chapterId}`)
          } else {
            window.open(`https://embed-stg.geniam.com/run/${chapterId === "createChapter" ? createId : chapterId}`)
          }
        }
        setCheckIsCreate(false)
      } else {
        await updateDataChapter(updateData)
        if (type === 'preview') {
          if (isProd()) {
            window.open(`https://embed.geniam.com/run/${chapterId}`)
          } else {
            window.open(`https://embed-stg.geniam.com/run/${chapterId}`)
          }
        }
        toast.success('チャプターを更新しました', {autoClose: 3000})
      }
      setLastSaved({...lastSaved, [chapterId]: Date.now()})
    } catch (e) {
      console.log(e);
      toast.error("保存に失敗しました" + (e?.response?.data?.message || e.message), {autoClose: 3000});
    } finally {
      setLoading(false)
      const idInValid = getIdInValidVideo(blocks)
      scrollToErrVideoBlock(idInValid)
    }
  }

  const scrollToErrVideoBlock = (idInvalid) => {
    const element = document.getElementById(idInvalid);
    element?.focus()
    element?.blur()
    element?.scrollIntoView({behavior: 'smooth'});
  }

  const setSaveButtonProps = useSetAtom(saveButtonPropsAtom);
  useEffect(() => {
    window["isDirtyChapter"] = isDirtyChapter;
    setSaveButtonProps({
      isDirty: isDirtyChapter,
      loading: loading,
      onSave: onSaveChapter,
      blocks,
      chapter
    })
  }, [isDirtyChapter, loading, onSaveChapter, blocks, chapter])

  const setStuffAfterSwitchChapter = () => {
    setIsShowDialog(false)
    setIsSwitch('')
    setPathName('')
    window["isDirtyChapter"] = false
  }

  function switchChapter(type: string) {
    changeChapter({
      type,
      listOnlyChapter,
      chapterId, contentId,
      subFolderId,
      setStuffAfterSwitchChapter,
      router
    })
  }

  useEffect(() => {
    if (!blocks?.length) return
    setCharsInContent(selectedCharsInContent, blocks, setBlocks)
  }, [selectedCharsInContent])

  const onChangeCollapse = () => {
    setCollapse(!collapse)
  }
  const onChangePage = () => {
    if (isSwitch !== '')
      return switchChapter(isSwitch)
    else {
      router.push(`${pathName !== '' ? pathName : `/contents/${contentId}`}`)
      setIsShowDialog(false)
      setIsSwitch('')
      setPathName('')
      window["isDirtyChapter"] = false
    }
  }
  const onChangeCanComment = () => {
    setChapter({isAbleComment: !chapter.isAbleComment})
  }

  return (
    <div>
      <div className="relative mt-3 w-full bg-blue-300 font-bold text-xl text-black flex justify-center">
        <CollapseTitle chapter={chapter}
                       setChapter={setChapter}
                       content={content}
                       viewOptionForms={viewOptionForms}/>
        <div className={'absolute right-3 translate-y-1/3 '}>
          <IconButton onClick={onChangeCollapse} className={''}>
            {collapse ? <KeyboardArrowUpIcon/> :
              <KeyboardArrowUpIcon className={'rotate-180'}/>}
          </IconButton>
        </div>
      </div>

      <div
        className={` ${collapse ? 'h-[280px] py-4' : 'h-0'} bg-blue-100 px-2 flex justify-between duration-300`}>
        {
          collapse &&
          <div className={'flex duration-500 w-full justify-between'}>
            <ChapterTitleComp
              oldChapter={oldChapter}
              virtuosoRef={virtuosoRef}
              checkThumb={checkThumb}
              contentData={contentData}
              chapterId={chapterId} chapter={chapter}
              setChapter={setChapter}
              chapters={chapters}
              isDirtyChapter={isDirtyChapter}
              setIsShowDialog={setIsShowDialog}
              setIsSwitch={setIsSwitch} loadingImg={loadingImg}
              setLoadingImg={setLoadingImg} switchChapter={switchChapter}/>
            <div className={'flex flex-col '}>
              <MRoidAndUroidComp selectedCharacters={selectedCharsInContentState} innerWidth={innerWidth}
                                 content={content}
                                 chapterId={chapterId}
                                 blocks={blocks} setBlocks={setBlocks}
                                 setSelectedCharacters={setSelectedCharacterContentState}
                                 characters={characters} chapter={chapter} setChapter={setChapter}/>
              {/*<DataStructureChapter setChapter={setChapter} chapter={chapter}></DataStructureChapter>*/}
              <SeparateCustom
                state={chapter}
                setState={setChapter}
                user_id={userInfo?.user_id}
                forType={'chapter'}
              />
            </div>
            <div>
              <KudenEmbedComp
                onSave={(type) => onSaveChapter(type)}
                isChapter={true}
                chapterGenId={id}
                contentId={contentId}
                data={chapter}
                setData={setChapter}/>
            </div>
            <div>
              <DeepLink link={chapter?.deeplink} showQRCode={showQRCode}
                        setShowQRCode={setShowQRCode} chapter={chapter}
                        setChapter={setChapter}/>
              <div className={'flex justify-between'}>
                <div className={'flex gap-5 mt-5 items-center'}>
                  <span>このシナリオのコメント機能</span>
                  {
                    chapter &&
                    <CustomizedSwitch onChange={onChangeCanComment} checked={chapter && chapter?.isAbleComment}
                    />
                  }
                </div>
                {/*<SettingCubeComp chapter={chapter} onClick={() => setOpenInput(true)}/>*/}
              </div>
            </div>
          </div>
        }
      </div>

      {
        <CubeInputComp openInput={openInput}
                       setOpenInput={setOpenInput}
                       setValueInput={setValueInput}
                       valueInput={valueInput}
                       chapter={chapter}
                       setChapter={setChapter}/>
      }
      {
        isShowDialog && <PageTransferConfirmationDialog
          open={isShowDialog} setOpen={setIsShowDialog}
          onClickTextButton={onChangePage}
          onClickContainedButton={() => {
            if (pathName !== "")
              router.push(`/contents/${contentId}/${chapterId}`);
            setPathName('')
            setIsSwitch('')
            setIsShowDialog(false)
            window["isDirtyChapter"] = false
          }}
          title={'保存せずにページを移動しようとしています。'}
          content={'このままページを移動すると変更内容が保存されません。'}
          titleTextButton={'移動する'} titleContainedButton={'ページに戻る'}/>
      }
    </div>
  );
}

export default HeaderScenario;
