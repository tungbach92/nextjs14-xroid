import React, {useMemo} from 'react';
import BubbleVoice from "@/app/components/custom/chapter/BubbleVoice";
import CharacterSettingComponent from "@/app/components/custom/chapter/CharacterSettingComponent";
import {CharacterBlock} from "@/app/types/types";
import {useMotionPose} from "@/app/hooks/useMotionPose";
import {useVoices} from "@/app/hooks/useVoices";
import {iconImg} from "@/app/components/assets/image/icon";
import {AllBlockType} from "@/app/types/block";
import useDefaultVoice from "@/app/hooks/useDefaultVoice";

type props = {
  handleClickMotion?: (id: string) => void,
  handleClickBubble?: (id: string) => void
  handleClickAvatar?: (id: string) => void
  char?: CharacterBlock
  block: AllBlockType
  selectedVoiceId?: string
  setSelectedVoiceId?: React.Dispatch<React.SetStateAction<string>>
}

function MotionAndVoiceComponent({
  char,
  handleClickMotion,
  handleClickBubble,
  handleClickAvatar,
  block,
  selectedVoiceId,
  setSelectedVoiceId
}: props) {
  const {poses, motions, loading} = useMotionPose(char?.id)
  const {voices, loadingVoice} = useVoices(char?.id)
  const motion = useMemo(() => motions?.find(item => item.id === char?.motionId), [motions, char?.motionId])
  const pose = useMemo(() => poses?.find(item => item.id === char?.motionId), [poses, char?.motionId])
  const voice = useMemo(() => voices?.find(item => item.id === char?.voiceId), [voices, char?.voiceId])
  // const [defaultVoice, setDefaultVoice] = useState<Voice>(null)
  const {defaultVoice} = useDefaultVoice(char?.id)
  const voiceDisplayName = useMemo(() => {
    if (voice)
      return voice?.displayName
    else
      return defaultVoice?.displayName
  }, [voice?.displayName, defaultVoice?.displayName])

  // not working
  // useEffect(() => {
  //   if (!selectedVoiceId) {
  //     setSelectedVoiceId(defaultVoice?.id)
  //   }
  // }, [defaultVoice?.id, voices])

  const motionUrl = useMemo(() => {
    if (motion) {
      return motion.url
    }
    if (pose) {
      return pose.url
    }
    return ''
  }, [motion, pose])

  const motionName = useMemo(() => {
    if (motion) {
      if (!motion?.isDefault) return motion.name
      return 'デフォルト'
    }
    if (pose) {
      if (!pose?.isDefault) return pose.name
      return 'デフォルト'
    }
    return ''
  }, [motion, pose])

  return (
    <div className={'gap-1 w-[150px] 2xl:min-w-[164px] min-h-[188px] max-w-[150px] 2xl:max-w-[164px]'}>
      <div
        className={`bg-[#F5F7FB] border-x-[1px] border-y-[1px] border-solid h-full border-[#3AD1FF] justify-items-center p-2`}>
        <div className={'flex flex-col h-full'}>
          <div className={` w-full flex ${char?.position === 'right' ? 'grid justify-items-end' : ''}`}>
            <div
              className={`flex items-center gap-2 my-2 ${char?.position === 'left' ? '' : char?.position === 'center' ? 'm-auto' : ''}`}>
              <CharacterSettingComponent src={char?.avatar}
                                         isVolume={char?.isVoice}
                                         checked={char?.isVoice}
                                         isCheckbox={false}
                                         onlyAvatar={false}
                                         width={50}
                                         height={50}
                                         onClickAvatar={() => handleClickAvatar(char.id)}
                                         borderColor={char?.isVoice ? '#1976d2' : '#9B9B9B'}
              />
            </div>
          </div>
          <div className={'flex cursor-pointer flex-1 max-h-[130px] 2xl:max-h-[150px]'}>
            {!loading &&
              <div className={'flex flex-col justify-center items-center'} onClick={() => handleClickMotion(char.id)}>
                <img src={motionUrl || iconImg.noImageIcon}
                     className={'max-w-[64px] 2xl:max-w-[74px] h-20 overflow-hidden'}
                     alt={'avatar'}/>
                <span className={'text-xs pt-1'}>{motionName || '登場'}</span>
              </div>
            }
            {
              !char?.id.includes('uRoidTemp_') && block?.characters.find(c => c.id === char.id && c.isVoice) &&
              <BubbleVoice voice={voiceDisplayName}
                           onClick={() => handleClickBubble(char.id)}/>
            }
          </div>
        </div>
      </div>
    </div>

  )
    ;
}

export default MotionAndVoiceComponent;

