import CardCustom from "@/app/components/custom/CardCustom";
import CharacterSettingComponent from "@/app/components/custom/chapter/CharacterSettingComponent";
import React, {useMemo} from "react";
import {cloneDeep} from "lodash";
import {useAtom} from "jotai";
import {blocksAtom} from "@/app/store/atom/blocks.atom";
import {configToggleButton1} from "@/app/components/Home/audio-modal/config/config-audio-modal";
import {ToggleButtonBase} from "@/app/components/base";
import {CharacterBlock} from "@/app/types/types";
import mergeCharacters from "@/app/common/mergeCharacters";
import {BlockControl} from "@/app/types/block";
import {toast} from "react-toastify";

interface Props {
  index?: number,
  onDelete: () => void
  onCopy: () => void
  isShowAddButton?: boolean
  handleGetIndex?: () => void
  handleMultiCopy?: (type: string) => void
  block: BlockControl
}

const MAX_CHARS_ACTION = 3

export const ControlTemplate = ({
                                  block,
                                  onCopy,
                                  onDelete,
                                  index,
                                  isShowAddButton = false,
                                  handleGetIndex,
                                  handleMultiCopy,
                                }: Props) => {
  const [blocks, setBlocks] = useAtom(blocksAtom)
  const checkMaxCharsAction = useMemo(() => block.characters?.filter(c => c.isAction).length >= MAX_CHARS_ACTION, [block?.characters])
  const handleChangeCharacter = (char: CharacterBlock) => {
    if (block.characters?.filter(c => c.isAction).length === MAX_CHARS_ACTION && !char.isAction) {
      toast.error(`キャラクターは${MAX_CHARS_ACTION}つまで選択できます。`, {autoClose: 3000})
      return
    }
    let _blocks = cloneDeep(blocks)
    const currChars = cloneDeep(block.characters)
    currChars.forEach((c) => {
      c.isAction = c.id === char.id ? !c.isAction : c.isAction
    })
    _blocks[index].characters = [...currChars]

    for (let i = index + 1; i < _blocks.length; i++) {
      if (_blocks[i].type === 'control') break
      const nextChars = cloneDeep(_blocks[i].characters)
      const newChars = mergeCharacters(nextChars, char)
      _blocks[i].characters = [...newChars]
    }
    setBlocks(_blocks)
  }


  const handleChangePosition = (event: React.MouseEvent<HTMLElement>, position: string, char: CharacterBlock) => {
    if (!position) return

    let _blocks = cloneDeep(blocks)
    const currChars = cloneDeep(block.characters)
    currChars.forEach((c) => {
      c.position = c.id === char.id ? position : c.position
    })
    _blocks[index].characters = [...currChars]

    for (let i = index + 1; i < _blocks.length; i++) {
      if (_blocks[i].type === 'control') break
      const nextChars = cloneDeep(_blocks[i].characters)
      const newChars = mergeCharacters(nextChars, char, position)
      _blocks[i].characters = [...newChars]
    }

    setBlocks(_blocks)
  }
  return (
    <CardCustom isCopy={index !== 0}
                onCopy={onCopy}
                isClose={index !== 0}
                isShowAddButton={isShowAddButton}
                handleMultiCopy={handleMultiCopy}
                handleGetIndex={handleGetIndex}
                onDelete={onDelete} title={'Control'}
                color={'#CAEB00'}
                block={block}
                className={`border-2 border-solid border-[#CAEB00] h-full min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px]`}
    >
      <div className={'mt-3 flex gap-4 overflow-x-auto'}>
        {blocks &&
          blocks[index]?.characters?.map((char, index) => {
            if (!char.isShow) return null
            return (
              <div key={char.id + blocks[index]?.id}
                   className={'flex flex-col gap-2 items-center justify-center'}>
                <div className={'cursor-pointer'}>
                  <CharacterSettingComponent src={char.avatar}
                                             checked={char.isAction}
                                             width={50} height={50}
                                             onClickAvatar={() => handleChangeCharacter(char)}
                                             borderColor={char.isAction ? '#1976d2' : '#9B9B9B'}
                                             onlyAvatar={true}
                                             isUroid={char?.id.includes('uRoidTemp_')}
                                             disableAvatar={checkMaxCharsAction && !char.isAction}
                                             noSelectedCharacter={!char.isAction}
                  />
                </div>
                <div className={'flex justify-end pb-5'}>
                  <ToggleButtonBase
                    configToggleButton={configToggleButton1}
                    alignment={char.position}
                    onChange={(e, position) => handleChangePosition(e, position, char)}
                    className={'text-black font-normal'}
                  />
                </div>
              </div>
            )
          })
        }
      </div>
    </CardCustom>)
}
