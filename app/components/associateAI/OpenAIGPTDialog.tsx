import React, {useEffect, useState} from 'react';
import Modal from "@/app/components/custom/Modal";
import {CssTextField} from "@/app/components/custom/CssTextField";
import {DocItem, QaDocTemplate} from "@/app/types/qaDocTemplate";
import BoltIcon from "@mui/icons-material/Bolt";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DocumentUploadList from "@/app/components/associateAI/DocumentUploadList";
import {createAssociateAi, updateAssociateAi} from "@/app/common/commonApis/asscociateAIApis";
import {genId} from "cf-gen-id";
import {toast} from "react-toastify";
import isURL from "validator/lib/isURL";
import {Model} from "@/app/types/types";
import {useGetAllModels} from "@/app/hooks/useGetAllModels";

type props = {
  userId?: string
  item?: QaDocTemplate
  openModal: boolean
  setOpenModel: React.Dispatch<React.SetStateAction<boolean>>
  index?: number
  isUpdate?: boolean
}

function OpenAiGPTDialog({openModal, setOpenModel, item, userId, index, isUpdate = false}: props) {
  const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  // const [modelList, setModelList] = useState<Model[]>([])
  const [pdfs, setPdfs] = useState<DocItem[]>([])
  const [urls, setUrls] = useState<DocItem[]>([])
  const [youtubeLinks, setYoutubeLinks] = useState<DocItem[]>([])
  const [qaData, setQaData] = useState<QaDocTemplate>(null)
  const [googleDocs, setGoogleDocs] = useState<DocItem[]>([])
  const [googleSlides, setGoogleSlides] = useState<DocItem[]>([])
  const [googleSheets, setGoogleSheets] = useState<DocItem[]>([])
  const checkLength = pdfs?.length + urls?.length + youtubeLinks?.length + googleDocs?.length + googleSlides?.length + googleSheets?.length
  const {modelList} = useGetAllModels()

  useEffect(() => {
    setQaData(item)
  }, [item]);


  useEffect(() => {
    if (item?.gs_docs?.length) {
      setPdfs(item?.gs_docs)
    }
    if (item?.urls?.length) {
      setUrls(item?.urls)
    }
    if (item?.ytlinks?.length) {
      setYoutubeLinks(item?.ytlinks)
    }
    if (item?.gdoc_ids?.length) {
      setGoogleDocs(item?.gdoc_ids)
    }
    if (item?.presentation_ids?.length) {
      setGoogleSlides(item?.presentation_ids)
    }
    if (item?.spreadsheet_ids?.length) {
      setGoogleSheets(item?.spreadsheet_ids)
    }

  }, [item?.gs_docs, item?.urls, item?.ytlinks, item?.gdoc_ids, item?.presentation_ids, item?.spreadsheet_ids]);

  const handleSelectVersion = (e, model: Model) => {
    e.preventDefault()
    e.stopPropagation()
    setQaData({...qaData, modelId: model?.id, model: model?.name + ' ' + '(' + model?.context + ')'})
  }
  const selectedIconColor = (model: Model) => {
    return model?.id === qaData?.modelId
  }
  const regexDoc = /\/document\/d\/([^/]+)\//;
  const regexSheet = /\/spreadsheets\/d\/([^/]+)\//;
  const regexSlide = /\/presentation\/d\/([^/]+)\//;

  const checkErrorLink = (doc: DocItem) => {
    if (!doc?.url) return true
    const url = doc?.url.trim()
    switch (doc.type) {
      case 'link':
        return !isURL(doc?.url.trim())
      case 'youtube':
        return !regExp.test(doc?.url.trim())
      case 'googleDoc':
        const match = url.match(regexDoc);
        return !match?.[1]
      case 'googleSheet':
        const matchSheet = url.match(regexSheet);
        return !matchSheet?.[1]
      case 'googleSlide':
        const matchSlide = url.match(regexSlide);
        return !matchSlide?.[1]
      default:
        break;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const checkErrUrls = urls?.every((item) => isURL(item?.url.trim()))
    const checkErrYoutubeLinks = youtubeLinks?.every((item) => regExp.test(item?.url.trim()))
    const listDocs = [...pdfs ?? [], ...urls ?? [], ...youtubeLinks ?? [], ...googleDocs ?? [], ...googleSlides ?? [], ...googleSheets ?? []].flat()
    const checkEmptyString = listDocs?.find((d) => d?.url === '')
    const checkGoogleDocs = googleDocs?.every((g) => g.url.match(regexDoc)?.[1])
    const checkGoogleSlides = googleSlides?.every((g) => g.url.match(regexSlide)?.[1])
    const checkGoogleSheets = googleSheets?.every((g) => g.url.match(regexSheet)?.[1])
    if (!checkErrUrls) {
      toast.error('URLが不正です。')
      return
    }
    if (!checkErrYoutubeLinks) {
      toast.error('YoutubeのURLが不正です。')
      return
    }
    if (!qaData?.title) {
      toast.error('タイトルを入力してください。')
      return
    }
    if (!qaData?.modelId) {
      toast.error('バージョンを選択してください。')
      return
    }
    if (!checkLength) {
      toast.error('少なくとも1つのドキュメントを追加してください。')
      return
    }
    if (checkEmptyString) {
      toast.error('すべての情報を入力してください。')
      return
    }
    if (!checkGoogleDocs) {
      toast.error('ドキュメントのURLが不正です。')
      return
    }
    if (!checkGoogleSlides) {
      toast.error('スライドのURLが不正です。')
      return
    }
    if (!checkGoogleSheets) {
      toast.error('スプレッドシートのURLが不正です。')
      return
    }
    const sameQaData = {
      title: qaData?.title,
      modelId: qaData?.modelId,
      model: qaData?.model,
      urls: urls,
      ytlinks: youtubeLinks,
      gs_docs: pdfs,
      userId: userId,
      spreadsheet_ids: googleSheets,
      presentation_ids: googleSlides,
      gdoc_ids: googleDocs,
    }
    const data = {
      ...sameQaData,
      id: genId({prefix: 'qa_doc_', size: 16}),
      index: index || 0
    }
    const updateData = {
      ...sameQaData,
      id: item?.id,
      index: item?.index || 0
    }
    try {
      if (!isUpdate) {
        await createAssociateAi(data)
        toast.success('作成に成功しました。')
      } else {
        await updateAssociateAi(updateData)
        toast.success('更新に成功しました。')
      }
    } catch (e) {
      if (isUpdate) toast.error('更新に失敗しました。')
      toast.error('作成に失敗しました。')
      console.log(e);
    } finally {
      setOpenModel(false)
      setPdfs([])
      setUrls([])
      setYoutubeLinks([])
      setGoogleDocs([])
      setGoogleSlides([])
      setGoogleSheets([])
      setQaData(null)
    }
  }

  const handleCloseModal = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (item) {
      setQaData(qaData)
      setPdfs(qaData?.gs_docs)
      setUrls(qaData?.urls)
      setYoutubeLinks(qaData?.ytlinks)
      setGoogleDocs(qaData?.gdoc_ids)
      setGoogleSlides(qaData?.presentation_ids)
      setGoogleSheets(qaData?.spreadsheet_ids)
    } else {
      setQaData(null)
      setPdfs([])
      setUrls([])
      setYoutubeLinks([])
      setGoogleDocs([])
      setGoogleSlides([])
      setGoogleSheets([])
    }
    setOpenModel(false)
  }

  return (
    <div>
      <Modal open={openModal}
             dividers={false}
             setOpen={setOpenModel}
             title={'OpenAI GPT'}
             titlePosition={'left'}
             btnSubmit={'保存'}
             onSubmit={(e) => handleSubmit(e)}
             handleClose={(e) => handleCloseModal(e)}
      >
        <div className={'flex flex-col gap-3 pl-3'}>
          <div className={'grid grid-cols-12'}>
            <span className={'col-span-3 my-auto ml-2'}>タイトル</span>
            <CssTextField
              onChange={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setQaData({...qaData, title: e.target.value})
              }}
              value={qaData?.title}
              className={'col-span-8 my-auto'}
              size={'small'}
              placeholder={'タイトルを入力してください。'}
            />
          </div>

          <div className={'grid grid-cols-12'}>
            <span className={'col-span-3 ml-2 my-auto mt-3'}>モデル</span>
            <div className={'flex col-span-8'}>
              {
                modelList?.map((model, index: number) => {
                  return (
                    <div key={index} className={'flex flex-col w-full'}>
                      <div className={`items-center w-full flex flex-col bg-[#E1EAEF] font-bold py-1 text-[14px]
                      ${(qaData?.modelId === model.id) ? 'text-[#4AA181]' : ''} ${index === 0 ? 'rounded-l-md' : ''} ${index === 3 ? 'rounded-r-md' : ''}`}>
                        <div
                          className={`flex justify-center py-[6px] pr-1 rounded-md items-center cursor-pointer ${selectedIconColor(model) ? 'bg-white' : ''} `}
                          onClick={(e) => handleSelectVersion(e, model)}
                        >
                          {model.name === 'GPT-3.5' ? <BoltIcon className={'mr-1'}
                                                                color={`${selectedIconColor(model) ? 'primary' : 'disabled'}`}/> :
                            <AutoAwesomeIcon className={'mx-2'}
                                             color={`${selectedIconColor(model) ? 'primary' : 'disabled'}`}/>}
                          <span className={`${selectedIconColor(model) ? 'text-blue-500' : 'text-[#9CA9B1] mr-1'}`}>
                            {model.id === 'model_mlttUVBcxrZh4m3Z6E3a' ? 'GPT4' : model.name}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`m-auto pl-4 pt-3 uppercase ${selectedIconColor(model) ? 'text-blue-500' : 'text-[#9CA9B1]'} font-bold`}>
                        {model.context}
                      </span>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <DocumentUploadList userId={userId}
                              checkErrorLink={checkErrorLink}
                              pdfs={pdfs}
                              setPdfs={setPdfs}
                              urls={urls}
                              setUrls={setUrls}
                              youtubeLinks={youtubeLinks}
                              setYoutubeLinks={setYoutubeLinks}
                              googleDocs={googleDocs}
                              setGoogleDocs={setGoogleDocs}
                              googleSlides={googleSlides}
                              setGoogleSlides={setGoogleSlides}
                              googleSheets={googleSheets}
                              setGoogleSheets={setGoogleSheets}
          />
        </div>
      </Modal>
    </div>
  );
}

export default OpenAiGPTDialog;
