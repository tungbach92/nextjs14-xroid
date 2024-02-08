import React, {useEffect, useMemo, useState} from 'react';
import CharacterSettingComponent from "@/app/components/custom/chapter/CharacterSettingComponent";
import {Chapter, Character, CharacterBlock} from "@/app/types/types";
import {Checkbox, FormControlLabel, IconButton} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Modal from "@/app/components/custom/Modal";
import {Content} from "@/app/types/content";
import {cloneDeep} from "lodash";
import {selectCharLogic} from "@/app/common/selectCharLogic";
import {AllBlockType} from "@/app/types/block";
import {DEFAULT_POS} from "@/app/configs/constants";
import validator from "validator";
import equals = validator.equals;

type Props = {
  selectedCharacters: Character[],
  innerWidth: number
  characters: Character[]
  chapter: Chapter
  setChapter: React.Dispatch<React.SetStateAction<Chapter>>
  content: Content,
  blocks: AllBlockType[],
  setBlocks: React.Dispatch<React.SetStateAction<any>>,
  setSelectedCharacters: React.Dispatch<React.SetStateAction<Character[]>>
  chapterId: string
}

function MRoidAndUroidComp({
                             chapterId, blocks, setBlocks,
                             setSelectedCharacters,
                             selectedCharacters,
                             innerWidth,
                             characters,
                             chapter,
                             setChapter,
                             content
                           }: Props) {
  const [open, setOpen] = useState(false);
  const [allChars, setAllChars] = useState<Character[]>([])
  const [draftChars, setDraftChars] = useState<Character[]>([])
  const [draftSelectedChars, setDraftSelectedChars] = useState<Character[]>([])
  const [openType, setOpenType] = useState<string>('')
  const jsonDraftChars = JSON.stringify(draftChars)
  const jsonAllChars = JSON.stringify(allChars)
  const [removeChar, setRemoveChar] = useState<string[]>([])
  const [draftBlocks, setDraftBlocks] = useState<AllBlockType[]>([])

  useEffect(() => {
    setAllChars(characters?.map(item => {
      return {
        ...item,
        isChecked: `${Boolean(chapterId !== 'createChapter')}` ? chapter?.mentoroids?.includes(item?.id) : content?.mentoroids?.includes(item?.id)
      }
    }))
  }, [characters, content?.mentoroids, chapter?.mentoroids, chapterId])

  useEffect(() => {
    if (!chapter?.id) {
      setChapter({...chapter, mentoroids: selectedCharacters?.map(item => item.id)})
    }
  }, [selectedCharacters])

  const onSubmit = () => {
    const newChapter = {...chapter}
    setChapter({...newChapter, mentoroids: allChars?.filter(item => item.isChecked).map(item => item.id)})
    const newChars = allChars?.filter(item => item.isChecked)
    const selectedCharactersIds = selectedCharacters?.map(item => item.id)
    const _selectedCharacters = [...selectedCharacters, ...newChars?.filter(item => !selectedCharactersIds.includes(item.id))]
    const contentChars = _selectedCharacters?.filter(item => content?.mentoroids?.includes(item.id))
    const chapterChars = _selectedCharacters?.filter(item => !content?.mentoroids?.includes(item.id))
    const _newChars = contentChars.concat(chapterChars)
    setSelectedCharacters(_newChars)

    const _blocks = cloneDeep(blocks)
    const removedCharBlocks = draftBlocks?.filter(item => item?.characters?.find(item2 => removeChar.includes(item2.id) && item2?.isVoice))
    const removedCharBlocksIds = removedCharBlocks?.map(item => item.id)
    _blocks?.forEach((block) => {
      if (removedCharBlocksIds?.includes(block.id)) {
        block.characters[0].isVoice = true
      }
      const _newChars = selectedCharacters?.map(s => {
        const isAction = block?.characters?.find(item => item.id === s.id)?.isAction
        const isVoice = block?.characters?.find(item => item.id === s.id)?.isVoice
        return {
          id: s.id,
          avatar: s.avatar,
          isAction: isAction,
          isShow: s.isShow,
          isVoice: block?.type === 'control' ? false : isVoice,
          position: s.position || DEFAULT_POS,
          voiceId: s.defaultVoice ?? '',
          motionId: s.defaultMotion ?? '',
          characterPrompt1: s.characterPrompt1 ?? '',
          characterPrompt2: s.characterPrompt2 ?? '',
          isChecked: !!s.isChecked,
          isURoidTemplate: s.isURoidTemplate
        }
      })
      block.characters = [..._newChars]
      block?.characters?.forEach((char: CharacterBlock) => {
        const findVoice = block?.characters.find(item => item?.isVoice)
        if (!Boolean(findVoice)) {
          block?.characters?.forEach((char: CharacterBlock) => {
              char.isVoice = false
            }
          )
        }
      })
    })

    setBlocks(_blocks)
    setOpen(false)
    setOpenType('')
    setRemoveChar([])
  }
  const handleRemoveChar = (char: Character) => {
    setSelectedCharacters(selectedCharacters?.filter(item => item.id !== char.id))
    setAllChars(allChars?.map(item => {
      if (item.id === char.id) {
        item.isChecked = false
      }
      return item
    }))
    setChapter({...chapter, mentoroids: chapter?.mentoroids?.filter(item => item !== char.id)})
    const _blocks = cloneDeep(blocks)
    _blocks?.forEach((block) => {
        block.characters = block?.characters?.filter(item => item.id !== char.id)
        const findVoice = block?.characters.find(item => item?.isVoice)
        if (!Boolean(findVoice)) {
          const findFirstShowedChar = block?.characters.find(item => item?.isShow)
          if (findFirstShowedChar) {
            findFirstShowedChar.isVoice = true
          }
        }
        setBlocks(_blocks)
      }
    )
  }
  const handleChange = (e: any, id: string) => {
    const newChars = cloneDeep(allChars)
    const index = newChars.findIndex(item => item.id === e.target.id)
    newChars[index].isChecked = e.target.checked
    const _newChars = newChars.filter(item => item.isChecked ||
      content?.mentoroids.find(c => c === item.id)).map(item => selectedCharacters?.find(item2 => item2.id === item.id) || item)
    const contentChars = _newChars?.filter(item => content?.mentoroids?.includes(item.id))
    const chapterChars = _newChars?.filter(item => !content?.mentoroids?.includes(item.id))
    setSelectedCharacters(contentChars.concat(chapterChars))
    setAllChars(newChars)
    if (!e.target.checked) {
      setRemoveChar([...removeChar, id])
    }
  }
  const handleSelectChar = (char: Character, event: React.ChangeEvent<HTMLInputElement>) => {
    selectCharLogic(char, event, selectedCharacters, blocks, setSelectedCharacters, setBlocks)
  }
  const onClose = () => {
    setAllChars(draftChars)
    setSelectedCharacters(draftSelectedChars)
    setOpen(false)
    setOpenType('')
    setRemoveChar([])
    setDraftBlocks(blocks)
  }
  const _allChars = useMemo(() => {
    if (openType === 'mroid') {
      return allChars?.filter(item => !item?.isURoidTemplate)
    } else {
      return allChars?.filter(item => item?.isURoidTemplate)
    }
  }, [allChars, openType])

  const listChars = useMemo(() => {
    if (openType) return draftSelectedChars
    return selectedCharacters
  }, [selectedCharacters, draftSelectedChars, openType])

  return (
    <div>
      <div className={'flex items-center'}>
        <span className={'font-bold'}>Mroid</span>
        <div className={'w-[1px] h-[50px] bg-[#BDDAFC] mx-[6px]'}/>
        <div
          className={`flex ${innerWidth > 3500 ? 'min-w-full' : 'max-w-[188px]'} overflow-x-auto overflow-y-hidden h-auto gap-2 pr-2`}>
          {
            listChars?.map((char) => {
              if (char?.id?.includes('uRoid')) return null
              return (
                <div key={'header_block_' + char.id} className={'pl-1'}>
                  <CharacterSettingComponent
                    removeCharacter={() => handleRemoveChar(char)}
                    hasDeleteIcon={!content?.mentoroids?.includes(char.id)}
                    src={char.avatar} checked={char.isShow} height={50} width={50}
                    isCheckbox={true} onchange={(e) => handleSelectChar(char, e)}
                  />
                </div>
              )
            })
          }
        </div>
        <IconButton className={'h-[50px] w-[50px] bg-[#C5DCF5] hover:scale-110'}
                    onClick={() => {
                      setDraftSelectedChars(selectedCharacters)
                      setDraftChars(allChars)
                      setOpen(!open)
                      setOpenType('mroid')
                      setDraftBlocks(blocks)
                    }}><AddIcon/></IconButton>
      </div>
      <div>
        {
          chapter?.chapterType !== 'createURoid' &&
          <div className={'flex items-center pt-3 pb-2'}>
            <span className={'font-bold pr-[2px]'}>Uroid</span>
            <div className={'w-[1px] h-[50px] bg-[#BDDAFC] mx-[6px]'}/>
            <div
              className={`flex ${innerWidth > 3500 ? 'min-w-full' : 'max-w-[188px]'} overflow-x-auto overflow-y-hidden h-auto gap-2 pr-2`}>
              {
                listChars?.map((char) => {
                  if (!char?.id.includes('uRoid')) return null
                  return (
                    <div key={'header_block_' + char.id} className={'pl-1'}>
                      <CharacterSettingComponent
                        removeCharacter={() => handleRemoveChar(char)}
                        hasDeleteIcon={!content?.mentoroids?.includes(char.id)}
                        src={char.avatar} checked={char.isShow} height={50} width={50}
                        isCheckbox={true} onchange={(e) => handleSelectChar(char, e)}
                      />
                    </div>
                  )
                })
              }
            </div>
            <IconButton className={'h-[50px] w-[50px] bg-pink-300 hover:scale-110'}
                        onClick={() => {
                          setDraftSelectedChars(selectedCharacters)
                          setDraftChars(allChars)
                          setOpen(!open)
                          setOpenType('uroid')
                          setDraftBlocks(blocks)
                        }}><AddIcon/></IconButton>
          </div>}
        {
          open &&
          <Modal open={open}
                 setOpen={setOpen}
                 btnSubmit={'保存'}
                 actionPosition={'center'}
                 handleClose={() => onClose()}
                 onSubmit={() => onSubmit()}
                 isDisabled={equals(jsonDraftChars, jsonAllChars)}
                 title={'登場可能キャラクターを選択してください。'}>
            <div>
              {
                _allChars?.map((item) => {
                  if (content?.mentoroids?.includes(item.id)) return null
                  return <FormControlLabel
                    key={item.id}
                    className={'w-full flex gap-2 bg-[#F5F7FB] p-2 my-2 rounded-md'}
                    control={
                      <div className={'flex items-center'}>
                        <Checkbox
                          checked={item?.isChecked}
                          onChange={(e) => handleChange(e, item.id)}
                          id={item.id}
                          color="primary"
                        />
                        {
                          item?.isURoidTemplate &&
                          <img src={item?.avatar} alt="avatar" className={'w-10 h-10'}/>
                        }
                      </div>
                    }
                    label={item?.name}
                  />
                })
              }
            </div>
          </Modal>
        }
      </div>

    </div>
  );
}

export default MRoidAndUroidComp;
