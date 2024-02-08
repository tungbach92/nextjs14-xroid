import React, {ReactNode, useEffect, useMemo, useRef, useState} from 'react';
import CardCustom from "@/app/components/custom/CardCustom";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {readWriteBlocksAtom} from "@/app/store/atom/blocks.atom";
import {cloneDeep, includes, isArray, isNil} from "lodash";
import InputAdornment from '@mui/material/InputAdornment';
import PlayVoiceButton from "@/app/components/custom/chapter/PlayVoiceButton";
import CharacterSettingComponent from "@/app/components/custom/chapter/CharacterSettingComponent";
import {Chapter, Character, CharacterBlock, DataStructureItem, Voice} from "@/app/types/types";
import {getCharacterVoice} from "@/app/common/commonApis/characterVoiceSetting";
import {CssTextField} from "@/app/components/custom/CssTextField";
import {
  BlockEneColorRankImg,
  BlockEnecolorRankText,
  BlockInputEnecolorImage,
  BlockInputEnecolorText,
  BlockText,
  DataInputValues,
  Enecolor
} from "@/app/types/block";
import {setIsVoiceCharacter} from "@/app/common/setIsVoiceCharacter";
import {
  ENECOLOR_RANK_IMG_V2,
  ENECOLOR_RANK_TEXT_V2,
  INPUT_ENECOLOR_IMAGE,
  INPUT_ENECOLOR_TEXT,
  regexDecimal,
  TEXT_V2
} from "@/app/configs/constants";
import {openDialogStructAtom} from "@/app/store/atom/openDialogStruct.atom";
import {structuresInChapterAtom} from "@/app/store/atom/structuresInChapter.atom";
import ButtonAddVariableAndUserName
  from "@/app/components/custom/chapter/contents/component/ButtonAddVariableAndUserName";
import ModalSelectDataStruct from "@/app/components/custom/chapter/contents/component/ModalSelectDataStruct";
import {useStructureDataAtom} from "@/app/store/atom/structureData.atom";
import {textInputRefAtom} from "@/app/store/atom/textInputRef.atom";
import {blockIdAtom} from "@/app/store/atom/blockId.atom";
import {getSelectedStructureItems} from "@/app/common/getSelectedStructureItems";
import {handleChangeDraftText} from "@/app/common/handleChangeDraftText";
import {handlePressBackSpace} from "@/app/common/handlePressBackSpace";
import Dropdown from "@/app/components/custom/Dropdown";
import {structureIdInnChapterAtom} from "@/app/store/atom/structureIdsInChapter.atom";
import {getListVarIndex} from "@/app/common/getListVarIndex";
import {handleUpdateBlockFields} from "@/app/common/handleUpdateBlockFields";
import {isBlockNoVoice} from "@/app/common/checkBlockNoVoice";
import useDefaultVoice from "@/app/hooks/useDefaultVoice";
import {getStructParentId} from "@/app/common/getStructParentId";
import {convertInputNumber} from "@/app/common/convertNumber";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import {twMerge} from "tailwind-merge";
import EnecolorTemplateItem from "@/app/components/enecolorCustomComps/EnecolorTemplateItem";
import {getIconEnecolorRC_CR_RCI_CRI} from "@/app/common/getIconEnecolorRC_CR_RCI_CRI";
import {allUserEnecolorsAtom} from "@/app/store/atom/allUserEnecolors.atom";
import {typeOfNewEnecolorBlockAtom} from "@/app/store/atom/typeOfNewEnecolorBlock.atom";

type props = {
  onDelete?: () => void
  onCopy?: () => void
  onClickCharacter?: (char: CharacterBlock) => void
  block?: BlockText
  isShowAddButton?: boolean
  handleGetIndex?: () => void
  handleMultiCopy?: (type: string) => void
  audio?: HTMLAudioElement
  setAudio?: React.Dispatch<React.SetStateAction<HTMLAudioElement>>
  disableSound?: boolean
  chapter: Chapter
  color?: string
  title?: string | ReactNode
}


function TextTemplateV2({
                          onCopy,
                          onDelete,
                          block,
                          isShowAddButton = false,
                          handleGetIndex,
                          handleMultiCopy,
                          audio,
                          setAudio,
                          disableSound,
                          chapter,
                          color = '#3AD1FF',
                          title = 'Text'
                        }: props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const characters = block?.characters ?? []
  const selectedChar = characters?.find((c) => c.isVoice)
  const updateBlocks = useSetAtom(readWriteBlocksAtom)
  const [selectedVoice, setSelectedVoice] = useState<Voice>(null)
  const voiceId = useMemo(() => {
    return block?.characters?.find((c) => c.isVoice)?.voiceId
  }, [block?.characters])
  const [openDialogStructDetail, setOpenDialogStructDetail] = useState<boolean>(false)
  const [listDataStructure] = useStructureDataAtom();
  const [ids] = useAtom(structureIdInnChapterAtom)
  const previewInputRef = useRef(null)
  const [structuresInChapter, setStructInChapter] = useAtom(structuresInChapterAtom)
  const [draftText, setDraftText] = useState<string>('')
  const [chapterStructItems, setChapterStructItems] = useState<DataStructureItem[]>([])
  const [draftChapterStructureItems, setDraftChapterStructureItems] = useState<DataStructureItem[]>([])
  const setOpenDialogStruct = useSetAtom(openDialogStructAtom)
  const [textVoiceErr, setTextVoiceErr] = useState<boolean>(false)
  const allUserEnecolors = useAtomValue(allUserEnecolorsAtom)
  const setTextInputRef = useSetAtom(textInputRefAtom)
  const setBlockId = useSetAtom(blockIdAtom)
  const [selectedEnecolors, setSelectedEnecolors] = useState<Enecolor[]>([])
  const [draftSelectedEnecolors, setDraftSelectedEnecolors] = useState<Enecolor[]>([])
  const [delay, setDelay] = useState<string>('1')
  const [anchorElPreview, setAnchorElPreview] = useState<HTMLElement | null>(null);
  const openPreview = Boolean(anchorElPreview)
  const idPreview = openPreview ? 'simple-popover-preview' : undefined;
  const {defaultVoice: characterVoiceDefault} = useDefaultVoice(selectedChar?.id)
  const [, setNewEnecolorBlockType] = useAtom(typeOfNewEnecolorBlockAtom)

  useEffect(() => {
    // @ts-ignore
    if (block.type === INPUT_ENECOLOR_IMAGE || block.type === ENECOLOR_RANK_IMG_V2) {
      const s = allUserEnecolors.find(x => 'enecolorId' in block.data && x.id === block.data.enecolorId)
      if (!isNil(s)) {
        setSelectedEnecolors([s])
        setDraftSelectedEnecolors([s])
      }
    }
    if (block.type === INPUT_ENECOLOR_TEXT || block.type === ENECOLOR_RANK_TEXT_V2) {
      const enecolorIds = block.data?.groupsText?.map(x => x.enecolorId)
      const s = enecolorIds?.map(id => allUserEnecolors.find(y => y.id === id) as Enecolor) || []
      setSelectedEnecolors(s)
    }
  }, [block.data, block.type])

  const selectedGroupsStruct = useMemo(() => {
    const _block = cloneDeep(block) as BlockText
    return _block?.data?.groupsStruct?.filter(x => _block?.data?.message?.japanese?.includes(x?.userInput)) ?? []
  }, [block.data.groupsStruct])

  const selectedGroupsText = useMemo(() => {
    const _block = cloneDeep(block) as BlockText
    return _block?.data?.groupsText?.filter(x => _block?.data?.message?.japanese?.includes(x?.userInput)) ?? []
  }, [block.data.groupsText])

  const dataSelect = useMemo(() => {
    let result: { value: string, label: string }[] = []
    if (listDataStructure?.length && ids?.length) {
      const selectedStruct = listDataStructure.filter(i => includes(ids, i.id))
      selectedStruct.forEach(struct => {
        struct.items.forEach((item) => {
          if (!item.fieldPath) return;
          result.push({
            value: item.id,
            label: `${struct.name} : ${item.fieldPath}`,
          })
        })
      })
    }
    return result
  }, [listDataStructure, ids])

  useEffect(() => {
    const _selectedStructureItemIds = selectedGroupsStruct?.map(x => x.dataStructId)?.concat(selectedGroupsText?.map(x => x.dataStructId))
    const _selectedStructureItems = structuresInChapter?.map(x => x.items)?.flat()?.filter(y => _selectedStructureItemIds.includes(y.id))
    setChapterStructItems(_selectedStructureItems)
    setDraftChapterStructureItems(_selectedStructureItems)
  }, [selectedGroupsStruct, selectedGroupsText, structuresInChapter])


  useEffect(() => {
    setDraftText(block?.data?.message?.japanese)
  }, [block?.data?.message?.japanese])

  useEffect(() => {
    if (!selectedChar?.id) return;
    const getSelectedVoice = () => {
      getCharacterVoice(selectedChar?.id, voiceId)
        .then(res =>
          setSelectedVoice(res.data))
        .catch(e => console.log(e))
    }
    getSelectedVoice()
  }, [selectedChar?.id, voiceId])

  // useSetGroupsTextValue({
  //   output_type,
  //   resultUserInputs,
  //   id: block?.id,
  //   isShowUserInputLabel
  // })
  // useSetGroupsStruct({output_type, id: block?.id, resultUserInputs, setIsShowUserInputLabel})

  useEffect(() => {
    const handleScroll = () => {
      inputRef.current?.blur()
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setDelay(convertInputNumber(block.delayTime))
  }, [block?.delayTime])

  const handleOpenPopoverPreview = (event: any) => {
    event.stopPropagation();
    event.preventDefault()
    setAnchorElPreview(event.currentTarget);
  };
  const handleClosePopoverPreview = (e) => {
    e.stopPropagation();
    e.preventDefault()
    setAnchorElPreview(null);
  };

  const handleChangeCharacter = (charId: string) => {
    setIsVoiceCharacter({updateBlocks, block, charId})
  }

  const handleSelectStructItem = (_block: BlockText, event: any) => {
    const inputValue = event.target.value
    const _selectedStructureItems = getSelectedStructureItems({
      inputValue,
      structuresInChapter,
    })
    setChapterStructItems(_selectedStructureItems)
    const listVarIndex = getListVarIndex(inputValue)
    const listVar = listVarIndex.map(x => x.value)
    handleUpdateBlockFields({
      selectedStructureItems: _selectedStructureItems,
      listDataStructure,
      enecolors: allUserEnecolors,
      updateBlocks,
      block: _block,
      listVar
    })
  }

  const updateBlockFieldOnChange = (_block, inputValue) => {
    _block.data.message.japanese = inputValue
    _block.data.message.english = inputValue
    const selectedGroupsStruct = block?.data?.groupsStruct?.filter(x => _block?.data?.message?.japanese?.includes(x?.userInput))
    _block.data.groupsStruct = cloneDeep(selectedGroupsStruct)
    updateBlocks(_block)
  }
  const updateBlockFieldOnBackSpace = (_block: BlockText, x: {
    startIndex: number,
    endIndex: number,
    value: string
  }, _selectedStructureItems: DataStructureItem[]) => {
    const text = block.data.message.japanese.slice(0, x.startIndex) + block.data.message.japanese.slice(x.endIndex + 1)
    const listVarIndex = getListVarIndex(text)
    const listVar = listVarIndex.map(x => x.value)
    handleUpdateBlockFields({
      field: "japanese",
      text,
      selectedStructureItems: _selectedStructureItems,
      listDataStructure,
      enecolors: allUserEnecolors,
      updateBlocks,
      block: _block,
      listVar
    })
  }

  const onChangeOutPutText = (event) => {
    handleChangeDraftText({block, event, setDraftText, draftText, updateBlockField: updateBlockFieldOnChange})
    handleSelectStructItem(block, event)
  }

  const onPressBackSpace = (event) => {
    const _block = cloneDeep(block)
    handlePressBackSpace({
      event,
      _block,
      structuresInChapter,
      draftText,
      setDraftText,
      draftChapterStructureItems,
      setDraftChapterStructureItems,
      updateBlockFieldOnBackSpace
    })
  }

  const handleSubmitStructItems = () => {
    if (block.type === INPUT_ENECOLOR_IMAGE || block.type === ENECOLOR_RANK_IMG_V2) {
      setSelectedEnecolors?.(draftSelectedEnecolors)
      const _block = cloneDeep(block) as BlockInputEnecolorImage | BlockEneColorRankImg
      _block.data.enecolorId = draftSelectedEnecolors?.[0]?.id
      updateBlocks(_block)
    } else {
      const _block = cloneDeep(block)
      const listVarIndex = getListVarIndex(draftText)
      const listVar = listVarIndex.map(x => x.value)
      handleUpdateBlockFields({
        field: "japanese",
        text: draftText,
        enecolors: allUserEnecolors,
        listDataStructure,
        selectedStructureItems: draftChapterStructureItems,
        updateBlocks,
        block: _block,
        listVar
      })
      setChapterStructItems(draftChapterStructureItems)
    }
    setOpenDialogStructDetail(false)
    setDraftSelectedEnecolors([])
  }
  const handleClose = () => {
    const enecolorIds = block.data?.groupsText?.map(x => x.enecolorId)
    const s = enecolorIds?.map(id => allUserEnecolors.find(y => y.id === id) as Enecolor) || []
    setOpenDialogStructDetail(false)
    setDraftChapterStructureItems(chapterStructItems)
    setDraftText(block?.data?.message?.japanese)
    setDraftSelectedEnecolors([])
    setSelectedEnecolors(s)
    setDraftChapterStructureItems([])
    setNewEnecolorBlockType('')
  }
  const handleOnChangeStruct = (field: string, value: DataInputValues) => {
    const _block = cloneDeep(block) as BlockInputEnecolorText
    _block.data[field] = value
    _block.data.parentId = getStructParentId(listDataStructure, value.toString())
    // _block.data.fieldPath = getFieldPath(listDataStructure, value.toString())
    updateBlocks(_block)
  }


  const getColorTitle = (enecolor: Enecolor) => {
    if (enecolor?.output_type === 'enecolor_4' || enecolor?.output_type === 'enecolor_16') {
      return <span className={'my-auto'}>→順位</span>
    }
    return ""
  }

  const getRankTitle = (enecolor: Enecolor) => {
    if (enecolor?.output_type === 'enecolor_4' || enecolor?.output_type === 'enecolor_16') {
      return <span className={'my-auto'}>{`${enecolor?.rank ? enecolor?.rank + '位→' : ''}`}</span>
    }
    if (enecolor?.output_type === 'enecolor_4_rank' || enecolor?.output_type === 'enecolor_16_rank') {
      return <span
        className={'my-auto'}>{`${enecolor?.groupsText?.rank ? enecolor?.groupsText?.rank + '位→' : enecolor?.rank ? enecolor?.rank + '位→' : ''}`}</span>
    }
    return ""
  }

  const handleChangeIsNotShow = (e) => {
    const _block = cloneDeep(block) as BlockInputEnecolorText | BlockInputEnecolorImage
    _block.isHidden = e.target.checked
    updateBlocks(_block)
  }
  const handleChangeDelay = (e) => {
    if (!regexDecimal.test(e.target.value)) return
    if (!e.target.value)
      return setDelay('0')
    setDelay(e.target.value)
    const _block = cloneDeep(block) as BlockEnecolorRankText | BlockEneColorRankImg | BlockInputEnecolorImage
    _block.delayTime = Number(e.target.value)
    updateBlocks(_block)
  }

  return (
    <CardCustom isCopy={true}
                isDelay={isBlockNoVoice(block, characterVoiceDefault?.voiceName)}
                delayValue={delay}
                handleChangeDelay={handleChangeDelay}
                onCopy={onCopy}
                block={block}
                isShowAddButton={isShowAddButton}
                handleMultiCopy={handleMultiCopy}
                handleGetIndex={handleGetIndex}
                onDelete={onDelete}
                title={title}
                color={color}
                className={`border-2 border-solid border-[${color}] w-full min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px]`}
    >
      <div className={'flex items-start gap-2'} onClick={handleClosePopoverPreview}>
        <div className={'w-[63%] flex gap-2 items-center flex-1'}>
          <ButtonAddVariableAndUserName inputRef={inputRef} block={block}
                                        structuresInChapter={structuresInChapter}
                                        setChapterStructItems={setChapterStructItems}
                                        setDraftText={setDraftText}
                                        selectedEnecolors={selectedEnecolors}
                                        setDraftEnecolors={setDraftSelectedEnecolors}
                                        setOpenDialogStructDetail={setOpenDialogStructDetail}
                                        type={TEXT_V2} selectedGroupsText={selectedGroupsText}
                                        selectedGroupsStruct={selectedGroupsStruct}

          />
          <div className={'flex flex-1 overflow-x-auto overflow-y-hidden min-h-12 gap-2'}>
            {
              isArray(characters) &&
              characters?.map((c: Character, index) => {
                if (!c.isShow) return null
                return (
                  <div key={c.id + index} className={'cursor-pointer'}>
                    <CharacterSettingComponent src={c.avatar}
                                               checked={c.isVoice}
                                               isVolume={c.isVoice}
                                               width={50} height={50}
                                               onClickAvatar={() => handleChangeCharacter(c.id)}
                                               borderColor={c.isVoice ? '#1976d2' : '#9B9B9B'}
                    />
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
      {(block?.type === TEXT_V2 || block?.type === INPUT_ENECOLOR_TEXT || block?.type === ENECOLOR_RANK_TEXT_V2) &&
        <div className={'py-4 text-xs flex flex-col'}>
          <CssTextField
            maxRows={5}
            inputRef={inputRef}
            inputProps={{'data-tempid': block?.id}}
            InputLabelProps={{shrink: true}}
            id="outlined-basic"
            label="出力テキスト"
            multiline={true}
            value={openDialogStructDetail ? block?.data?.message?.japanese : draftText}
            onChange={onChangeOutPutText}
            onKeyDown={onPressBackSpace}
            onClick={() => {
              setTextInputRef(inputRef)
              setBlockId(block?.id ?? '')
            }}
            variant="outlined"
            size={'small'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <PlayVoiceButton text={block?.data?.message?.japanese}
                                   pitch={selectedVoice?.pitch ?? characterVoiceDefault?.pitch}
                                   speed={selectedVoice?.speed ?? characterVoiceDefault?.speed}
                                   volume={selectedVoice?.volume ?? characterVoiceDefault?.volume}
                                   voiceName={selectedVoice?.voiceName ?? characterVoiceDefault?.voiceName}
                                   emotion={selectedVoice?.emotion ?? characterVoiceDefault?.emotion}
                                   emotion_level={selectedVoice?.emotion_level ?? characterVoiceDefault?.emotion_level}
                                   audio={audio}
                                   setAudio={setAudio}
                                   disabled={disableSound}
                                   setTextVoiceErr={setTextVoiceErr}

                  />
                </InputAdornment>
              )
            }}
            className={'pb-2'}
            error={textVoiceErr}
          />
        </div>
      }
      {(block?.type === INPUT_ENECOLOR_TEXT || block?.type === INPUT_ENECOLOR_IMAGE || block?.type === ENECOLOR_RANK_TEXT_V2 || block?.type === ENECOLOR_RANK_IMG_V2) &&
        <>
          <div className={twMerge('flex flex-col gap-2 p-2 bg-[#EBEBEB] max-h-[150px] overflow-y-auto rounded-md')}>
            {selectedEnecolors?.map(x => {
                return (
                  <EnecolorTemplateItem key={x.id} item={x} bgColor={'bg-white'}
                                        icon={getIconEnecolorRC_CR_RCI_CRI(x)}
                  />
                )
              }
            )}
          </div>
          {(block?.type === INPUT_ENECOLOR_TEXT || block?.type === INPUT_ENECOLOR_IMAGE) &&
            <Dropdown dataSelect={dataSelect} value={block?.data?.dataInput} label={'Input'} isInPutLabel
                      onChange={(event) => handleOnChangeStruct("dataInput", event.target.value)}
                      minWidth={130} className={'mt-4 flex-1'}/>
          }
        </>
      }
      <div className={'mt-3 flex w-full'}>
        {(block?.type === INPUT_ENECOLOR_IMAGE || block?.type === INPUT_ENECOLOR_TEXT) &&
          <FormControlLabel control={<Checkbox
            checked={block?.isHidden || false}
            onChange={handleChangeIsNotShow}
          />}
                            label={<Typography className={''}>ユーザーに表示しない</Typography>}
          />
        }
        {/*{(block?.type === ENECOLOR_RANK_TEXT_V2 || block?.type === ENECOLOR_RANK_IMG_V2 || block?.type === INPUT_ENECOLOR_IMAGE) &&*/}
        {/*  <CssTextField*/}
        {/*    label={'表示時間'}*/}
        {/*    InputProps={{*/}
        {/*      inputProps: {*/}
        {/*        inputMode: "numeric",*/}
        {/*        pattern: '[0-9]*[.,]?[0-9]*',*/}
        {/*      },*/}
        {/*      endAdornment: <InputAdornment position="end">秒</InputAdornment>*/}
        {/*    }}*/}
        {/*    size={'small'}*/}
        {/*    className={'w-1/3  ml-auto'}*/}
        {/*    value={delay ?? '0'}*/}
        {/*    onChange={handleChangeDelay}*/}
        {/*  />*/}
        {/*}*/}
      </div>
      <ModalSelectDataStruct
        draftSelectedEnecolors={draftSelectedEnecolors}
        setDraftSelectedEnecolors={setDraftSelectedEnecolors}
        openDialogStructDetail={openDialogStructDetail}
        setOpenDialogStructDetail={setOpenDialogStructDetail}
        handleSubmitStructItems={handleSubmitStructItems}
        handleClose={handleClose}
        draftText={draftText}
        setDraftText={setDraftText}
        draftChapterStructureItems={draftChapterStructureItems}
        setDraftChapterStructureItems={setDraftChapterStructureItems}
        structuresInChapter={structuresInChapter}
        block={block}
        setStructInChapter={setStructInChapter}
        setOpenDialogStruct={setOpenDialogStruct}
        previewInputRef={previewInputRef}
        chapter={chapter}
        type={block.type}
      />
    </CardCustom>
  );
}

export default React.memo(TextTemplateV2);
