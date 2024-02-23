import React, {useEffect, useMemo, useRef, useState} from 'react';
import CardCustom from "@/app/components/custom/CardCustom";
import Dropdown from "@/app/components/custom/Dropdown";
import {rankData} from "@/app/common/rankData";
import {Enecolor16ImageText, Enecolor16Rank, Enecolor4ImageText, Enecolor4Rank} from "@/app/common/colorData";
import {useAtom, useSetAtom} from "jotai";
import {readWriteBlocksAtom} from "@/app/store/atom/blocks.atom";
import {cloneDeep, includes, isArray, isEqual, toNumber} from "lodash";
import {useStructureDataAtom} from "@/app/store/atom/structureData.atom";
import {structureIdInnChapterAtom} from "@/app/store/atom/structureIdsInChapter.atom";
import TextBlocksCustom from "@/app/components/custom/chapter/TextBlocksCustom";
import {Button} from "@mui/material";
import {getId} from "@/app/common/getId";
import InputAdornment from '@mui/material/InputAdornment';
import PlayVoiceButton from "@/app/components/custom/chapter/PlayVoiceButton";
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
import {Character, CharacterBlock, Voice} from "@/app/types/types";
import {getCharacterVoice} from "@/app/common/commonApis/characterVoiceSetting";
import {CssTextField} from "@/app/components/custom/CssTextField";
import {BlockText, SaveSetting} from "@/app/types/block";
import {setIsVoiceCharacter} from "@/app/common/setIsVoiceCharacter";
import {NO_VARIABLE_TEXT} from "@/app/configs/constants";
import {clearChapterErrorAtom} from "@/app/store/atom/chapterError.atom";
import {isBlockNoVoice} from "@/app/common/checkBlockNoVoice";
import useDefaultVoice from "@/app/hooks/useDefaultVoice";
import {saveButtonPropsAtom} from "@/app/components/Header/SaveButton";

type props = {
  onDelete: () => void
  onCopy: () => void
  onClickCharacter?: (char: CharacterBlock) => void
  block: BlockText
  isShowAddButton?: boolean
  handleGetIndex?: () => void
  handleMultiCopy?: (type: string) => void
  audio?: HTMLAudioElement
  setAudio?: React.Dispatch<React.SetStateAction<HTMLAudioElement>>
  disableSound?: boolean
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

function TextTemplate({
  onCopy,
  onDelete,
  block,
  isShowAddButton = false,
  handleGetIndex,
  handleMultiCopy,
  audio,
  setAudio,
  disableSound
}: props) {
  const [isShowUserInputLabel, setIsShowUserInputLabel] = useState(false)
  const [structureDataAtom] = useStructureDataAtom();
  const [ids] = useAtom(structureIdInnChapterAtom)
  const [textSettingName, setTextSettingName] = useState<string>('');
  const [colInput, setColInput] = useState<number>(1);
  const [userInfo] = useAtom<any>(userAtomWithStorage);
  const userId = userInfo?.user_id;
  const inputRef = useRef<HTMLInputElement | null>(null)
  const setSaveButtonProps = useSetAtom(saveButtonPropsAtom);
  const [resultUserInputs, setResultUserInputs] = useState<string[]>([])
  const [counter, setCounter] = useState(0);
  const {eneColorRankTextSettings} = useGetEnecolorRankTextSettings()
  const {textSettings} = useGetTextSetting()
  const characters = block?.characters ?? []
  const selectedChar = characters?.find((c) => c.isVoice)
  const output_type = block?.data?.output_type ?? ''
  const inputValue = block?.data?.message?.japanese ?? ''
  const updateBlocks = useSetAtom(readWriteBlocksAtom)
  const [selectedVoice, setSelectedVoice] = useState<Voice>(null)
  const [openNameDialog, setOpenNameDialog] = useState<boolean>(false)
  const [textVoiceErr, setTextVoiceErr] = useState<boolean>(false)
  const clearChapterErr = useSetAtom(clearChapterErrorAtom)
  const voiceId = useMemo(() => {
    return block?.characters?.find((c) => c.isVoice)?.voiceId
  }, [block?.characters])
  const [dummyOutputText, setDummyOutputText] = useState<string>('')
  const {defaultVoice: characterVoiceDefault} = useDefaultVoice(selectedChar?.id)

  useEffect(() => {
    setDummyOutputText(block?.data?.message?.japanese ?? '')
  }, [block?.data?.message?.japanese])

  useEffect(() => {
    if (!selectedChar?.id || selectedChar?.id?.includes('uRoidTemp_')) return;
    const getSelectedVoice = () => {
      getCharacterVoice(selectedChar?.id, voiceId)
        .then(res =>
          setSelectedVoice(res.data))
        .catch(e => console.log(e))
    }
    getSelectedVoice()
  }, [selectedChar?.id, voiceId])

  useEffect(() => {
    if (!resultUserInputs)
      setCounter(0)
  }, [resultUserInputs]);

  useEffect(() => {
    if (output_type !== 'text') {
      setIsShowUserInputLabel(true)
    }
  }, [output_type])

  useEffect(() => {
    let matches = []
    if (block?.data)
      matches = block.data.message?.japanese ? block.data.message?.japanese.match(/\{[^}]+\}|\｛[^｝]+\｝/g) : block.data.message?.english ? block.data.message?.english.match(/\{[^}]+\}|\｛[^｝]+\｝/g) : []
    setResultUserInputs(matches?.map((match) => {
      if (match === '{name}' || block?.type === NO_VARIABLE_TEXT) return null
      else return match
    }).filter((i) => i !== null))
  }, [])

  const hanldeResultUserInputs = (text) => {
    const matches = text.match(/\{[^}]+\}|\｛[^｝]+\｝/g);
    const result = matches?.map((match) => {
      if (match === '{name}' || block?.type === NO_VARIABLE_TEXT) return null
      else return match
    }).filter((item) => item !== null)
    setResultUserInputs(result)
  }

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
      toast.error("エネカラーテキスト設定が追加できませんでした。\n" + e.message, {autoClose: 3000});
    } finally {
      // setTextSettingName('')
    }
  }

  const addSpecialText = (type: string) => {
    if (type === 'number') {
      setCounter(counter + 1);
    }
    const inputElement = inputRef.current;

    if (inputElement) {
      let {selectionStart, selectionEnd} = inputElement;
      const currentValue = inputElement.value;
      if (type === 'number') {
        inputElement.value = `${currentValue.slice(0, selectionStart)}{${counter}}${currentValue.slice(selectionEnd)}`;
      }
      if (type === 'name') {
        inputElement.value = `${currentValue.slice(0, selectionStart)}{name}${currentValue.slice(selectionEnd)}`;
      }
      inputElement.focus();
      const _block = cloneDeep(block)
      _block.data.message.japanese = inputElement.value
      updateBlocks(_block)
      setDummyOutputText(inputElement.value)
      hanldeResultUserInputs(inputElement.value)
    }
  }
  useEffect(() => {
    const handleScroll = () => {
      inputRef.current?.blur()
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleChangeCharacter = (charId: string) => {
    setIsVoiceCharacter({updateBlocks, block, charId})
  }

  const handleChangeOutPutText = (e) => {
    const _block = cloneDeep(block)
    _block.data.message.japanese = e.target.value
    _block.data.message.english = e.target.value
    updateBlocks(_block)
    setDummyOutputText(e.target.value)
  }

  const handleGroupTextChange = (e, grtIndex, grIndex) => {
    const _block = cloneDeep(block)
    _block.data.groupsText[grtIndex].groups[grIndex] = e.target.value
    updateBlocks(_block)
  }

  const handleChangeDelay = (e) => {
    const _block = cloneDeep(block)
    _block.delayTime = toNumber(e.target.value)
    updateBlocks(_block)
  }

  return (
    //TODO: need seperate TextCard ImageCard ...
    <CardCustom isCopy={true}
                isDelay={isBlockNoVoice(block, characterVoiceDefault?.voiceName)}
                delayValue={block?.delayTime}
                handleChangeDelay={handleChangeDelay}
                onCopy={onCopy}
                block={block}
                isShowAddButton={isShowAddButton}
                handleMultiCopy={handleMultiCopy}
                handleGetIndex={handleGetIndex}
                onDelete={onDelete}
                title={block?.type === 'text' ? 'Variable Text' : block?.type === 'enecolor_rank_text' ? 'Enecolor' : 'Text'}
                color={block?.type === 'enecolor_rank_text' ? '#FFBFCB' : '#3AD1FF'}
                className={`border-2 border-solid border-[${block?.type === 'enecolor_rank_text' ? '#FFBFCB' : '#3AD1FF'}] w-full min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px]`}
    >
      <div>
        {
          block?.type === 'enecolor_rank_text' &&
          <div className='text-left w-full mt-2 mb-2'>
            <span className={"bg-[#FFBFCB] py-0.5 px-1.5 rounded-sm"}>
              ENECOLOR_RANK_TEXT
            </span>
          </div>
        }
      </div>
      <div className={'flex items-start gap-2'}>
        <div className={'w-[63%] flex gap-2 items-center flex-1'}>
          {
            block?.type !== 'noVariableText' &&
            <Button
              onClick={() => addSpecialText("number")}
              className={'h-8 text-sx min-w-max'}
              size={'small'}
              startIcon={<AddIcon/>}
              variant={'contained'}>変数</Button>
          }

          <Button
            onClick={() => addSpecialText("name")}
            className={'h-8 text-sx min-w-max'}
            size={'small'}
            startIcon={<AddIcon/>}
            variant="contained">ユーザー名</Button>
          <div className={'flex flex-1 pl-3 overflow-x-auto overflow-y-hidden min-h-12 gap-3'}>
            {
              isArray(characters) &&
              characters?.map((c: Character, index) => {
                if (!c.isShow) return null
                return (
                  <div key={c.id + index} className={'cursor-pointer'}>
                    <CharacterSettingComponent src={c.avatar}
                                               checked={c.isVoice}
                                               isVolume={c.isVoice}
                                               isUroid={c?.id.includes('uRoidTemp_')}
                                               width={50} height={50}
                                               onlyAvatar={true}
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

      <div className={'py-4 text-xs flex flex-col'}>
        <CssTextField
          maxRows={5}
          inputRef={inputRef}
          inputProps={{'data-tempid': block?.id}}
          InputLabelProps={{shrink: true}}
          id="outlined-basic"
          label="出力テキスト"
          multiline={true}
          // defaultValue={inputValue}
          value={dummyOutputText}
          onChange={(e) => {
            handleChangeOutPutText(e)
            hanldeResultUserInputs(e.target.value)
            clearChapterErr('text')
          }}
          onFocus={() => setSaveButtonProps((prev) => ({...prev, inputRef}))}
          variant="outlined"
          size={'small'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <PlayVoiceButton text={inputValue}
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
      <div>
        {
          block?.type !== 'noVariableText' &&
          <Dropdown dataSelect={block?.type !== 'enecolor_rank_text' ? dataSelect : dataSelectRank}
                    value={output_type}
                    className={'mb-4'}
                    onChange={(event) => handleChangeOutputType(event)}
            // maxWidth={200}
                    renderValue={0}
                    label={'種別'}
                    isInPutLabel={true}/>
        }
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
                          // maxWidth={170}
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
                              <TextBlocksCustom item={block} idx={idx} groupIndex={groupIndex} group={group}
                                                colInput={colInput} output_type={output_type}
                                                key={groupIndex} handleGroupTextChange={handleGroupTextChange}/>
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

export default React.memo(TextTemplate);
