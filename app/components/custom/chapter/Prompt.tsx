import React, {useEffect, useMemo, useRef, useState} from 'react';
import CardCustom from "@/app/components/custom/CardCustom";
import Dropdown from "@/app/components/custom/Dropdown";
import {rankData} from "@/app/common/rankData";
import {Enecolor16ImageText, Enecolor16Rank, Enecolor4ImageText, Enecolor4Rank} from "@/app/common/colorData";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {readWriteBlocksAtom} from "@/app/store/atom/blocks.atom";
import {cloneDeep, includes, isArray, isEqual, toNumber} from "lodash";
import {useStructureDataAtom} from "@/app/store/atom/structureData.atom";
import {structureIdInnChapterAtom} from "@/app/store/atom/structureIdsInChapter.atom";
import TextBlocksCustom from "@/app/components/custom/chapter/TextBlocksCustom";
import {Button} from "@mui/material";
import {getId} from "@/app/common/getId";
import {getStructParentId} from '@/app/common/getStructParentId';
import {createEneColorSetting} from "@/app/common/commonApis/eneColorSettingApi";
import {toast} from "react-toastify";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import AddIcon from "@mui/icons-material/Add";
import {EnecolorSettingName} from "@/app/components/custom/chapter/EnecolorSettingName";
import {useGetEnecolorRankTextSettings} from "@/app/hooks/useGetEnecolorRankTextSettings";
import {useGetTextSetting} from "@/app/hooks/useGetTextSetting";
import {useSetGroupsTextValue} from "@/app/hooks/useSetGroupsTextValue";
import {useSetGroupsStruct} from "@/app/hooks/useSetGroupsStruct";
import CharacterSettingComponent from "@/app/components/custom/chapter/CharacterSettingComponent";
import {Character, CharacterBlock} from "@/app/types/types";
import {CssTextField} from "@/app/components/custom/CssTextField";
import {BlockPrompt, BlockPromptInput, SaveSetting} from "@/app/types/block";
import {setIsVoiceCharacter} from "@/app/common/setIsVoiceCharacter";
import {LIST_PROMT_INPUT, PROMPT, PROMPT_WITHOUT_CHAR} from "@/app/configs/constants";
import {isBlockNoVoice} from "@/app/common/checkBlockNoVoice";
import useDefaultVoice from "@/app/hooks/useDefaultVoice";
import ButtonAddQAToPrompt from "@/app/components/associateAI/ButtonAddQAToPrompt";
import {QaDocTemplate} from "@/app/types/qaDocTemplate";
import AssociateAiComp from "@/app/components/associateAI/AssociateAiComp";
import {useAssociateAIs} from "@/app/hooks/useAssociates";
import {chapterErrorAtom} from "@/app/store/atom/chapterError.atom";
import {saveButtonPropsAtom} from "@/app/components/Header/SaveButton";


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

const dataSelect = [
  {value: 'text', label: 'シンプル'},
  {value: 'enecolor_4_rank', label: 'エネカラー４(順位)'},
  {value: 'enecolor_4', label: 'エネカラー４(カラー)'},
  {value: 'enecolor_16_rank', label: 'エネカラー16(順位)'},
  {value: 'enecolor_16', label: 'エネカラー16(カラー)'},
]
const dataSelectRank = [
  {value: 'enecolor_4_rank', label: 'エネカラー４(順位)'},
  {value: 'enecolor_4', label: 'エネカラー４(カラー)'},
  {value: 'enecolor_16_rank', label: 'エネカラー16(順位)'},
  {value: 'enecolor_16', label: 'エネカラー16(カラー)'},
]

function Prompt({
  onCopy,
  onDelete,
  block,
  isEnecolorRankText = false,
  isShowAddButton = false,
  handleGetIndex,
  handleMultiCopy,
  isPrompt = false,
  title,
  isShowLogCheckBox,
  noCharacterPrompt = false,
}: props) {
  const [isShowUserInputLabel, setIsShowUserInputLabel] = useState(false)
  const [structureDataAtom] = useStructureDataAtom();
  const [ids] = useAtom(structureIdInnChapterAtom)
  const [textSettingName, setTextSettingName] = useState<string>('');
  const [colInput, setColInput] = useState<number>(1);
  const [characters, setCharacters] = useState<CharacterBlock[]>([])
  const [userInfo] = useAtom<any>(userAtomWithStorage);
  const userId = userInfo?.user_id;
  const inputRefs = {
    characterPrompt1: useRef<HTMLInputElement | null>(null),
    adminPrompt1: useRef<HTMLInputElement | null>(null),
    userInput: useRef<HTMLInputElement | null>(null),
    adminPrompt2: useRef<HTMLInputElement | null>(null),
    characterPrompt2: useRef<HTMLInputElement | null>(null),
  };
  const [resultUserInputs, setResultUserInputs] = useState<string[]>([])
  const [counter, setCounter] = useState(0);
  const {eneColorRankTextSettings} = useGetEnecolorRankTextSettings()
  const {textSettings} = useGetTextSetting()
  const [focusInput, setFocusInput] = useState('')
  const output_type = block?.data?.output_type ?? ''
  const [, updateBlocks] = useAtom(readWriteBlocksAtom)
  const setSaveButtonProps = useSetAtom(saveButtonPropsAtom);
  const [openNameDialog, setOpenNameDialog] = useState<boolean>(false)
  const [isOnchangePrompt1, setIsOnchangePrompt1] = useState(false)
  const [isOnchangePrompt2, setIsOnchangePrompt2] = useState(false)
  const [selectedQaItem, setSelectedQaItem] = useState<QaDocTemplate>(null)
  const {associateAIs, loading} = useAssociateAIs(userInfo?.user_id)
  const renderData = associateAIs?.find(item => item.id === block.data.qaId)
  const [openRemoveQa, setOpenRemoveQa] = useState<boolean>(false);
  const chapterError = useAtomValue(chapterErrorAtom)
  const selectedChar = useMemo(() => {
    return characters?.find((c) => c.isVoice)
  }, [characters])

  const {defaultVoice} = useDefaultVoice(selectedChar?.id)

  useEffect(() => {
    if (!block) return
    if (!block?.characters.length && !('createdAt' in block)) {
      if (!isOnchangePrompt1 || block?.data?.characterPrompt1 === '') {
        block.data.characterPrompt1 = ''
      }
      if (!isOnchangePrompt2 || block?.data?.characterPrompt2 === '') {
        block.data.characterPrompt2 = ''
      }
      return;
    }
    if ('createdAt' in block) {
      return;
    } else {
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
    }
    updateBlocks(block)
  }, [selectedChar?.characterPrompt1, selectedChar?.characterPrompt2, block?.characters?.length, focusInput, 'createdAt' in block, isOnchangePrompt1, isOnchangePrompt2]);

  useEffect(() => {
    const inputsValue =
      block?.data?.characterPrompt1 +
      block?.data?.adminPrompt1 +
      block?.data?.userInput +
      block?.data?.adminPrompt2 +
      block?.data?.characterPrompt2
    const matches = inputsValue.match(/\{[^}]+\}|\｛[^｝]+\｝/g);
    const result = matches?.map((match) => {
      if (match === '{name}' || match === '{{Uroid}') return null
      else return match
    }).filter((item) => item !== null)
    setResultUserInputs(result)
  }, [block?.data?.characterPrompt1, block?.data?.adminPrompt1, block?.data?.userInput, block?.data?.adminPrompt2, block?.data?.characterPrompt2])

  useEffect(() => {
    setCharacters(block?.characters ?? [])
  }, [block])

  useEffect(() => {
    if (!resultUserInputs)
      setCounter(0)
  }, [resultUserInputs]);

  useEffect(() => {
    if (output_type === 'text') {
      setIsShowUserInputLabel(true)
    }
  }, [output_type])

  const structure = structureDataAtom?.map((struct) => {
    if (includes(ids, struct.id))
      return struct
  }).filter((item) => item !== undefined) || []

  useSetGroupsTextValue({
    output_type,
    resultUserInputs,
    id: block?.id,
    isShowUserInputLabel
  })
  useSetGroupsStruct({output_type, id: block?.id, resultUserInputs, setIsShowUserInputLabel})
  const dataStructIds = useMemo(() => {
    let data = []
    structure?.forEach((item) => {
      item.items.forEach((i) => {
        if (!i.fieldPath) return;
        data.push({
          value: i.id,
          label: `${item.name} : ${i.fieldPath}`,
        })
      })
    })
    return data
  }, [structure])

  const enecolorForms = useMemo(() => {
    if (output_type === 'enecolor_4_rank') {
      setColInput(2);
      return Enecolor4ImageText.map((item) => {
        return {
          name: item.name,
          text: item.url,
          label: item.label,
          color: item.color
        }
      });
    }
    if (output_type === 'enecolor_16_rank') {

      setColInput(4);
      return Enecolor16ImageText.map((item) => {
        return {
          name: item.name,
          text: item.url,
          label: item.label,
          color: item.color
        }
      });
    }
    if (output_type === 'enecolor_4') {
      setColInput(1);
      return Enecolor4Rank.map((item) => {
        return {
          name: item.name,
          text: item.url,
        }
      })
    }
    if (output_type === 'enecolor_16') {
      setColInput(2);
      return Enecolor16Rank.map((item) => {
        return {
          name: item.name,
          text: item.url,
        }
      });
    }
  }, [output_type])

  const handleChangeOutputType = (e) => {
    const _block = cloneDeep(block)
    _block.data.output_type = e.target.value
    _block.data.groupsText = []
    _block.data.groupsStruct = []
    updateBlocks(_block)
  }

  const handleChangeStructureOutPut = (event, idx) => {
    const _block = cloneDeep(block)
    if (idx <= _block.data.groupsStruct.length - 1) {
      _block.data.groupsStruct[idx].dataStructId = event.target.value
      _block.data.groupsStruct[idx].parentId = getStructParentId(structure, event.target.value)
    } else {
      _block.data.groupsStruct.push({
        dataStructId: event.target.value,
        parentId: getStructParentId(structure, event.target.value),
        userInput: resultUserInputs[idx]
      })
    }
    updateBlocks(_block)
  }
  const handleChangeRank = (event, idx) => {
    const _block = cloneDeep(block)
    if (_block.data.groupsText.length) {
      (_block.data.groupsText[idx] && _block.data.groupsText[idx]?.rank) && (_block.data.groupsText[idx].rank = event.target.value)
    }
    updateBlocks(_block)
  }

  const handleChangeColor = (event, idx) => {
    const _block = cloneDeep(block)
    let _groupsText = _block?.data?.groupsText ?? []
    if (_groupsText?.length) {
      (_groupsText[idx] && _groupsText[idx]?.color) && (_groupsText[idx].color = event.target.value)
      _block.data.groupsText = [..._groupsText]
    }
    updateBlocks(_block)
  }
  const is16RankValue = (value) => {
    const value16rank = Enecolor16ImageText.map(item => item.name)
    return value16rank.includes(value)
  }

  const is4RankValue = (value) => {
    const value4rank = Enecolor4ImageText.map(item => item.name)
    return value4rank.includes(value)
  }

  const is4ColorValue = (value) => {
    const valueColor = Enecolor4Rank.map((item, index) => index + 1)
    return valueColor.includes(value)
  }

  const is16ColorValue = (value) => {
    const valueColor = Enecolor16Rank.map((item, index) => index + 1)
    return valueColor.includes(value)
  }
  const saveSetting = async () => {
    if (!textSettingName) return
    try {
      const duplicateName = (block?.type === 'text' || block?.type === 'promptInput' ? textSettings : eneColorRankTextSettings)?.find(item => item?.title === textSettingName)
      if (duplicateName)
        return toast.error("保存されたデータと同じ名前を使うことができません。")

      // const _blocks = customBlocks(blocks)
      const enecolorSettingBlock: SaveSetting = {
        ...block,
        id: getId("block_", 10),
        title: textSettingName,
        isDeleted: false,
        userId
      }

      let duplicateData = (block?.type === 'text' || block?.type === 'promptInput' ? textSettings : eneColorRankTextSettings)?.filter(item => item?.type === enecolorSettingBlock?.type && isEqual(item?.data, enecolorSettingBlock?.data))
      if (duplicateData?.length)
        return toast.error('保存されたデータと同じ設定を保存できません。')

      await createEneColorSetting(enecolorSettingBlock)
      toast.success(`${block?.type === 'text' ? 'テキストの設定を「保存済データリスト」に保存しました。' : 'エネカラー文章の設定を「保存済みエネカラー文章リスト」に保存しました。'}`, {autoClose: 3000})
      setTextSettingName('')
      setOpenNameDialog(false)
    } catch (e) {
      console.log(e)
      toast.error("エネカラーテキスト設定が追加できませんでした。" + e.message, {autoClose: 3000});
    } finally {
      // setTextSettingName('')
    }
  }

  const addSpecialText = (type: string) => {
    if (!focusInput) return;
    if (focusInput === 'characterPrompt1') setIsOnchangePrompt1(true);
    if (focusInput === 'characterPrompt2') setIsOnchangePrompt2(true);
    if (type === 'number') {
      setCounter(counter + 1);
    }
    const inputElement = inputRefs[focusInput].current;
    if (inputElement) {
      const {selectionStart, selectionEnd} = inputElement;
      const currentValue = inputElement.value;
      if (type === 'number') {
        inputElement.value = `${currentValue.slice(0, selectionStart)}{${counter}}${currentValue.slice(selectionEnd)}`;
        inputElement.selectionStart = selectionStart + ('{' + counter.toString() + '}').length
        inputElement.selectionEnd = selectionStart + ('{' + counter.toString() + '}').length
      }
      if (type === 'name') {
        inputElement.value = `${currentValue.slice(0, selectionStart)}{name}${currentValue.slice(selectionEnd)}`;
        inputElement.selectionStart = selectionStart + '{name}'.length
        inputElement.selectionEnd = selectionStart + '{name}'.length
      }
      block.data[focusInput] = inputElement.value
      updateBlocks(block)
      inputElement.focus();
    }
  }

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

  const handleChangeCharPrompt = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, type: string) => {
    if (type === 'characterPrompt1') setIsOnchangePrompt1(true)
    if (type === 'characterPrompt2') setIsOnchangePrompt2(true)
    if (!block?.characters || !type) return;
    block.data[type] = e.target.value
    updateBlocks(block)
  }

  const handleGroupTextChange = (e, grtIndex, grIndex) => {
    const _block = cloneDeep(block)
    _block.data.groupsText[grtIndex].groups[grIndex] = e.target.value
    updateBlocks(_block)
  }

  const handleFocus = (inputName: string) => {
    setFocusInput(inputName)
  };
  const handleChangeDelay = (e) => {
    const _block = cloneDeep(block)
    _block.delayTime = toNumber(e.target.value)
    updateBlocks(_block)
  }

  const handleRemoveQaData = () => {
    setSelectedQaItem(null)
    block.data.qaId = ''
    updateBlocks(block)
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
        {
          isArray(characters) && !LIST_PROMT_INPUT.includes(block?.type) ?
            <div className={'flex flex-1 pl-3 overflow-x-auto overflow-y-hidden gap-3'}>
              {
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
            </div> : null
        }

        <div className={'flex gap-2'}>
          <Button
            onClick={() => addSpecialText("number")}
            className={'h-8 text-sx'}
            size={'small'}
            startIcon={<AddIcon/>}
            variant="contained">変数</Button>
          <Button
            onClick={() => addSpecialText("name")}
            className={'h-8 text-sx'}
            size={'small'}
            startIcon={<AddIcon/>}
            variant="contained">ユーザー名</Button>
          <ButtonAddQAToPrompt selectedQaItem={selectedQaItem}
                               setSelectedQaItem={setSelectedQaItem}
                               block={block}/>
        </div>
        {
          block?.data?.qaId ?
            <AssociateAiComp item={renderData ?? selectedQaItem}
                             showEditButton={false}
                             width={'w-full'}
                             className={'border border-gray-200 rounded-md border-solid'}
                             isShowRemoveBtn={true}
                             openRemoveQa={openRemoveQa}
                             setOpenRemoveQa={setOpenRemoveQa}
                             handleRemove={() => handleRemoveQaData()}

            /> : null
        }
      </div>
      {
        !noCharacterPrompt &&
        <div className={'pt-3'}>
          <CssTextField
            maxRows={5}
            placeholder={'characterPrompt1'}
            inputRef={inputRefs.characterPrompt1}
            size={'small'}
            fullWidth={true}
            multiline={true}
            sx={{bgcolor: '#F7D668'}}
            value={block?.data?.characterPrompt1}
            onChange={(e) => handleChangeCharPrompt(e, 'characterPrompt1')}
            onFocus={() => handleFocus('characterPrompt1')}
          />
        </div>
      }
      <div className={'pt-3'}>
        <CssTextField
          maxRows={5}
          placeholder={'Invisible Prompt'}
          inputRef={inputRefs.adminPrompt1}
          size={'small'}
          fullWidth={true}
          multiline={true}
          sx={{bgcolor: '#CEE3C0'}}
          value={block?.data?.adminPrompt1}
          onChange={(e) => handleChangeCharPrompt(e, 'adminPrompt1')}
          onFocus={() => handleFocus('adminPrompt1')}
          error={chapterError.chatGPT && !block?.data?.userInput && !block?.data?.adminPrompt2 && !block?.data?.adminPrompt1}
        />
      </div>
      <div className={'pt-3'}>
        <CssTextField
          maxRows={5}
          inputRef={inputRefs.userInput}
          size={'small'}
          fullWidth={true}
          multiline={true}
          placeholder={`${[PROMPT, PROMPT_WITHOUT_CHAR]?.includes(block?.type) ? '入力欄' : 'ユーザー入力欄'}`}
          // defaultValue={block?.data?.userInput}
          value={block?.data?.userInput}
          onChange={(e) => handleChangeCharPrompt(e, 'userInput')}
          onFocus={() => {
            handleFocus('userInput')
            setSaveButtonProps((prev) => ({...prev, inputRef: inputRefs.userInput}))
          }}
          error={chapterError.chatGPT && !block?.data?.userInput && !block?.data?.adminPrompt2 && !block?.data?.adminPrompt1}
        />
      </div>
      <div className={'py-3'}>
        <CssTextField
          maxRows={5}
          // key={block?.data?.adminPrompt2 + block.id + 'adminPrompt2'}
          placeholder={'Invisible Prompt'}
          inputRef={inputRefs.adminPrompt2}
          size={'small'}
          fullWidth={true}
          multiline={true}
          sx={{bgcolor: '#CEE3C0'}}
          value={block?.data?.adminPrompt2}
          onChange={(e) => handleChangeCharPrompt(e, 'adminPrompt2')}
          onFocus={() => handleFocus('adminPrompt2')}
          error={chapterError.chatGPT && !block?.data?.userInput && !block?.data?.adminPrompt2 && !block?.data?.adminPrompt1}
        />
      </div>
      {
        !noCharacterPrompt &&
        <div className={'pb-5'}>
          <CssTextField
            maxRows={5}
            placeholder={'characterPrompt2'}
            inputRef={inputRefs.characterPrompt2}
            size={'small'}
            fullWidth={true}
            multiline={true}
            sx={{bgcolor: '#F7D668'}}
            value={block?.data?.characterPrompt2}
            onChange={(e) => handleChangeCharPrompt(e, 'characterPrompt2')}
            onFocus={() => handleFocus('characterPrompt2')}
          />
        </div>
      }
      <div>
        <Dropdown dataSelect={!isEnecolorRankText ? dataSelect : dataSelectRank}
                  value={output_type}
                  className={'mb-4'}
                  onChange={(event) => handleChangeOutputType(event)}
                  renderValue={0}
                  label={'種別'}
                  isInPutLabel={true}/>
      </div>

      {
        resultUserInputs?.length > 0 && (
          <div className={'flex flex-col gap-2'}>
            {
              resultUserInputs?.map((value, idx) => {
                const groupsStruct = block?.data?.groupsStruct ?? []
                return (
                  output_type === 'text' ?
                    <div key={idx} className={'grid grid-cols-12 gap2 items-center'}>
                      <div className={'col-span-1 truncate pr-1'}>
                        {value}
                      </div>
                      <div className={'col-span-11'}>
                        <Dropdown dataSelect={dataStructIds}
                                  value={groupsStruct ? groupsStruct[idx]?.dataStructId : ''}
                                  className={'flex-1'}
                                  onChange={(event) => handleChangeStructureOutPut(event, idx)}
                                  renderValue={0}
                                  isInPutLabel={true}/>
                      </div>
                    </div> : null
                )
              })
            }

            {
              resultUserInputs?.map((value, idx) => {
                const isRank = output_type === 'enecolor_4_rank' || output_type === 'enecolor_16_rank'
                const groupsText = block?.data?.groupsText ?? []
                return (
                  <div key={idx}>
                    {
                      isShowUserInputLabel && output_type === "enecolor_4_rank" &&
                      <div>
                        {`${value}の内容`}
                        <Dropdown dataSelect={rankData(output_type)}
                                  isInPutLabel={true}
                                  label={isRank ? '順位' : 'カラー'}
                                  value={groupsText && (is4ColorValue(groupsText[idx]?.rank) ? groupsText[idx]?.rank : 1)}
                                  maxWidth={100}
                                  onChange={(event) => handleChangeRank(event, idx)}
                                  className={'my-3 mr-5'}
                        />
                      </div>
                    }
                    {
                      isShowUserInputLabel && output_type === "enecolor_16_rank" &&
                      <div>
                        {`${value}の内容`}
                        <Dropdown dataSelect={rankData(output_type)}
                                  isInPutLabel={true}
                                  label={isRank ? '順位' : 'カラー'}
                                  value={groupsText && (is16ColorValue(groupsText[idx]?.rank) ? groupsText[idx]?.rank : 1)}
                                  maxWidth={100}
                                  onChange={(event) => handleChangeRank(event, idx)}
                                  className={'my-3'}
                        />
                      </div>
                    }
                    {
                      isShowUserInputLabel && output_type === "enecolor_4" &&
                      <div>
                        {`${value}の内容`}
                        <Dropdown dataSelect={rankData(output_type)}
                                  isInPutLabel={true}
                                  label={isRank ? '順位' : 'カラー'}
                                  value={groupsText && (is4RankValue(groupsText[idx]?.color) ? groupsText[idx]?.color : "Y")}
                                  maxWidth={100}
                                  onChange={(event) => handleChangeColor(event, idx)}
                                  className={'my-3 mr-5'}
                        />
                      </div>
                    }
                    {
                      isShowUserInputLabel && output_type === "enecolor_16" &&
                      <div>
                        {`${value}の内容`}
                        <Dropdown dataSelect={rankData(output_type)}
                                  isInPutLabel={true}
                                  label={isRank ? '順位' : 'カラー'}
                                  value={groupsText && (is16RankValue(groupsText[idx]?.color) ? groupsText[idx]?.color : "YCS")}
                                  maxWidth={100}
                                  onChange={(event) => handleChangeColor(event, idx)}
                                  className={'my-3 mr-5'}
                        />
                      </div>
                    }
                    <div className="max-w-[100px]"></div>
                    {
                      <div
                        className={`grid gap-y-2 gap-x-4 ${output_type === 'enecolor_16' ? `grid-rows-8 grid-flow-col` : `grid-cols-${colInput}`} pr-5 pb-2`}>
                        {
                          enecolorForms?.map((group, groupIndex) => {
                            return (
                              <TextBlocksCustom item={block} idx={idx} groupIndex={groupIndex}
                                                group={group}
                                                colInput={colInput} output_type={output_type}
                                                key={groupIndex}
                                                handleGroupTextChange={handleGroupTextChange}/>
                            )
                          })
                        }
                      </div>
                    }
                  </div>
                )
              })
            }
          </div>
        )
      }
      {resultUserInputs?.length > 0 && output_type !== 'text' &&
        <EnecolorSettingName text={textSettingName} setText={setTextSettingName} saveSetting={saveSetting}
                             setOpenNameDialog={setOpenNameDialog}
                             openNameDialog={openNameDialog}/>
      }
    </CardCustom>
  );
}

export default React.memo(Prompt);
