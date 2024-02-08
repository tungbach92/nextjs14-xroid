import React, {useEffect, useMemo, useRef, useState} from 'react';
import CardCustom from "@/app/components/custom/CardCustom";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {readWriteBlocksAtom} from "@/app/store/atom/blocks.atom";
import {cloneDeep, isArray, isEqual, toNumber, uniqWith} from "lodash";
import {useStructureDataAtom} from "@/app/store/atom/structureData.atom";
import CharacterSettingComponent from "@/app/components/custom/chapter/CharacterSettingComponent";
import {Character, CharacterBlock, DataStructureItem} from "@/app/types/types";
import {BlockPrompt, BlockPromptInput, BlockText} from "@/app/types/block";
import {setIsVoiceCharacter} from "@/app/common/setIsVoiceCharacter";
import {
  LIST_PROMT_INPUT,
  MULTI_PROMPT_INPUT_V2,
  PROMPT,
  PROMPT_V2,
  PROMPT_WITHOUT_CHAR,
  PROMPT_WITHOUT_CHAR_V2
} from "@/app/configs/constants";
import ButtonAddVariableAndUserName
  from "@/app/components/custom/chapter/contents/component/ButtonAddVariableAndUserName";
import {structuresInChapterAtom} from "@/app/store/atom/structuresInChapter.atom";
import {openDialogStructAtom} from "@/app/store/atom/openDialogStruct.atom";
import ModalSelectDataStruct from "@/app/components/custom/chapter/contents/component/ModalSelectDataStruct";
import {focusInputPromptAtom} from "@/app/store/atom/focusInputPrompt.atom";
import TextInputPromptV2 from "@/app/components/custom/chapter/TextInputPromptV2";
import {getSelectedStructureItems} from "@/app/common/getSelectedStructureItems";
import {handlePressBackSpace} from "@/app/common/handlePressBackSpace";
import {handleChangeDraftText} from "@/app/common/handleChangeDraftText";
import {getListVarIndex} from "@/app/common/getListVarIndex";
import {handleUpdateBlockFields} from "@/app/common/handleUpdateBlockFields";
import {isBlockNoVoice} from "@/app/common/checkBlockNoVoice";
import useDefaultVoice from "@/app/hooks/useDefaultVoice";
import {allUserEnecolorsAtom} from "@/app/store/atom/allUserEnecolors.atom";
import ButtonAddQAToPrompt from "@/app/components/associateAI/ButtonAddQAToPrompt";
import AssociateAiComp from "@/app/components/associateAI/AssociateAiComp";
import {QaDocTemplate} from "@/app/types/qaDocTemplate";
import {useAssociateAIs} from "@/app/hooks/useAssociates";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {chapterErrorAtom} from "@/app/store/atom/chapterError.atom";

type props = {
  onDelete: () => void
  onCopy: () => void
  onClickCharacter?: (char: CharacterBlock) => void
  characters?: CharacterBlock[]
  block: BlockPrompt | BlockPromptInput
  isEnecolorRankText?: boolean
  isShowAddButton?: boolean
  handleGetIndex?: () => void
  handleMultiCopy?: (type: string) => void
  isPrompt?: boolean,
  title?: string
  isShowLogCheckBox?: boolean
  noCharacterPrompt?: boolean
  chapterId?: string
}


function PromptV2({
  onCopy,
  onDelete,
  block,
  isShowAddButton = false,
  handleGetIndex,
  handleMultiCopy,
  isPrompt = false,
  title,
  isShowLogCheckBox,
  noCharacterPrompt = false,
  chapterId
}: props) {
  const [listDataStructure] = useStructureDataAtom();
  const [characters, setCharacters] = useState<CharacterBlock[]>([])
  const inputRefs = {
    characterPrompt1: useRef<HTMLInputElement | null>(null),
    adminPrompt1: useRef<HTMLInputElement | null>(null),
    userInput: useRef<HTMLInputElement | null>(null),
    adminPrompt2: useRef<HTMLInputElement | null>(null),
    characterPrompt2: useRef<HTMLInputElement | null>(null),
  };
  // const selectedChar = characters?.find((c) => c.isVoice)
  const [focusInput, setFocusInput] = useAtom(focusInputPromptAtom)
  const [blocks, updateBlocks] = useAtom(readWriteBlocksAtom)
  const [isOnchangePrompt1, setIsOnchangePrompt1] = useState(false)
  const [isOnchangePrompt2, setIsOnchangePrompt2] = useState(false)
  const [userInfo] = useAtom<any>(userAtomWithStorage);
  const [openDialogStructDetail, setOpenDialogStructDetail] = useState<boolean>(false)
  const previewInputRef = useRef(null)
  const [structuresInChapter, setStructInChapter] = useAtom(structuresInChapterAtom)
  const [draftText, setDraftText] = useState<string>('')
  const [chapterStructItems, setChapterStructItems] = useState<DataStructureItem[]>([])
  const [draftChapterStructureItems, setDraftChapterStructureItems] = useState<DataStructureItem[]>([])
  const setOpenDialogStruct = useSetAtom(openDialogStructAtom)
  const allUserEnecolors = useAtomValue(allUserEnecolorsAtom)
  const [selectedQaItem, setSelectedQaItem] = useState<QaDocTemplate>(null)
  const {associateAIs, loading} = useAssociateAIs(userInfo?.user_id)
  const renderData = associateAIs?.find(item => item.id === block.data.qaId)
  const [openRemoveQa, setOpenRemoveQa] = useState<boolean>(false);
  const chapterError = useAtomValue(chapterErrorAtom)


  const selectedGroupsStruct = useMemo(() => {
    const _block = cloneDeep(block) as BlockText
    return _block?.data?.groupsStruct?.filter(x => _block?.data?.[focusInput]?.includes(x?.userInput)) ?? []
  }, [block.data.groupsStruct])

  const selectedGroupsText = useMemo(() => {
    const _block = cloneDeep(block) as BlockText
    return _block?.data?.groupsText?.filter(x => _block?.data?.[focusInput]?.includes(x?.userInput)) ?? []
  }, [block.data.groupsText])

  useEffect(() => {
    setDraftText(block?.data?.[focusInput])
  }, [block?.data?.[focusInput]])

  useEffect(() => {
    setFocusInput('characterPrompt1')
  }, [])

  const selectedChar = useMemo(() => {
    return characters?.find((c) => c.isVoice)
  }, [characters])


  useEffect(() => {
    if (!block) return
    if (!block?.characters.length && !('createdAt' in block)) {
      if (!isOnchangePrompt1 || block.data.characterPrompt1 === '') {
        block.data.characterPrompt1 = ''
      }
      if (!isOnchangePrompt2 || block.data.characterPrompt2 === '') {
        block.data.characterPrompt2 = ''
      }
      return;
    }
    if (isOnchangePrompt1) {
      block.data.characterPrompt1 = inputRefs.characterPrompt1.current?.value ?? ''
    } else {
      block.data.characterPrompt1 = block.data.characterPrompt1 || selectedChar?.characterPrompt1 || ''
    }
    if (isOnchangePrompt2) {
      block.data.characterPrompt2 = inputRefs.characterPrompt2.current?.value ?? ''
    } else {
      block.data.characterPrompt2 = block.data.characterPrompt2 || selectedChar?.characterPrompt2 || ''
    }
    updateBlocks(block)
  }, [selectedChar?.characterPrompt1, selectedChar?.characterPrompt2, block?.characters?.length, 'createdAt' in block, isOnchangePrompt1, isOnchangePrompt2]);

  useEffect(() => {
    if (block?.type === PROMPT_V2) {
      setCharacters(block?.characters ?? [])
    }
    if (block?.type === MULTI_PROMPT_INPUT_V2) {
      const multiPromptBlockIndex = blocks.findIndex((b) => b.id === block?.id)
      const nearestPromptAnswerBlock = blocks.find((b, index) => index > multiPromptBlockIndex && b.type === 'multiPromptInputAnswer')
      setCharacters(nearestPromptAnswerBlock?.characters ?? [])
    }
  }, [block, blocks])

  const handleChangeCharacter = (charId: string) => {
    const updatedBlock = setIsVoiceCharacter({updateBlocks, block, charId})
    const blockPrompt = cloneDeep(updatedBlock) as BlockPrompt | BlockPromptInput
    if (!noCharacterPrompt) {
      const voiceChar = updatedBlock.characters.find((c) => c.isVoice)
      blockPrompt.data.characterPrompt1 = voiceChar?.characterPrompt1 ?? inputRefs.characterPrompt1.current?.value ?? ''
      blockPrompt.data.characterPrompt2 = voiceChar?.characterPrompt2 ?? inputRefs.characterPrompt2.current?.value ?? ''
      updateBlocks(blockPrompt)
    }
  }

  const handleChangeCharPrompt = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, type: string) => {
    if (type === 'characterPrompt1') setIsOnchangePrompt1(true)
    if (type === 'characterPrompt2') setIsOnchangePrompt2(true)
    if (!block?.characters || !type) return;
    handleChangeDraftText({block, event, setDraftText, draftText, updateBlockField})
    handleSelectStructItem(block, event)
  }
  const updateBlockField = (_block, inputValue) => {
    if (!block?.characters || !focusInput) return;
    _block.data[focusInput] = inputValue
    const selectedGroupsStruct = block?.data?.groupsStruct?.filter(x => _block?.data?.[focusInput]?.includes(x?.userInput))
    _block.data.groupsStruct = cloneDeep(selectedGroupsStruct)
    updateBlocks(_block)
  }

  const handleFocus = (inputName: string) => {
    setFocusInput(inputName)
  };

  const getListTotalVar = (block: BlockPrompt | BlockPromptInput) => {
    const listVarIndex1 = getListVarIndex(block.data.characterPrompt1)
    const listVarIndex2 = getListVarIndex(block.data.characterPrompt2)
    const listVarIndex3 = getListVarIndex(block.data.adminPrompt1)
    const listVarIndex4 = getListVarIndex(block.data.adminPrompt2)
    const listVarIndex5 = getListVarIndex(block.data.userInput)
    const listTotalVarIndex = listVarIndex1.concat(listVarIndex2, listVarIndex3, listVarIndex4, listVarIndex5)
    const listVar = uniqWith(listTotalVarIndex, isEqual).map(x => x.value)
    return listVar
  }

  const handleSubmitStructItems = () => {
    const _block = cloneDeep(block)
    handleUpdateBlockFields({
      text: draftText,
      field: focusInput,
      enecolors: allUserEnecolors,
      listDataStructure,
      selectedStructureItems: uniqWith(draftChapterStructureItems, isEqual),
      updateBlocks,
      block: _block,
      getListTotalVar
    })
    setChapterStructItems(uniqWith(draftChapterStructureItems, isEqual))
    setOpenDialogStructDetail(false)
  }

  const handleClose = () => {
    setOpenDialogStructDetail(false)
    setDraftChapterStructureItems(chapterStructItems)
    setDraftText(block?.data?.[focusInput])
  }

  const handleSelectStructItem = (_block: BlockPrompt, event: any) => {
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
  const updateBlockFieldOnBackSpace = (_block: BlockPrompt, x: {
    startIndex: number,
    endIndex: number,
    value: string
  }, _selectedStructureItems: DataStructureItem[]) => {
    const text = _block.data[focusInput].slice(0, x.startIndex) + _block.data[focusInput].slice(x.endIndex + 1)
    handleUpdateBlockFields({
      text,
      field: focusInput,
      enecolors: allUserEnecolors,
      listDataStructure,
      selectedStructureItems: uniqWith(_selectedStructureItems, isEqual),
      updateBlocks,
      block: _block,
      getListTotalVar
    })
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
  const {defaultVoice} = useDefaultVoice(selectedChar?.id)
  const handleChangeDelay = (e) => {
    const _block = cloneDeep(block)
    _block.delayTime = toNumber(e.target.value)
    updateBlocks(_block)
  }
  const handleRemoveQaData = () => {
    block.data.qaId = ''
    updateBlocks(block)
    setSelectedQaItem(null)
    setOpenRemoveQa(false)
  }

  return (
    <CardCustom isCopy={true}
                isDelay={isBlockNoVoice(block, defaultVoice?.voiceName)}
                handleChangeDelay={handleChangeDelay}
                delayValue={block?.delayTime}
                isPrompt={isPrompt}
                isShowLogCheckBox={isShowLogCheckBox}
                onCopy={onCopy}
                block={block}
                isShowAddButton={isShowAddButton}
                handleMultiCopy={handleMultiCopy}
                handleGetIndex={handleGetIndex}
                onDelete={onDelete}
                title={title}
                color={'#74AA9C'}
                className={`border-2 border-solid border-[#74AA9C] min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px] w-full`}
    >
      <div className={'flex flex-col gap-2 items-start max-w-full'}>
        <div className={'flex flex-1 pl-3 overflow-x-auto overflow-y-hidden gap-3'}>
          {
            isArray(characters) && !LIST_PROMT_INPUT.includes(block?.type) &&
            characters?.map((c: Character, index) => {
              if (!c.isShow) return null
              return (

                <div key={c.id + index} className={'cursor-pointer'}>
                  <CharacterSettingComponent src={c.avatar}
                                             checked={c.isVoice}
                                             isVolume={c.isVoice}
                                             width={50} height={50}
                                             isUroid={c?.id.includes('uRoidTemp_')}
                                             onlyAvatar={true}
                                             onClickAvatar={() => handleChangeCharacter(c.id)}
                                             borderColor={c.isVoice ? '#1976d2' : '#9B9B9B'}
                  />
                </div>
              )
            })
          }
        </div>
        <div className={'flex gap-2'}>
          <ButtonAddVariableAndUserName inputRef={inputRefs[focusInput]}
                                        block={block}
                                        structuresInChapter={structuresInChapter}
                                        setChapterStructItems={setChapterStructItems}
                                        setDraftText={setDraftText}
                                        setOpenDialogStructDetail={setOpenDialogStructDetail}
                                        type={block.type} selectedGroupsText={selectedGroupsText}
                                        selectedGroupsStruct={selectedGroupsStruct}
                                        focusInput={focusInput}
                                        setFocusInput={setFocusInput}
                                        setIsOnchangePrompt1={setIsOnchangePrompt1}
                                        setIsOnchangePrompt2={setIsOnchangePrompt2}
          />
          <ButtonAddQAToPrompt selectedQaItem={selectedQaItem}
                               setSelectedQaItem={setSelectedQaItem}
                               block={block}/>
        </div>
        {
          block?.data?.qaId ?
            <AssociateAiComp item={renderData ?? selectedQaItem}
                             openRemoveQa={openRemoveQa}
                             setOpenRemoveQa={setOpenRemoveQa}
                             showEditButton={false}
                             isShowRemoveBtn={true}
                             handleRemove={() => handleRemoveQaData()}
                             width={'w-full'}
                             className={'border border-gray-200 rounded-md border-solid'}/> : null
        }
      </div>
      {
        !noCharacterPrompt &&
        <TextInputPromptV2 placeholder={'characterPrompt1'} inputRef={inputRefs.characterPrompt1}
                           field={'characterPrompt1'}
                           state={block?.data?.characterPrompt1}
                           handleChangeState={handleChangeCharPrompt}
                           block={block} handleFocus={handleFocus} bgColor={'#F7D668'}
                           onPressBackSpace={onPressBackSpace}/>

      }
      <TextInputPromptV2 placeholder={'Invisible Prompt'} inputRef={inputRefs.adminPrompt1} field={'adminPrompt1'}
                         state={block?.data?.adminPrompt1}
                         handleChangeState={handleChangeCharPrompt}
                         block={block} handleFocus={handleFocus} bgColor={'#CEE3C0'}
                         onPressBackSpace={onPressBackSpace}
                         error={chapterError.chatGPT && !block?.data?.adminPrompt1 && !block.data.adminPrompt2 && !block?.data?.userInput}/>
      <TextInputPromptV2
        placeholder={`${[PROMPT, PROMPT_WITHOUT_CHAR, PROMPT_V2, PROMPT_WITHOUT_CHAR_V2]?.includes(block?.type) ? '入力欄' : 'ユーザー入力欄'}`}
        inputRef={inputRefs.userInput} field={'userInput'}
        state={block?.data?.userInput}
        handleChangeState={handleChangeCharPrompt}
        block={block} handleFocus={handleFocus} onPressBackSpace={onPressBackSpace}
        error={chapterError.chatGPT && !block?.data?.adminPrompt1 && !block.data.adminPrompt2 && !block?.data?.userInput}/>


      <TextInputPromptV2 placeholder={'Invisible Prompt'} inputRef={inputRefs.adminPrompt2} field={'adminPrompt2'}
                         state={block?.data?.adminPrompt2} handleChangeState={handleChangeCharPrompt}
                         block={block} handleFocus={handleFocus} bgColor={'#CEE3C0'}
                         onPressBackSpace={onPressBackSpace}
                         error={chapterError.chatGPT && !block?.data?.adminPrompt1 && !block.data.adminPrompt2 && !block?.data?.userInput}/>

      {
        !noCharacterPrompt &&
        <TextInputPromptV2 placeholder={'characterPrompt2'} inputRef={inputRefs.characterPrompt2}
                           field={'characterPrompt2'}
                           state={block?.data?.characterPrompt2} handleChangeState={handleChangeCharPrompt}
                           block={block} handleFocus={handleFocus} bgColor={'#F7D668'}
                           onPressBackSpace={onPressBackSpace}/>
      }

      <ModalSelectDataStruct
        isPrompt={true}
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
      />
    </CardCustom>
  );
}

export default React.memo(PromptV2);
