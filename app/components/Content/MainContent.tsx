import React, {useState} from "react";
import Image from "next/image";
import Button from "@mui/material/Button";
import InputAndImageContent from "./InputAndImageContent";
import BillingContentDialog from "@/app/components/Content/dialog/BillingContentDialog";
import useContent from "@/app/hooks/useContent";
import useStructureData from "@/app/hooks/useStructureData";
import {useAtom, useAtomValue} from "jotai";
import {useRouter, useSearchParams} from "next/navigation";
import ViewOptionsContent from "@/app/components/Content/ViewOptionsContent";
import MentoroidListContent from "@/app/components/Content/MentoroidListContent";
import {Content, ContentState} from "@/app/types/content";
import AddImageContentDialog from "@/app/components/Content/dialog/AddImageContentDialog";
import axios from "axios";
import {LoadingPageCustom} from "@/app/components/custom/LoadingPageCustom";
import {toast} from "react-toastify";
import {initialState} from "@/app/components/Content/data/data";
import useSetFieldContent from "@/app/hooks/useSetFieldContent";
import {CONTENTS} from "@/app/auth/urls";
import {selectedFolderAtom} from "@/app/store/atom/selectedFolder.atom";
import {useGetChapterByContentId} from "@/app/hooks/useGetChaptersByContentId";
import moment from "moment";
import ChapterBannerContent from "@/app/components/Content/ChapterBannerContent";
import DeepLink from "@/app/components/custom/DeepLink";
import useFolder from "@/app/hooks/useFolders";
import useCheckDirty from "@/app/hooks/useCheckDirty";
import SaveIcon from "@mui/icons-material/Save";
import AddBannerDialog from "@/app/components/Home/ContentLayout/AddBannerDialog";
import {useCharacters} from "@/app/hooks/useCharacters";
import {LockContent} from "@/app/components/base/lockContent/LockContent";
import {FormControlLabel} from "@mui/material";
import {BillingOptionContent} from "@/app/components/Content/dialog/BillingOptionContent";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import CustomizedSwitch from "@/app/components/base/CustomizedSwitch";
import {isProd, plans} from "@/app/configs/constants";
import {updateContent} from "@/app/common/commonApis/contentsApi";
import {saveError, saveSuccess} from "@/app/services/content";
import {CF_EMAIL, OWNER_EMAILS, OWNER_ID} from "@/common/ownerId";
import {changeStateValueSetting} from "@/app/common/chapterPurchaseSetting";
import KudenEmbedComp from "@/app/components/custom/chapter/contents/component/KudenEmbedComp";
import ListButtonAddNewTypeOfChapter from "@/app/components/Content/custom/ListButtonAddNewTypeOfChapter";
import AddIcon from "@mui/icons-material/Add";
import {isEnterpriseAtom} from "@/app/store/atom/isEnterprise.atom";
import {chapterIndex} from "@/app/common/getMaxChapterIndex";
import {getPlanJpText} from "@/app/common/getPlanJpText";
import SeparateCustom from "@/app/components/custom/SeparateCustom";


interface MainContentProps {
  id: string
  subFolder?: string
}

function MainContent({id, subFolder}: MainContentProps) {
  useStructureData();
  useCharacters()
  const selectedFolder = useAtomValue(selectedFolderAtom);
  const router = useRouter();
  const searchParams = useSearchParams()
  const courseId = searchParams.get('contentId') as string;
  const {content, setContent, loading: contentLoading} = useContent(id);
  // const {isOpenModal, toggleOpenModal} = useModal();
  // const selectedDataStructureContent = useAtomValue(selectedDataStructureContentAtom)
  const [openBilling, setOpenBilling] = useState(false);
  const [openUploadImage, setOpenUploadImage] = useState(false);
  const [state, setState] = useState<ContentState>(initialState)
  // const [mentoroids, setMentoroids] = useState([])
  const [addBanner, setAddBanner] = useState(false)
  const {characters} = useCharacters()
  const [userInfo] = useAtom<any>(userAtomWithStorage)
  const isLocked = (userInfo?.plan === plans.at(0) || !userInfo?.plan) && !userInfo?.email?.includes(CF_EMAIL) && !OWNER_EMAILS?.includes(userInfo?.email)
  const plan = getPlanJpText(userInfo?.plan)
  const checkIsFreePlan = plan === 'フリー'
  const checkIsClassFunc = userInfo?.email.includes(CF_EMAIL)
  const [isEnterprise, ] = useAtom(isEnterpriseAtom)
  const isSuperAdmin = userInfo?.user_id === OWNER_ID
  const isProUser = OWNER_EMAILS?.includes(userInfo?.email)
  const lockCondition = checkIsFreePlan && !checkIsClassFunc && !isEnterprise && !isSuperAdmin && !isProUser

  const [isEnterPrise, ] = useAtom(isEnterpriseAtom)
  const cubeOptionDraft = {
    basic: {
      freeAll: state.freeAll,
      waitForFree: state.waitForFree,
      purchaseAll: state.purchaseAll
    },
    chapter: {
      free: state.freeData,
      waitForFree: state.waitForFreeData,
      purchase: state.purchaseData,
      listChanged: state.listChanged || [],
      changed: state.changed
    },
    cube: state.cube
  };
  const {chapters, setChapters} = useGetChapterByContentId(id, cubeOptionDraft)
  const [contentId, setContentId] = useState<string>("")
  const [deeplink, setDeeplink] = useState<string>("")
  useFolder()
  const {setFieldContent} = useSetFieldContent({
    setState,
    content,
    setContentId,
    setDeeplink,
    id
  });
  const {isDirty} = useCheckDirty({content, state})
  const handleChangeState = (field: string) => (value: any) => {
    const newValue = changeStateValueSetting(field, value, state, chapters);
    if (newValue != null) {
      const _state = {...state}
      _state[field] = newValue
      setState(_state)
    }
  }

  const handleChangeIsAbleComment = async (e) => {
    if (id === "create") {
      handleChangeState('isAbleComment')(!state.isAbleComment)
      return
    }
    try {
      const _content: Content = {...content, isAbleComment: !content.isAbleComment}
      setContent(_content)
      await updateContent(_content)
      saveSuccess()
    } catch (e) {
      setContent(content)
      saveError()
      console.log(e);
    }
  }

  // const dataStructureIds = useMemo(() => selectedDataStructureContent.map((data) => data.id), [selectedDataStructureContent]);
  const _content: Content = {
    ...content,
    title: state.title,
    imageTitle: state.imageTitle,
    description: state.description,
    deeplink,
    mentoroids: characters?.filter(item => item?.isChecked)?.map(c => c.id) ?? content?.mentoroids ?? [],
    thumbnail: state.thumb,
    // dataStructureIds,
    cubeOptions: {
      cube: state.cube,
      basic: {
        waitForFree: state.waitForFree,
        freeAll: state.freeAll,
        purchaseAll: state.purchaseAll,
      },
      chapter: {
        free: state.freeData,
        purchase: state.purchaseData,
        waitForFree: state.waitForFreeData,
      },
    },
    viewOptions: state.viewOptions,
    releaseOptions: state.releaseOptions,
    // categoriesId: state.categoriesId,
    isAbleComment: state.isAbleComment,
    categories: state.categoriesId?.map((id: string, index: number) => {
      return {id, index}
    }),
    adviceC: state.adviceC,
    schoolAI: state.schoolAI,
    businessB: state.businessB,
    embedData: {
      ...content?.embedData,
      embedHtml: state.embedData?.embedHtml,
      src: state.embedData?.src,
      embedHeight: state.embedData?.embedHeight,
      embedWidth: state.embedData?.embedWidth,
      isResponsive: state.embedData?.isResponsive,
    },
    separateSettings: {
      ...content?.separateSettings,
      title: state.separateSettings?.title,
      description: state.separateSettings?.description,
      thumbnail: state.separateSettings?.thumbnail,
    },
  };
  const handleSave = async (type ?: string) => {
    const prodMode = state.viewOptions?.includes('productionMode')
    handleChangeState("saveLoading")(true);
    const checkHasChar = Boolean(content?.mentoroids?.length)
    if (!state.title) {
      handleChangeState("saveLoading")(false);
      toast.error("タイトルを入力してください。", {autoClose: 3000})
      return
    }
    if (!checkHasChar && prodMode) {
      handleChangeState("saveLoading")(false);
      toast.error("メンタロイドを選択してください。", {autoClose: 3000})
      return
    }
    if (!state.thumb && prodMode) {
      handleChangeState("saveLoading")(false);
      toast.error("サムネイルを選択してください。", {autoClose: 3000})
      return
    }
    if(!_content?.embedData?.isResponsive && (!_content?.embedData?.embedHeight || !_content?.embedData?.embedWidth)){
      handleChangeState("saveLoading")(false);
      toast.error("埋め込みコードのサイズを入力してください。", {autoClose: 3000})
      return
    }
    try {
      if (id === "create") {
        const createContent = {
          ..._content,
          id: contentId,
          folderId: subFolder ? subFolder : selectedFolder?.id,
          embedData: {
            ..._content.embedData,
            embedWidth: _content.embedData?.isResponsive ? '100%' : _content.embedData?.embedWidth,
            embedHeight: _content.embedData?.isResponsive ? '100%' : _content.embedData?.embedHeight,
          },
          separateSettings: {
            ..._content.separateSettings,
            thumbnail: _content.separateSettings?.thumbnail,
            description: _content.separateSettings?.description,
            title: _content.separateSettings?.title,
          }
        };
        await axios.post(`${CONTENTS}/create`, createContent);
        subFolder ? await router.push(`/contents/subFolder/${subFolder}`) : await router.push("/contents")
        if(type === 'preview') {
          if (isProd()) {
            window.open(`https://embed.geniam.com/run/${contentId}`)
          } else {
            window.open(`https://embed-stg.geniam.com/run/${contentId}`)
          }
        }
      } else {
        setContent(_content)
        await axios.post(`${CONTENTS}/update`, _content);
      }
      toast.success("保存しました", {autoClose: 3000});
    } catch (e) {
      setContent(content)
      console.log(e);
    } finally {
      handleChangeState("saveLoading")(false);
    }
  };

  const onOpenPreview = ( type : string) => {
    if(!content?.viewOptions?.includes('productionMode')){
      toast.error("プレビューはラボへ公開でのみご利用いただけます。", {autoClose: 3000})
      return;
    }
    if(type === 'preview') {
      if (isProd()) {
        window.open(`https://embed.geniam.com/run/${contentId}`)
      } else {
        window.open(`https://embed-stg.geniam.com/run/${contentId}`)
      }
    }
  }

  const handleOnClickCreateChapter = (event) => {
    event.preventDefault()
    if (event.metaKey || event.ctrlKey) {
      window.open(!subFolder ? `/contents/${contentId}/createChapter` : `/contents/subFolder/${subFolder}/subContent/${contentId}/createChapter`, "_blank")
    } else {
      router.push(!subFolder ? `/contents/${contentId}/createChapter` : `/contents/subFolder/${subFolder}/subContent/${contentId}/createChapter`)
    }
  }

  moment.locale('ja', {weekdaysShort: ['日', '月', '火', '水', '木', '金', '土']});
  return (
    <div className="w-full p-5 relative overflow-hidden">
      {(state?.saveLoading || contentLoading) && <LoadingPageCustom/>}
      <div className="w-full flex flex-wrap gap-6 mb-5">
        <div className={"md:min-w-[100%] lg:min-w-[50%] xl:min-w-[30%]"}>
          {id === "create" &&
            <Button
              className="capitalize font-bold mb-6"
              variant="contained"
              endIcon={<SaveIcon/>}
              onClick={()=>handleSave()}
              disabled={!isDirty}
            >
              保存
            </Button>
          }
          <div className={'flex flex-col'}>
            <InputAndImageContent
              contentId={id}
              handleChangeState={handleChangeState}
              state={state}
              setOpen={setOpenUploadImage}
              open={openUploadImage}
              setState={setState}
              content={content ?? _content}
            />
            <SeparateCustom
              separate={content}
              setSeparate={setContent}
              state={state}
              setState={setState}
              user_id={userInfo?.user_id}
              forType={'content'}
            />
          </div>

        </div>
        <div>
          <div className={"mt-[10px] flex items-center justify-between"}>
            <MentoroidListContent content={content} characters={characters} contentLoading={contentLoading}/>
            <Image src="/icons/content/slide.svg" alt="" width={24} height={30} className={"mr-2 mb-4 cursor-pointer"}
                   onClick={() =>
                     router.push("/slides/")
                   }/>
            {/*<Image src="/icons/content/sheet.svg" alt="" width={24} height={30} className={"mb-4 cursor-pointer"}*/}
            {/*       onClick={() =>*/}
            {/*         router.push("/spreadsheets/")*/}
            {/*       }/>*/}
          </div>
          {/*<div className={"text-sm mb-4 text-black"}> 常に使うデータ構造</div>*/}
          {/*<DataStructureContent isOpenModal={isOpenModal} toggleOpenModal={toggleOpenModal}*/}
          {/*                      handleChangeState={handleChangeState} loading={state.saveLoading}/>*/}

          <KudenEmbedComp contentId={contentId}
                          data={state}
                          setData={setState}
                          isChapter={false}
                          content={content}
                          onPreviewOnContent={(type)=>`${ id === 'create' ? handleSave('preview')  : onOpenPreview(type)}`}
          />
        </div>
        <div className={'max-w-[430px]'}>
          <DeepLink
            inContent={true}
            link={deeplink}
            showQRCode={state.showQRCode}
            setShowQRCode={handleChangeState('showQRCode')}
          />
          <div className="flex flex-wrap mb-2 justify-between">
            <div>
              <BillingOptionContent setOpenBilling={setOpenBilling} courseId={courseId} cube={state.cube}/>
            </div>
            <div>
              <div className={'flex w-full justify-end'}>
                <ViewOptionsContent
                  isEnterprise={isEnterPrise}
                  className={'max-w-fit'}
                  viewOptions={state.viewOptions}
                  setViewOptions={handleChangeState('viewOptions')}
                  content={content}
                  setContent={setContent} id={id}
                  chapters={chapters}
                />
              </div>
              <LockContent isLocked={isLocked}
                           className={'flex-row-reverse justify-end py-0 flex-none w-fit mt-2 pr-0'}>
                <FormControlLabel labelPlacement="start"
                                  control={<CustomizedSwitch checked={state.isAbleComment}
                                                             onChange={handleChangeIsAbleComment}
                                  />}
                                  label="コメント機能のデフォルト設定" className={'m-0 gap-4'}/>
              </LockContent>
              {/*<PublishedClassContent*/}
              {/*  state={state}*/}
              {/*  handleChangeState={handleChangeState}*/}
              {/*  content={content}*/}
              {/*  setContent={setContent} id={id}*/}
              {/*/>*/}
            </div>
            {/*<PublishedDateContent*/}
            {/*  releaseOptions={state.releaseOptions}*/}
            {/*  setReleaseOptions={handleChangeState('releaseOptions')}*/}
            {/*  content={content}*/}
            {/*/>*/}
          </div>
        </div>
      </div>
      {content ?
        <>
          <div className={'flex items-center gap-2 pb-2'}>
            <Button
              className="capitalize h-9 font-bold text-xs min-w[40px]"
              variant="contained"
              endIcon={<Image src="/icons/content/add.svg" alt="" width={14} height={14}/>}
              onClick={handleOnClickCreateChapter}
            >シナリオ</Button>
            <Button
              className={`capitalize text-xs h-9 font-bold ${lockCondition && 'opacity-50'}`}
              variant='contained'
              onClick={() => lockCondition ? {} : setAddBanner(true)}
              endIcon={
                lockCondition &&
                <div className={'w-6 h-6 bg-white flex rounded-full'}>
                  <img src={'/icons/lock-icon.svg'} alt='icon' className={'w-4 h-4 m-auto'}/>
                </div>
              }
            >
              <div className={'flex items-center text-center'}>
                バナー
                <AddIcon className={'w-5'}/>
              </div>
            </Button>
             <ListButtonAddNewTypeOfChapter isLink={true} className={''} maxIndex={chapterIndex(chapters)} contentId={contentId}/>
             <ListButtonAddNewTypeOfChapter className={'flex gap-2'} maxIndex={chapterIndex(chapters)} contentId={contentId}/>
          </div>
          <div className="py-0.5 pb-2 ">
            <ChapterBannerContent
              chapters={chapters}
              setChapters={setChapters}
              contentId={id}
              cubeDefault={state.cube}
              state={state}
              setState={setState}
            />
          </div>
        </> : null}
      <BillingContentDialog
        open={openBilling}
        setOpen={setOpenBilling}
        state={state}
        setState={setState}
        content={content}
        setContent={setContent}
      />
      <AddBannerDialog
        maxIndex={chapterIndex(chapters)}
        contentId={id}
        isCreate
        open={addBanner}
        setOpen={setAddBanner}
      />
      <AddImageContentDialog
        contentId={id}
        open={openUploadImage}
        setOpen={setOpenUploadImage}
        state={state}
        handleChangeState={handleChangeState}
        setState={setState}
        content={content}
      />
    </div>
  );
}

export default MainContent;
