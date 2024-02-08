import React, {MutableRefObject, useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import Button from '@mui/material/Button';
import "slick-carousel/slick/slick.scss";
import "slick-carousel/slick/slick-theme.css";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {blocksAtom} from "@/app/store/atom/blocks.atom";
import DialogCustom from "@/app/components/custom/chapter/DialogCustom";
import {cloneDeep, sortBy} from "lodash";
import {getId} from "@/app/common/getId";
import TextTabContent from "@/app/components/custom/chapter/tabPanel/TextTabContent";
import ImageTabContent from "@/app/components/custom/chapter/tabPanel/ImageTabContent";
import SlideShowDialog from "@/app/components/custom/chapter/tabPanel/SlideShowDialog";
import SlideActionDialog from "@/app/components/custom/chapter/tabPanel/SlideActionDialog";
import {IconButton, Tabs} from "@mui/material";
import {CREATE_TEXT} from "@/app/auth/urls";
import axios from "axios";
import useTextList from "@/app/hooks/useTextList";
import Loading from "@/app/components/custom/Loading";
import {toast} from "react-toastify";
import {useTextListAtom} from "@/app/store/atom/textList.atom";
import {handleUploadFile} from "@/app/common/uploadImage/handleUploadFile";
import {deleteSlide, getSlides, getThumbByPresentationId} from "@/app/common/commonApis/slide";
import AddSlideModal from "@/app/components/slide/AddSlideModal";
import {BaseDeleteModal} from "@/app/components/base";
import LinearProgress from "@mui/material/LinearProgress";
import SlideThumbDialog from "@/app/components/custom/chapter/tabPanel/SlideThumbDialog";
import {useGetEnecolorRankTextSettings} from "@/app/hooks/useGetEnecolorRankTextSettings";
import {useGetEnecolorRankImgSettings} from "@/app/hooks/useGetEnecolorRankImgSettings";
import {selectedImageFolderAtom} from "@/app/store/atom/selectedFolder.atom";
import {columns, tabData} from "@/app/components/custom/chapter/contents/common/data";
import {handleAddBlock} from "@/app/components/custom/chapter/contents/common/handleAddBlock";
import EnecolorTabContent from "@/app/components/custom/chapter/tabPanel/EnecolorTabContent";
import SlideTab from "@/app/components/custom/chapter/tabPanel/SlideTab";
import AddDbTextModal from "@/app/components/custom/chapter/AddDbTextModal";
import {useScrollToBottomPage} from "@/app/hooks/useScrollToBottomPage";
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import SlideThumbRangeDialog from '../tabPanel/SlideThumbRangeDialog';
import {mapDataToAddIndex} from "@/app/common/mapDataToAddIndex";
import {selectedCharacterInContentAtom} from "@/app/store/atom/selectedCharacterInContent.atom";
import {ButtonScrollTop} from "@/app/components/custom/chapter/contents/component/ButtonScrollTop";
import {CharacterBlock, TextList} from "@/app/types/types";
import {
  EXIT_IMAGE,
  MULTI_PROMPT_INPUT_V2,
  MULTI_PROMPT_INPUT_WITHOUT_CHAR,
  MULTI_PROMPT_INPUT_WITHOUT_CHAR_V2,
  PROMPT_INPUT,
  PROMPT_INPUT_V2,
  PROMPT_INPUT_WITHOUT_CHAR,
  PROMPT_INPUT_WITHOUT_CHAR_V2,
  PROMPT_TYPES,
  PROMPT_V2,
  PROMPT_WITHOUT_CHAR_V2,
  START_IMAGE, VIDEO,
  VIMEO,
  YOUTUBE
} from "@/app/configs/constants";
import {
  Block,
  BlockEneColorRankImg,
  BlockEnecolorRankText,
  BlockInputEnecolorImage,
  BlockInputEnecolorText,
  BlockText,
  DataSlide,
  DataText,
  SaveSetting
} from "@/app/types/block";
import {hasVersionAtom} from "@/app/store/atom/hasVersion.atom";
import {KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight} from "@mui/icons-material";
import {isShowTabPanelAtom} from "@/app/store/atom/isShowTabPanel";
import {iconImg} from "@/app/components/assets/image/icon";
import {topLeftMenuOpen} from "@/app/store/atom/useTopLeftMenuOpen";
import {disableChatGPTVersion} from "@/app/common/checkDisableGPTVersion";
import {chapterErrorAtom, clearChapterErrorAtom} from "@/app/store/atom/chapterError.atom";
import {twMerge} from "tailwind-merge";
import AddIcon from "@mui/icons-material/Add";


type props = {
  fixed?: boolean
  blockIndex?: number
  isShowModal?: boolean
  addNewBlocks?: Block[]
  setAddNewBlocks?: React.Dispatch<React.SetStateAction<Block[]>>,
  virtuosoRef?: MutableRefObject<any>
  checkTimeTrigger?: boolean
  disableGPTVersion?: boolean
}

function RightScenario({
                         fixed,
                         blockIndex,
                         isShowModal = false,
                         addNewBlocks,
                         setAddNewBlocks,
                         virtuosoRef,
                         checkTimeTrigger = false,
                         disableGPTVersion = false
                       }: props) {
  const [blocks, setBlocks] = useAtom(blocksAtom)
  const [openShowDialog, setOpenShowDialog] = useState(false)
  const [openThumbDialog, setOpenThumbDialog] = useState(false)
  const [openThumbRangeDialog, setOpenThumbRangeDialog] = useState(false)
  const [openActionDialog, setOpenActionDialog] = useState(false)
  const [isShowSearch, setIsShowSearch] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  const [value, setValue] = React.useState('1');
  const selectedCharsInContent = useAtomValue(selectedCharacterInContentAtom)
  const [category, setCategory] = useState('')
  const [message, setMessage] = useState('')
  const {textList, loading} = useTextList()
  const [, setTextList] = useTextListAtom()
  const [openModal, setOpenModal] = useState(false)
  const [imagesData, setImagesData] = useState<any>([])
  const defaultDel = {id: '', title: ''}
  const [isLoading, setIsLoading] = useState(false);
  const [isModalAdd, setIsModalAdd] = useState(false);
  const [idDelete, setIdDelete] = useState(defaultDel);
  const [dataSlides, setDataSlides] = useState<DataSlide[]>([]);
  const [selectedEneColorRankImgSetting, setSelectedEneColorRankImgSetting] = useState<SaveSetting>(null)
  const [selectedEneColorRankTextSetting, setSelectedEneColorRankTextSetting] = useState<SaveSetting>(null)
  const {eneColorRankTextSettings} = useGetEnecolorRankTextSettings()
  const {eneColorRankImgSettings} = useGetEnecolorRankImgSettings()
  const selectedImageFolder = useAtomValue(selectedImageFolderAtom)
  const [hasVer, setHasVer] = useAtom(hasVersionAtom)
  const [isShowTabPanel, setIsShowTabPanel] = useAtom(isShowTabPanelAtom)
  const [openTopLeftMenu] = useAtom(topLeftMenuOpen)
  const [chapterError] = useAtom(chapterErrorAtom)
  const clearChapterError = useSetAtom(clearChapterErrorAtom)
  const [open, setOpen] = useAtom(topLeftMenuOpen)

  useEffect(() => {
    const checkHasChatGPT = blocks?.find(item => PROMPT_TYPES.includes(item.type))
    const checkHasVer = blocks?.find(block => block.type === 'versionUserChoice' ||
      block.type === 'versionSetting' ||
      block.type === 'continuousChat')
    if (checkHasVer && checkHasChatGPT || !checkHasVer && !checkHasChatGPT) setHasVer(false)
    if (checkHasChatGPT && !checkHasVer) setHasVer(false)
    return () => {
      setHasVer(false)
    }
  }, [blocks])

  useEffect(() => {
    if (hasVer) setValue('10')
  }, [hasVer])

  const rows: TextList[] = textList?.map((item: TextList, index: number) => {
    return {
      id: item.id,
      category: item.category,
      comment: item.comment,
      japanese: item.japanese,
      createdAt: item.createdAt
    } satisfies TextList
  })

  const nearestControlBlockChars = (currentIndex: number, blocks: Block[]): CharacterBlock[] => {
    if (blockIndex === 0) {
      return characterDefaultIsVoice(blocks[0]?.characters)
    }

    let characters: CharacterBlock[]
    for (let i = currentIndex; i >= 0; i--) {
      if (blocks[i].type === 'control' && blocks[i]?.characters?.length > 0) {
        characters = [...blocks[i]?.characters]
        characters?.forEach((c => {
          selectedCharsInContent?.forEach(s => {
            if (s.id === c.id) {
              c.motionId = s.defaultMotion ?? ''
              c.voiceId = s.defaultVoice ?? ''
            }
          })
        }))
        break
      }
    }
    return characterDefaultIsVoice(characters)
  };

  function characterDefaultIsVoice(characters: CharacterBlock[]): CharacterBlock[] {
    if (!characters) return null
    const _characters = cloneDeep(characters)
    const indexShowChar = _characters.findIndex(c => c.isShow)
    _characters.forEach(c => c.isVoice = false)

    //set isVoice true for first showChar
    indexShowChar >= 0 && (_characters[indexShowChar] = {
      ..._characters[indexShowChar],
      isVoice: true
    })
    return _characters
  }

  const renderSearch = () => {
    let newData = rows
    if (searchValue !== '') {
      newData = rows?.filter((i: any) => {
        return i.comment.includes(searchValue)
      })
    }
    return newData
  }

  const blockTexts: BlockText[] = renderSearch()?.map((item) => {
    return {
      characters: nearestControlBlockChars(blocks?.length - 1, blocks) || [],
      type: 'text',
      id: getId("block_", 10),
      isShowLog: false,
      audioName: '',
      previewAudioUrl: '',
      audioUrl: '',
      imageUrl: '',
      isDeleted: false,
      data: {
        output_type: "text",
        groupsText: [],
        groupsStruct: [],
        message: {
          english: '',
          japanese: item.comment,
          japaneseMp3: ''
        }
      } satisfies DataText
    } satisfies BlockText
  })

  const {setDummyAdd} = useScrollToBottomPage({virtuosoRef})

  const handleAddAction = (row: TextList) => {
    const blockText: BlockText = {
      id: getId("block_", 10),
      type: 'text',
      characters: nearestControlBlockChars(blocks?.length - 1, blocks)?.map((c: CharacterBlock, index: number) => {
        return {
          ...c,
          isVoice: index === 0,
        }
      }) || [],
      isShowLog: false,
      isDeleted: false,
      imageUrl: '',
      audioUrl: '',
      previewAudioUrl: '',
      audioName: '',
      data: {
        output_type: "text",
        groupsText: [],
        groupsStruct: [],
        message: {
          english: '',
          japanese: row.comment,
          japaneseMp3: ''
        }
      } satisfies DataText,
    }
    if (blockIndex == undefined) {
      setDummyAdd(prev => prev + 1)
      setBlocks([...blocks, blockText])
    } else {
      setAddNewBlocks([...addNewBlocks, blockText])
    }
  }
  const isFirstShowChar = nearestControlBlockChars(blocks?.length - 1, blocks)?.find(c => c.isShow)
  const addedControlBlockChars = nearestControlBlockChars(blocks?.length - 1, blocks)?.map((c, index) => {
    return {
      ...c,
      isVoice: false,
      isAction: isFirstShowChar?.id === c.id
    }
  })


  const onAddBlock = (type: string, url = '', selectedTextSetting = null, blockInputEnecolor: BlockInputEnecolorText | BlockInputEnecolorImage = null, blockEnecolor: BlockEnecolorRankText | BlockEneColorRankImg = null) => {

    const props = {
      type: type,
      url: url,
      selectedTextSetting: selectedTextSetting,
      blocks: blocks,
      blockIndex: blockIndex,
      setDummyAdd: setDummyAdd,
      setBlocks: setBlocks,
      actionCharacter: type === 'control' ? addedControlBlockChars || [] : nearestControlBlockChars(blocks?.length - 1, blocks) || [],
      mapDataToAddIndex: mapDataToAddIndex(blocks),
      selectedEneColorRankImgSetting: selectedEneColorRankImgSetting,
      setSelectedEneColorRankImgSetting: setSelectedEneColorRankImgSetting,
      setSelectedEneColorRankTextSetting: setSelectedEneColorRankTextSetting,
      selectedEneColorRankTextSetting: selectedEneColorRankTextSetting,
      blockTexts: blockTexts,
      addNewBlocks: addNewBlocks,
      setAddNewBlocks: setAddNewBlocks,
      checkTimeTrigger: checkTimeTrigger,
      blockInputEnecolor: blockInputEnecolor,
      blockEnecolor: blockEnecolor,
    }
    handleAddBlock(props)
  }
  const handleShowSearch = (e: string) => {
    if (e === 'テキスト') setIsShowSearch(true)
    else setIsShowSearch(false)
  }

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleChangeImage = async (e) => {
    if (e.target.files.length === 1) {
      const file = e.target.files[0]
      const url = await handleUploadFile(file, 'templates');
      if (!url) return
      await axios.post(`/v2/images/create`, {url: url, folderId: selectedImageFolder.id});
      return;
    }
    let imgData = []
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      imgData.push({url: URL?.createObjectURL(file), file: file})
    }
    setImagesData([...imgData])
  }

  const handleAddText = () => {
    setOpenModal(true)
  }
  const handleSubmitAdd = async () => {
    if (!category) return toast.error('カテゴリーを入力してください。')
    if (!message) return toast.error('テキストを入力してください。')
    const data: TextList = {
      category: category,
      comment: message,
      english: "test",
      japanese: message,
      index: 0,
      isDeleted: false
    }
    try {
      await axios.post(CREATE_TEXT, data)
    } catch (e) {
      console.log(e)
    } finally {
      setTextList([data, ...textList])
      setOpenModal(false)
      setCategory('')
      setMessage('')
    }
  }

  const getListSlides = async () => {
    setIsLoading(true)
    try {
      let data = await getSlides()
      let dataSort = sortBy(data.slides, function (dateObj) {
        return new Date(dateObj.createdAt);
      });
      let linkApiCall = []
      dataSort?.map((val, index) => {
        linkApiCall.push(getThumbByPresentationId(val.presentationId))
      });
      Promise.all(linkApiCall).then(dataApi => {
        setDataSlides(mrArr(dataApi, dataSort));
      }).finally(() =>
        setIsLoading(false)
      )
    } catch (err) {
      setIsLoading(false)
      console.log(err);
    }
  }

  const mrArr = (arr2, arr1) => {
    return arr1?.map((item) => {
      const match = arr2?.find((obj) => obj.presentationId === item.presentationId);
      if (match) {
        return {...item, ...match};
      }
      return item;
    }).concat(arr2?.filter((obj) => !arr1?.find((item) => item.presentationId === obj.presentationId)));
  }

  const handleDeleteSlide = async () => {
    try {
      await deleteSlide(idDelete?.id)
      await getListSlides()
      setIdDelete(defaultDel)
      toast.success('保存しました', {autoClose: 3000});
    } catch (err) {
      toast.error('保存に失敗しました', {autoClose: 3000});
    }
  }
  useEffect(() => {
    if (value === '9') {
      getListSlides().then()
    }
  }, [value])

  const disableSettingVersion = () => {
    if (!blocks) return
    return Boolean(blocks?.find(block => block.type === 'versionUserChoice' ||
      block.type === 'versionSetting' ||
      block.type === 'continuousChat'))
  }
  const handleShowTabPanel = () => {
    setIsShowTabPanel(!isShowTabPanel)
  }

  return (
    <div
      className={twMerge(`bg-white h-full min-h-[75vh] ${fixed ? `fixed top-[68px] w-[23%] ${isShowTabPanel ? 'w-[20.5%]' : 'w-[7%]'} ${isShowTabPanel && !openTopLeftMenu && 'w-[23.5%]'}` : ''}`)}
    >
      {fixed && <ButtonScrollTop virtuosoRef={virtuosoRef}/>}

      <Box sx={{typography: 'body1', backgroundColor: 'white'}}
           className={'flex flex-row-reverse  items-start py-1'}
      >
        <TabContext value={value}>
          <Box sx={{borderBottom: 1, borderColor: 'divider'}}
               className={twMerge(`text-start border-solid border-0 border-l border-l-[#D9D9D9] px-2 shadow-md ${!isShowTabPanel && !isShowModal ? 'basis-[90%] shrink' : `basis-[34%] ${isShowModal && 'basis-[12%]'}`}`)}>
            <Tabs
              value={value}
              onChange={handleChangeTab}
              variant="scrollable"
              scrollButtons={false}
              aria-label="scrollable auto tabs example"
              orientation={'vertical'}
              className={`${blockIndex || blockIndex === 0 ? 'h-[75vh]' : 'h-[95vh] pb-8'}`}
            >
              {
                tabData?.map((i: any, index) => {
                  return (
                    <Tab icon={
                      <div className={'flex flex-col justify-center items-center'}>
                        <div
                          className={'flex justify-center items-center w-[45px] aspect-square rounded-full border-1 border-solid border-gray-600 mb-1'}>
                          <img src={i.icon} alt={i.label}/>
                        </div>
                        <div className={'text-xs'}>{i.label}</div>
                      </div>
                    } key={index} value={i.value}
                         onClick={() => handleShowSearch(i.label)} sx={{
                      borderBottom: `${(i.label === "スライド" || i.label === "解析モデル") && '1px solid #D9D9D9'}`
                    }} className={'w-full p-0 py-[5px] min-w-max'}/>
                  )
                })
              }
            </Tabs>
          </Box>
          {!isShowModal && !isShowTabPanel &&
            <IconButton onClick={handleShowTabPanel} sx={{padding: '0px'}}>
              {isShowTabPanel ? <KeyboardDoubleArrowRight/> :
                <KeyboardDoubleArrowLeft/>}
            </IconButton>
          }
          <div
            className={`w-full relative ${isShowTabPanel && 'flex'} ${!isShowModal && isShowTabPanel && 'flex'} ${!isShowTabPanel && !isShowModal && 'hidden'} ${isShowModal && 'flex'} items-center justify-center`}>
            {!isShowModal &&
              <IconButton onClick={handleShowTabPanel} sx={{padding: '0px'}}
                          className={` ${isShowTabPanel ? 'right-0 absolute top-0' : ''}`}>
                {isShowTabPanel ? <KeyboardDoubleArrowRight/> :
                  <KeyboardDoubleArrowLeft/>}
              </IconButton>
            }
            <TabPanel value="1" className={'w-full'}>
              {/*{*/}
              {/*  isShowSearch &&*/}
              {/*  <div className={'flex justify-between py-5 mx-7'}>*/}
              {/*    言語DB*/}
              {/*    <Search onSearch={setSearchValue}/>*/}
              {/*  </div>*/}
              {/*}*/}
              {
                loading ? <Loading/> :
                  <TextTabContent
                    isShowModal={isShowModal}
                    onAddBlock={onAddBlock}
                    handleAddAction={handleAddAction}
                    handleAddText={handleAddText}
                    columns={columns}
                    // rows={renderSearch()}
                    rows={[]}
                  />
              }
            </TabPanel>
            <TabPanel value="2" className={openTopLeftMenu ? 'p-0 2xl:p-[24px]' : ''}>
              <EnecolorTabContent
                isShowModal={isShowModal}
                openTopLeftMenu={openTopLeftMenu}
                selectedEneColorRankTextSetting={selectedEneColorRankTextSetting}
                eneColorRankTextSettings={eneColorRankTextSettings}
                setSelectedEneColorRankTextSetting={setSelectedEneColorRankTextSetting}
                onAddBlock={onAddBlock}
                selectedEneColorRankImgSetting={selectedEneColorRankImgSetting}
                eneColorRankImgSettings={eneColorRankImgSettings}
                setSelectedEneColorRankImgSetting={setSelectedEneColorRankImgSetting}
              />
            </TabPanel>
            {/*<div className={'flex justify-center'}>*/}
            {/*  <TabPanel value="3" className={'pt-10 w-full'}>*/}
            {/*    <Button variant="contained" onClick={() => onAddBlock('control')}>Control</Button>*/}
            {/*  </TabPanel>*/}
            {/*</div>*/}
            <TabPanel value="4" className={'pt-10 w-full'}>
              {(isLoading || (imagesData === null && !isLoading)) ? <LinearProgress/> :
                <ImageTabContent
                  isShowModal={isShowModal}
                  imagesData={imagesData}
                  setImagesData={setImagesData}
                  handleChangeImage={handleChangeImage}
                  onAddBlock={onAddBlock}/>
              }
            </TabPanel>

            <TabPanel value="5" className={'pt-10'}>
              <div className={'flex flex-col gap-2 items-center'}>
                <Button startIcon={<VideoLibraryIcon/>} variant="contained"
                        onClick={() => onAddBlock(YOUTUBE)}>YOUTUBE</Button>
                <Button startIcon={<VideoLibraryIcon/>} variant="contained" className="w-full"
                        onClick={() => onAddBlock(VIMEO)}>VIMEO</Button>
                <Button startIcon={<VideoLibraryIcon/>} variant="contained" className="w-full"
                        onClick={() => onAddBlock(VIDEO)}>VIDEO</Button>
              </div>
            </TabPanel>

            <TabPanel value="6" className={'pt-10 w-full'}>
              <div className={'flex flex-col gap-2 items-center'}>
                <Button variant="contained"
                        onClick={() => onAddBlock('textInput')}>文字入力を追加</Button>
                <Button variant="contained"
                        onClick={() => onAddBlock('numberInput')}>数値入力を追加</Button>
                <Button variant="contained" className={'w-[133px]'}
                        onClick={() => onAddBlock('choice')}>
                  選択肢を追加
                </Button>
              </div>
            </TabPanel>

            <TabPanel value="11" className={'pt-10'}>
              <div className={'flex flex-col gap-2 justify-center'}>
                <Button variant="contained" onClick={() => onAddBlock('popup')}>ポップアップ設定</Button>
                {/*<Button variant="contained" onClick={() => onAddBlock('if')}>条件分岐を追加</Button>*/}
                {/*<Button variant="contained" onClick={() => onAddBlock('for')}>繰り返しを追加</Button>*/}
                <Button variant="contained" onClick={() => onAddBlock('delay')}>時間待ちを追加</Button>
                <Button variant="contained" onClick={() => onAddBlock('timer')}>タイマー</Button>
                <Button variant="contained" onClick={() => onAddBlock('record')}>レコード</Button>
                <Button variant="contained" onClick={() => onAddBlock('time_trigger')}>タイマートリガー</Button>
              </div>
            </TabPanel>

            <TabPanel value="7" className={'pt-10'}>
              <div className={'flex flex-col gap-2 justify-center'}>
                <Button variant="contained" onClick={() => onAddBlock('control')}>登場ブロック</Button>
                <Button className={'text-[12px]'} variant="contained" component="label"
                        startIcon={<AddIcon/>}
                        onClick={() => onAddBlock(START_IMAGE)}>
                  画像モードの開始
                </Button>
                <Button className={'text-[12px]'} variant="contained" component="label"
                        startIcon={<AddIcon/>}
                        onClick={() => onAddBlock(EXIT_IMAGE)}>
                  画像モードの終了
                </Button>
                {/*<Button variant="contained" onClick={() => {*/}
                {/*}}>ロイド登場 ブロック</Button>*/}
              </div>
            </TabPanel>

            <TabPanel value="8" className={'pt-10 w-full'}>
              <Button variant="contained"
                      onClick={() => onAddBlock('motion')}>メンタロイド操作を追加</Button>
            </TabPanel>

            <TabPanel value="9" className={'p-0 mt-5'}>
              {isLoading && <LinearProgress/>}
              <SlideTab isLoading={isLoading}
                        dataSlides={dataSlides}
                        setIdDelete={setIdDelete}
                        setIsModalAdd={setIsModalAdd}
                        setOpenActionDialog={setOpenActionDialog}
                        setOpenShowDialog={setOpenShowDialog}
                        setOpenThumbDialog={setOpenThumbDialog}
                        setOpenThumbRangeDialog={setOpenThumbRangeDialog}
                        isShowModal={isShowModal}
                        fixed={fixed}
              />
            </TabPanel>
            <TabPanel value="10" className={'pt-10 max-h-[90vh] overflow-y-auto'}>
              <div className={'flex flex-col gap-2 justify-center'}>
                <Button startIcon={<img alt={''} src={iconImg.chatgptBtn}/>}
                        className={'bg-[#74AA9C]'}
                        variant="contained" onClick={() => onAddBlock('chatGPT_Prompt')}>
                  <div className={'flex flex-col w-full'}>
                    <span className={'text-[9px] 2xl:text-[14px]'}>GPTが回答（1回）</span>
                    <span className={'text-[9px] 2xl:text-[14px]'}>＋キャラ</span>
                  </div>
                </Button>
                <Button startIcon={<img alt={''} src={iconImg.chatgptBtn}/>}
                        className={'bg-[#74AA9C]'}
                        variant="contained" onClick={() => onAddBlock(PROMPT_V2)}>
                  <div className={'flex flex-col w-full'}>
                    <span className={'text-[9px] 2xl:text-[14px]'}>GPTが回答 V2</span>
                    <span className={'text-[9px] 2xl:text-[14px]'}>（1回）＋キャラ</span>
                  </div>
                </Button>

                <Button startIcon={<img alt={''} src={'/icons/chatGPT.svg'}/>}
                        className={'bg-[#74AA9C]'}
                        variant="contained" onClick={() => onAddBlock(PROMPT_INPUT)}>
                  <div className={'flex w-full flex-col'}>
                    <span className={'text-[9px] 2xl:text-[14px]'}>ユーザー入力（1対話）</span>
                    <span className={'text-[9px] 2xl:text-[14px]'}>＋キャラ</span>
                  </div>
                </Button>
                <Button startIcon={<img alt={''} src={'/icons/chatGPT.svg'}/>}
                        className={'bg-[#74AA9C]'}
                        variant="contained" onClick={() => onAddBlock(PROMPT_INPUT_V2)}>
                  <div className={'flex w-full flex-col'}>
                    <span className={'text-[9px] 2xl:text-[14px]'}>ユーザー入力（1対話）V2</span>
                    <span className={'text-[9px] 2xl:text-[14px]'}>＋キャラ</span>
                  </div>
                </Button>

                <Button startIcon={<img alt={''} src={'/icons/chatGPT.svg'}/>}
                        className={'bg-[#74AA9C]'}
                        variant="contained" onClick={() => onAddBlock('multiPromptInput')}>
                  <div className={'flex-1 flex-col'}>
                    <span className={'text-[9px] 2xl:text-[14px]'}>ユーザー入力</span>
                    <span className={'text-[9px] 2xl:text-[14px]'}>（連続対話）＋キャラ</span>
                  </div>
                </Button>
                <Button startIcon={<img alt={''} src={'/icons/chatGPT.svg'}/>}
                        className={'bg-[#74AA9C]'}
                        variant="contained" onClick={() => onAddBlock(MULTI_PROMPT_INPUT_V2)}>
                  <div className={'flex-1 flex-col'}>
                    <span className={'text-[9px] 2xl:text-[14px]'}>ユーザー入力 V2</span>
                    <span className={'text-[9px] 2xl:text-[14px]'}>（連続対話）＋キャラ</span>
                  </div>
                </Button>

                <Button startIcon={<img alt={''} src={iconImg.chatgptBtn}/>}
                        className={'bg-[#74AA9C] text-[9px] 2xl:text-[14px]'}
                        variant="contained" onClick={() => onAddBlock('withoutChar_prompt')}>
                  <div className={'flex-1'}>
                    GPTが回答（1回）
                  </div>
                </Button>
                <Button startIcon={<img alt={''} src={iconImg.chatgptBtn}/>}
                        className={'bg-[#74AA9C] text-[9px] 2xl:text-[14px]'}
                        variant="contained" onClick={() => onAddBlock(PROMPT_WITHOUT_CHAR_V2)}>
                  <div className={'flex-1'}>
                    GPTが回答 V2（1回）
                  </div>
                </Button>

                <Button startIcon={<img alt={''} src={'/icons/chatGPT.svg'}/>}
                        className={'bg-[#74AA9C] text-[9px] 2xl:text-[14px]'}
                        variant="contained" onClick={() => onAddBlock(PROMPT_INPUT_WITHOUT_CHAR)}>
                  <div className={'flex-1 w-full justify-between'}>
                    ユーザー入力（1対話）
                  </div>
                </Button>
                <Button startIcon={<img alt={''} src={'/icons/chatGPT.svg'}/>}
                        className={'bg-[#74AA9C] text-[9px] 2xl:text-[14px]'}
                        variant="contained" onClick={() => onAddBlock(PROMPT_INPUT_WITHOUT_CHAR_V2)}>
                  <div className={'flex-1 w-full justify-between'}>
                    ユーザー入力 V2（1対話）
                  </div>
                </Button>

                <Button startIcon={<img alt={''} src={'/icons/chatGPT.svg'}/>}
                        className={'bg-[#74AA9C] text-[9px] 2xl:text-[14px]'}
                        variant="contained" onClick={() => onAddBlock(MULTI_PROMPT_INPUT_WITHOUT_CHAR)}>
                  <div className={'flex flex-col w-full'}>
                    <span className={'text-[9px] 2xl:text-[14px]'}>ユーザー入力</span>
                    <span className={'text-[9px] 2xl:text-[14px]'}>（連続対話）</span>
                  </div>
                </Button>
                <Button startIcon={<img alt={''} src={'/icons/chatGPT.svg'}/>}
                        className={'bg-[#74AA9C] text-[9px] 2xl:text-[14px]'}
                        variant="contained" onClick={() => onAddBlock(MULTI_PROMPT_INPUT_WITHOUT_CHAR_V2)}>
                  <div className={'flex flex-col w-full'}>
                    <span className={'text-[9px] 2xl:text-[14px]'}>ユーザー入力 V2</span>
                    <span className={'text-[9px] 2xl:text-[14px]'}>（連続対話）</span>
                  </div>
                </Button>

                <Button
                  className={`bg-[#74AA9C] text-[9px] 2xl:text-[14px] ${(chapterError.checkHasChatGPT) && 'border border-solid border-red-500'}`}
                  disabled={disableChatGPTVersion(blocks) || disableGPTVersion}
                  variant="contained" onClick={() => {
                  onAddBlock('versionSetting')
                  clearChapterError('checkHasChatGPT')
                }}
                >バージョン指定</Button>
                <Button
                  className={`bg-[#74AA9C] text-[9px] 2xl:text-[14px] ${(chapterError.checkHasChatGPT) && 'border border-solid border-red-500'}`}
                  disabled={disableChatGPTVersion(blocks) || disableGPTVersion} variant="contained"
                  onClick={() => {
                    onAddBlock('versionUserChoice')
                    clearChapterError('checkHasChatGPT')
                  }}>ユーザがバージョン選択</Button>
                <Button
                  className={`bg-[#74AA9C] text-[9px] 2xl:text-[14px] ${(chapterError.checkHasChatGPT) && 'border border-solid border-red-500'}`}
                  disabled={disableChatGPTVersion(blocks) || disableGPTVersion}
                  variant="contained"
                  onClick={() => {
                    onAddBlock('continuousChat')
                    clearChapterError('checkHasChatGPT')
                  }}>チャット内容の継続</Button>
              </div>

            </TabPanel>
          </div>

        </TabContext>
      </Box>
      {isModalAdd &&
        <AddSlideModal
          isOpen={isModalAdd}
          setIsOpen={setIsModalAdd}
          getListSlides={getListSlides}
        />
      }
      {idDelete &&
        <BaseDeleteModal
          label={'スライドを削除しますか？'}
          isOpen={Boolean(idDelete?.id)}
          handleClose={() => setIdDelete(defaultDel)}
          categoryName={idDelete?.title}
          handleDelete={handleDeleteSlide}
        />
      }
      {
        openShowDialog &&
        <DialogCustom open={openShowDialog} setOpen={setOpenShowDialog} title={'スライドショー'}>
          <SlideShowDialog
            blockIndex={blockIndex}
            addNewBlocks={addNewBlocks}
            setAddNewBlocks={setAddNewBlocks}
            dataSlides={dataSlides}
            setOpen={setOpenShowDialog}
            setDummyAdd={setDummyAdd}
          />
        </DialogCustom>
      }
      {
        openActionDialog &&
        <DialogCustom open={openActionDialog} setOpen={setOpenActionDialog} title={'スライドアクション'}>
          <SlideActionDialog
            data={dataSlides}
            setOpen={setOpenActionDialog}
            setDummyAdd={setDummyAdd}
            blockIndex={blockIndex}
            addNewBlocks={addNewBlocks}
            setAddNewBlocks={setAddNewBlocks}
          />
        </DialogCustom>
      }
      {
        openThumbDialog &&
        <DialogCustom open={openThumbDialog} setOpen={setOpenThumbDialog} title={'サムネイル'}>
          <SlideThumbDialog data={dataSlides}
                            setOpen={setOpenThumbDialog}
                            setDummyAdd={setDummyAdd}
                            addNewBlocks={addNewBlocks}
                            setAddNewBlocks={setAddNewBlocks}
                            blockIndex={blockIndex}
          />
        </DialogCustom>
      }
      {
        openThumbRangeDialog &&
        <DialogCustom open={openThumbRangeDialog} setOpen={setOpenThumbRangeDialog} title={'サムネイル'}>
          <SlideThumbRangeDialog data={dataSlides} setOpen={setOpenThumbRangeDialog} setDummyAdd={setDummyAdd}
                                 blockIndex={blockIndex} addNewBlocks={addNewBlocks} setAddNewBlocks={setAddNewBlocks}/>
        </DialogCustom>
      }
      {
        openModal &&
        <AddDbTextModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          handleSubmitAdd={handleSubmitAdd}
          category={category}
          message={message}
          setCategory={setCategory}
          setMessage={setMessage}
        />
      }
    </div>
  );
}

export default RightScenario;
