import React, {useMemo, useState} from 'react';
import AddIcon from "@mui/icons-material/Add";
import {handleUploadQADoc} from "@/app/common/uploadImage/handleUploadFile";
import LoadingButton from "@mui/lab/LoadingButton";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import {CssTextField} from "@/app/components/custom/CssTextField";
import {orderBy} from "lodash";
import {genId} from "cf-gen-id";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Modal from "@/app/components/custom/Modal";
import {DocItem} from "@/app/types/qaDocTemplate";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const listDocumentButton = [
  // {
  //   id: 1,
  //   name: 'GOOGLE_SHEET',
  //   startIcon: <AddIcon/>
  // },
  // {
  //   id: 2,
  //   name: 'GOOGLE_SLIDE',
  //   startIcon: <AddIcon/>
  // },
  // {
  //   id: 3,
  //   name: 'GOOGLE_DOC',
  //   startIcon: <AddIcon/>
  // },
  {
    id: 4,
    name: 'URL',
    startIcon: <AddIcon/>,
  },
  {
    id: 5,
    name: 'PDF',
    startIcon: <AddIcon/>,
  },
  {
    id: 6,
    name: 'YOUTUBE',
    startIcon: <AddIcon/>
  }
]

type props = {
  userId?: string
  pdfs?: DocItem[]
  setPdfs?: React.Dispatch<React.SetStateAction<DocItem[]>>
  youtubeLinks?: DocItem[]
  setYoutubeLinks?: React.Dispatch<React.SetStateAction<DocItem[]>>
  urls?: DocItem[]
  setUrls?: any
  checkErrorLink?: (doc: DocItem) => boolean
  googleDocs?: DocItem[]
  setGoogleDocs?: React.Dispatch<React.SetStateAction<DocItem[]>>
  googleSlides?: DocItem[]
  setGoogleSlides?: React.Dispatch<React.SetStateAction<DocItem[]>>
  googleSheets?: DocItem[]
  setGoogleSheets?: React.Dispatch<React.SetStateAction<DocItem[]>>
}

function DocumentUploadList({
                              userId,
                              pdfs,
                              setPdfs,
                              urls,
                              setUrls,
                              youtubeLinks,
                              setYoutubeLinks,
                              googleDocs,
                              setGoogleDocs,
                              googleSlides,
                              setGoogleSlides,
                              googleSheets,
                              setGoogleSheets,
                              checkErrorLink
                            }: props) {
  const [loadingBtn, setLoadingBtn] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [selectedDoc, setSelectedDoc] = useState<DocItem>(null)

  const sortDocs = useMemo(() => {
    // if (!pdfs?.length && !urls?.length && !youtubeLinks?.length && !googleDocs?.length && !googleSlides?.length && !googleSheets.length) return []
    return orderBy([...pdfs ?? [], ...urls ?? [], ...youtubeLinks ?? [], ...googleDocs ?? [], ...googleSheets ?? [], ...googleSlides ?? []].flat(), ['index'], ['desc'])
  }, [pdfs, urls, youtubeLinks, googleDocs, googleSlides, googleSheets])

  const getMaxIndex = () => {
    if (sortDocs?.length) {
      return Math.max(...sortDocs?.map((d) => d?.index));
    }
    return -1;
  }
  const handleAddDocument = async (e, btn) => {
    e.preventDefault()
    e.stopPropagation()
    if (btn.name !== 'PDF') return;
    if (!e.target.files[0]) return
    const file = e.target.files[0]
    setLoadingBtn(true)
    if (btn.name === 'PDF') {
      try {
        const data = await handleUploadQADoc(file, userId)
        setPdfs([...pdfs, {
          id: genId({prefix: "doc_", size: 16}),
          url: `gs://${data?.fileLocation}`,
          name: file.name,
          type: 'pdf',
          index: getMaxIndex() + 1
        }])
      } catch (e) {
        console.log(e);
      } finally {
        setLoadingBtn(false)
      }
    }
  }
  const handleAddUrl = (btn) => {
    if (btn?.name === 'PDF') return;
    const theSameInitData = {
      id: genId({prefix: "doc_", size: 16}),
      url: '',
      name: '',
      index: getMaxIndex() + 1,
    }
    switch (btn?.name) {
      case 'GOOGLE_SHEET':
        setGoogleSheets([...googleSheets, {
          ...theSameInitData,
          type: 'googleSheet',
        }])
        break;
      case 'GOOGLE_SLIDE':
        setGoogleSlides([...googleSlides, {
          ...theSameInitData,
          type: 'googleSlide',
        }])
        break;
      case 'GOOGLE_DOC':
        setGoogleDocs([...googleDocs, {
          ...theSameInitData,
          type: 'googleDoc',
        }])
        break;
      case 'URL':
        setUrls([...urls, {
          ...theSameInitData,
          type: 'link',
        }])
        break;
      case 'YOUTUBE':
        setYoutubeLinks([...youtubeLinks, {
          ...theSameInitData,
          type: 'youtube',
        }])
        break;
      default:
        break;
    }
  }

  const changeUrl = (e, doc: DocItem,
                     qaData: DocItem[],
                     setQaData: React.Dispatch<React.SetStateAction<DocItem[]>>) => {
    const _qaData = [...qaData]
    const index = _qaData.findIndex(item => item.id === doc.id)
    _qaData[index].url = e.target.value
    setQaData(_qaData)
  }
  const onChangeUrl = (e, doc: DocItem) => {
    e.preventDefault()
    e.stopPropagation()
    if (doc.type === 'link') changeUrl(e, doc, urls, setUrls);
    if (doc.type === 'youtube') changeUrl(e, doc, youtubeLinks, setYoutubeLinks);
    if (doc.type === 'googleDoc') changeUrl(e, doc, googleDocs, setGoogleDocs);
    if (doc.type === 'googleSlide') changeUrl(e, doc, googleSlides, setGoogleSlides);
    if (doc.type === 'googleSheet') changeUrl(e, doc, googleSheets, setGoogleSheets);
  }
  const openModalDelete = (doc) => {
    setOpenModal(true)
    setSelectedDoc(doc)
  }

  const deleteItem = (qaDocs: DocItem[],
                      setQaDocs: React.Dispatch<React.SetStateAction<DocItem[]>>,
                      selectedDoc: DocItem) => {
    const newDocs = [...qaDocs]
    const index = newDocs.findIndex(item => item.id === selectedDoc.id)
    newDocs.splice(index, 1)
    setQaDocs(newDocs)
  }

  const handleDeleteDoc = () => {
    if (selectedDoc.type === 'pdf') deleteItem(pdfs, setPdfs, selectedDoc);
    if (selectedDoc.type === 'link') deleteItem(urls, setUrls, selectedDoc);
    if (selectedDoc.type === 'youtube') deleteItem(youtubeLinks, setYoutubeLinks, selectedDoc);
    if (selectedDoc.type === 'googleDoc') deleteItem(googleDocs, setGoogleDocs, selectedDoc);
    if (selectedDoc.type === 'googleSlide') deleteItem(googleSlides, setGoogleSlides, selectedDoc);
    if (selectedDoc.type === 'googleSheet') deleteItem(googleSheets, setGoogleSheets, selectedDoc);

    setOpenModal(false)
  }

  const handleCancelDelete = () => {
    setOpenModal(false)
    setSelectedDoc(null)
  }
  const imageUrl = (doc: DocItem) => {
    switch (doc?.type) {
      case 'googleDoc':
        return {src: '/icons/associate/doc.svg', label: 'googleDoc'}
      case 'googleSlide':
        return {src: '/icons/associate/ggSlide.svg', label: 'googleSlide'}
      case 'googleSheet':
        return {src: '/icons/associate/ggSheet.svg', label: 'googleSheet'}
      case 'youtube':
        return {src: '/icons/content/youtube.svg', label: 'youtube'}
      case 'link':
        return {src: '/icons/content/link.svg', label: 'link'}
      case 'pdf':
        return {src: '/icons/associate/doc.svg', label: 'pdf'}
      default:
        return {src: '', label: ''}
    }
  }

  return (
    <div>
      <div className={'flex ml-2 pt-2 flex-wrap'}>
        {
          listDocumentButton?.map((btn, index: number) => {
              return (
                <div key={btn.name + index} className={'flex gap-2'}>
                  <LoadingButton
                    onClick={() => handleAddUrl(btn)}
                    className={'mb-2 mr-4'}
                    variant={'contained'}
                    loading={loadingBtn && btn.name === 'PDF'}
                    color="primary"
                    aria-label="upload picture"
                    component="label"
                    startIcon={<AddIcon/>}
                  >
                    {btn.name}
                    {
                      btn.name === 'PDF' &&
                      <input
                        id={`upload-document`}
                        hidden
                        accept=".pdf, .doc , .docx, .ppt, .pptx, .xls, .xlsx"
                        type="file"
                        onChange={event => handleAddDocument(event, btn)}
                      />
                    }
                  </LoadingButton>
                </div>
              )
            }
          )
        }
      </div>

      <div className={'flex flex-col ml-2 gap-4 pt-5 max-h-[390px] overflow-y-auto'}>
        {
          sortDocs && sortDocs.map((doc) => {
              return (
                <div key={doc.id} className={'flex gap-2 items-center text-center '}>
                  {
                    doc?.type === 'pdf' &&
                    <div className={'flex items-center w-[93%] gap-2 '}>
                      <PictureAsPdfIcon className={'w-[30px]'} color={'primary'}/>
                      <span className={'w-full truncate text-start'}>{doc.name}</span>
                      <DeleteForeverIcon color={'disabled'} className={'cursor-pointer'}
                                         onClick={() => openModalDelete(doc)}/>
                    </div>
                  }
                  {
                    (doc.type !== 'pdf') &&
                    <div className={'flex items-center w-[93%] gap-3 '}>
                      {
                        doc?.type === 'link' ?
                          <InsertLinkIcon className={'-rotate-45 w-[30px] h-[30px]'}/> :
                          <img src={imageUrl(doc).src} alt={'youtube'} className={'w-[30px] h-[30px]'}/>
                      }
                      <CssTextField
                        label={imageUrl(doc).label}
                        InputLabelProps={{shrink: true,}}
                        onBlur={() => checkErrorLink(doc)}
                        error={checkErrorLink(doc)}
                        onChange={(e) => onChangeUrl(e, doc)}
                        value={doc?.url}
                        className={'w-full'}
                        size={'small'}
                        placeholder={`${doc.type === 'youtube' ? 'Youtubeのリンクを入力してください。' : 'URLを入力してください。'}`}
                      />
                      <DeleteForeverIcon color={'disabled'} className={'cursor-pointer'}
                                         onClick={() => openModalDelete(doc)}/>
                    </div>
                  }
                </div>
              )
            }
          )
        }
      </div>
      {
        <Modal open={openModal}
               onSubmit={handleDeleteDoc}
               setOpen={setOpenModal}
               dividers={false}
               title={'このドキュメントを削除しますか？'}
               size={'xs'}
               handleClose={handleCancelDelete}
               btnSubmit={'保存'}>
          <div/>
        </Modal>
      }
    </div>
  );
}

export default DocumentUploadList;
