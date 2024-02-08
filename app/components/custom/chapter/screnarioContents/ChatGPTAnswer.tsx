import React, {useEffect, useState} from 'react';
import CardCustom from "@/app/components/custom/CardCustom";
import {blocksAtom, readWriteBlocksAtom} from "@/app/store/atom/blocks.atom";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {cloneDeep, isArray, toNumber} from "lodash";
import {CharacterBlock} from "@/app/types/types";
import CharacterSettingComponent from "@/app/components/custom/chapter/CharacterSettingComponent";
import {BlockChatGptAnswer, BlockPromptInput} from "@/app/types/block";
import {useRouter} from "next/navigation";
import {oldBlocksAtom} from "@/app/store/atom/oldBlocks.atom";
import {setIsVoiceCharacter} from "@/app/common/setIsVoiceCharacter";
import {isBlockNoVoice} from "@/app/common/checkBlockNoVoice";
import useDefaultVoice from "@/app/hooks/useDefaultVoice";

type props = {
  onDelete: () => void
  onCopy: () => void
  isShowAddButton?: boolean
  handleGetIndex?: () => void
  handleMultiCopy?: (type: string) => void
  block?: BlockChatGptAnswer,
  index: number,
  title?: string,
}

function ChatGPTAnswer({
                         index,
                         onCopy,
                         onDelete,
                         isShowAddButton,
                         handleMultiCopy,
                         handleGetIndex,
                         block,
                         title,
                       }: props) {
  const [blocks, setBlocks] = useAtom(blocksAtom)
  const [characters, setCharacters] = useState<CharacterBlock[]>([])
  const [oldCharacterId, setOldCharacterId] = useState<string>('')
  const [oldMotionId, setOldMotionId] = useState<string>('')
  const selectedChar = characters?.find((c) => c.isVoice)
  const router = useRouter()
  const updateBlocks = useSetAtom(readWriteBlocksAtom)
  const createChapterId = router?.query?.createChapter
  const oldBlocks = useAtomValue(oldBlocksAtom)
  // const {motions} = useGetDefaultVoice(selectedChar?.id)
  const {defaultVoice} = useDefaultVoice(selectedChar?.id)

  useEffect(() => {
    setOldCharacterId(block?.characters?.find((c) => c.isVoice)?.id)
    setOldMotionId(block?.motionId)
  }, [])

  useEffect(() => {
    setCharacters(block?.characters ?? [])
  }, [block])

  const diff = blocks?.filter(block => oldBlocks?.find((b) => b?.id === block?.id) === undefined)

  const handleChangeCharacter = (charId) => {
    const _blocks = cloneDeep(blocks)
    const _block = _blocks[index] as BlockChatGptAnswer
    let _promptIndex = 0
    let newCharacters: CharacterBlock[] = []
    _block.characters.forEach((c) => {
      newCharacters.push({
        ...c,
        isVoice: c.id === charId,
      })
    })
    if (!_promptIndex) {
      setIsVoiceCharacter({updateBlocks, block, charId})
      return;
    } else {
      const _prompt = _blocks[_promptIndex] as BlockPromptInput
      _blocks[index] = _block
      _block.characters = newCharacters
      if (createChapterId === 'createChapter' || diff?.length && diff?.map((b) => b?.id)?.includes(_prompt?.id)) {
        _prompt.data.characterPrompt1 = newCharacters.find((c) => c.isVoice)?.characterPrompt1
        _prompt.data.characterPrompt2 = newCharacters.find((c) => c.isVoice)?.characterPrompt2
      }
      setBlocks(_blocks)
    }
  }
  //TODO: isShowLog
  const isShowLog = () => {
    return blocks[index - 1]?.type === 'prompt';
  }

  const handleChangeDelay = (e) => {
    const _block = cloneDeep(block)
    _block.delayTime = toNumber(e.target.value)
    updateBlocks(_block)
  }

  return (
    <CardCustom
      isCopy={true}
      isPrompt={true}
      isDelay={isBlockNoVoice(block,defaultVoice?.voiceName)}
      handleChangeDelay={handleChangeDelay}
      delayValue={block?.delayTime}
      isShowLogCheckBox={isShowLog()}
      block={block}
      onCopy={onCopy} onDelete={onDelete}
      title={title} color={'#74AA9C'}
      isShowAddButton={isShowAddButton}
      handleMultiCopy={handleMultiCopy}
      handleGetIndex={handleGetIndex}
      className={'border-2 border-solid border-[#74AA9C] min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px]'}>
      <div className={'flex pl-2 pt-2 gap-3'}>
        {
          isArray(characters) &&
          characters?.map((c: CharacterBlock, index) => {
            if (!c.isShow) return null
            return (
              <div key={c.id + index} className={'cursor-pointer'}>
                <CharacterSettingComponent src={c.avatar}
                                           isUroid={c?.id.includes('uRoidTemp_')}
                                           checked={c.isVoice}
                                           onlyAvatar={true}
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
    </CardCustom>
  );
}

export default ChatGPTAnswer;
