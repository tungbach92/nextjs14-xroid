import {CircularProgress, Divider, Tab, Tabs} from "@mui/material";
import {imageUri} from "@/app/components/assets";
import {BaseModal, BaseModalProps} from "@/app/components/base";
import React, {SetStateAction, useEffect, useMemo, useState} from "react";
import {Character, Voice} from "@/app/types/types";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import {
  createCharacterVoice,
  getCharacterVoiceDefault,
  updateCharacterVoice
} from "@/app/common/commonApis/characterVoiceSetting";
import {toast} from "react-toastify";
import PlayVoiceButton from "@/app/components/custom/chapter/PlayVoiceButton";
import {toNumber} from "lodash";
import {MOTION, OptionSpeaker} from "@/app/configs/constants";
import {handleLayer} from "@/app/common/selectButtonColor";
import Button from "@mui/material/Button";
import RenderInputSlider from "@/app/components/Mentaloids/modal/RenderInputSlider";
import {useAtom} from "jotai";
import {disableSoundAtom} from "@/app/store/atom/disableSound.atom";
import {twMerge} from "tailwind-merge";
import {useMutation, useQueryClient} from "@tanstack/react-query";


interface VoiceModalProps extends BaseModalProps {
  modalTitle?: string;
  selectedChar?: Character;
  setSelectedChar?: React.Dispatch<SetStateAction<Character>>;
  handleClose?: () => void;
  setVoices?: React.Dispatch<React.SetStateAction<any[]>>;
  updateVoice?: boolean,
  voice?: Voice,
}

interface AudioInputVoiceProps {
  labelTitle?: string;
  placeholder?: string;
  value?: string;
  setValue?: React.Dispatch<SetStateAction<string>>;
}

interface Props {
  Header: React.FC<AudioHeaderProps>;
  Input: React.FC<AudioInputVoiceProps>;
  Setting: React.FC<AudioSettingProps>;
}

interface AudioSettingProps extends VoiceModalProps, AudioHeaderProps {
  isError?: boolean;
  isReadSpeaker?: boolean;
}

interface AudioHeaderProps extends VoiceModalProps {
  tabValue: string;
  setTabValue: (value: string) => void;
}

export const AudioModal: React.FC<VoiceModalProps> & Props = ({
  isOpen,
  updateVoice,
  handleClose,
  modalTitle,
  selectedChar,
  setSelectedChar,
  voice,
}) => {
  const [tabValue, setTabValue] = useState<string>("readSpeaker");
  return (
    <BaseModal
      isOpen={isOpen}
      handleClose={() => {
        handleClose();
        setTabValue("readSpeaker");
      }}
      className="flex flex-col gap-3 laptop:flex-none laptop:gap-0 bg-white rounded-xl shadow-xl laptop:w-[650px] p-5 laptop:p-0"
      header={
        <AudioModal.Header
          modalTitle={"音声合成システム"}
          tabValue={tabValue}
          setTabValue={setTabValue}
        />
      }
    >
      <AudioModal.Setting
        updateVoice={updateVoice}
        voice={voice}
        tabValue={tabValue}
        setTabValue={setTabValue}
        selectedChar={selectedChar}
        setSelectedChar={setSelectedChar}
        handleClose={handleClose}
      />
    </BaseModal>
  );
};

AudioModal.Header = function Header({modalTitle, tabValue, setTabValue}) {
  return (
    <div className="w-full relative">
      <div className={`flex items-center pt-4 justify-center`}>
        <h2 className="absolute left-2 ">{modalTitle}</h2>
        <Tabs
          value={tabValue}
          onChange={(event: any, newValue: any) => {
            setTabValue(newValue);
          }}
          aria-label="voice_tab"
          variant={"scrollable"}
        >
          <Tab
            className={`laptop:mr-12 m-auto`}
            value={"readSpeaker"}
            label={<img src={imageUri.iconImg.iconReadSpeaher} alt="" className={`laptop:w-[120px] w-[100px]`}/>}
          />
        </Tabs>
      </div>
      <Divider/>
    </div>
  );
};

AudioModal.Setting = function Setting({
  tabValue,
  selectedChar,
  handleClose,
  updateVoice,
  voice,
}: AudioSettingProps) {
  const [defaultVoice, setDefaultVoice] = useState<Voice>(null)
  const [loadingDefaultVoice, setLoadingDefaultVoice] = useState<boolean>(false)

  useEffect(() => {
    if (!selectedChar?.id) return;
    const getDefaultVoice = async () => {
      setLoadingDefaultVoice(true)
      try {
        const res = await getCharacterVoiceDefault(selectedChar?.id)
        setDefaultVoice(res)
      } catch (e) {
        console.log(e)
      } finally {
        setLoadingDefaultVoice(false)
      }
    }
    getDefaultVoice().then()
  }, [selectedChar?.id])
  const [characterVoice, setCharacterVoice] = useState<Voice>({
    emotion: '',
    voiceName: '',
    displayName: '',
    key: '',
    volume: 100,
    speed: 100,
    pitch: 100,
    txtText: '',
    source: '',
    emotion_level: 2
  })
  const [audio, setAudio] = useState(new Audio())
  const [disableSound] = useAtom(disableSoundAtom)
  const queryClient = useQueryClient()

  const {mutate: updateCharVoice, isPending: isPendingUpdate} = useMutation(
    {
      mutationFn: async (newVoice: Voice) => await updateCharacterVoice(selectedChar?.id, newVoice),
      onSuccess: () => {
        handleClose()
        toast.success('音声合成を更新しました。')
        queryClient.invalidateQueries({
          queryKey: ['voices', selectedChar?.id]
        })
      },
      onError: (e) => {
        toast.error('音声合成が更新できませんでした。')
        console.log(e)
      },
    }
  )

  const {mutate: createCharVoice, isPending: isPendingCreate} = useMutation(
    {
      mutationFn: async (newVoice: Voice) => await createCharacterVoice(selectedChar?.id, newVoice),
      onSuccess: () => {
        handleClose()
        toast.success('音声合成を設定しました。')
        queryClient.invalidateQueries({
          queryKey: ['voices', selectedChar?.id]
        })
      },
      onError: (e) => {
        toast.error('音声合成を設定できませんでした。')
        console.log(e)
      },
    }
  )

  useEffect(() => {
    setCharacterVoice({
      emotion: voice?.emotion ?? 'normal',
      voiceName: voice ? voice.voiceName : defaultVoice && !loadingDefaultVoice ? defaultVoice?.voiceName : 'Mayu',
      displayName: voice?.displayName ?? '',
      key: voice?.key ?? '',
      volume: voice?.volume ?? 100,
      speed: voice?.speed ?? 100,
      pitch: voice?.pitch ?? 100,
      txtText: voice?.txtText ?? '',
      source: tabValue ?? 'readSpeaker',
      emotion_level: voice?.emotion_level ?? 2
    })
  }, [voice, tabValue, defaultVoice, loadingDefaultVoice])

  const handleChangeCharacterVoice = (type: string, value: string) => {
    setCharacterVoice({
      ...characterVoice,
      [type]: value,
    });
  };

  const handleChangeVoice = (event: SelectChangeEvent) => {
    if (event.target.value !== 'Mayu' && characterVoice.emotion_level > 2) {
      setCharacterVoice({
        ...characterVoice,
        voiceName: event.target.value as string,
        emotion_level: 2
      })
    } else {
      setCharacterVoice({
        ...characterVoice,
        voiceName: event.target.value as string,
      })
    }
  };


  const handleChangeEmotionLevel = (event: SelectChangeEvent, type) => {
    setCharacterVoice({
      ...characterVoice,
      [type]: toNumber(event.target.value),
    });
  };

  const handleAdjustVoice = (event: SelectChangeEvent, type: string) => {
    setCharacterVoice({
      ...characterVoice,
      [type]: Number(event.target.value),
    });
  };
  const handleClickAdjust = (type: string, isPlus: boolean, min: number, max: number) => {
    let value = characterVoice[type];
    if (value === max && isPlus) return
    if (value === min && !isPlus) return
    setCharacterVoice({
      ...characterVoice,
      [type]: isPlus ? characterVoice[type] + 1 : characterVoice[type] - 1,
    });
  };
  const handleCreate = async () => {
    if (selectedChar?.id?.includes('uRoidTemp_')) return
    createCharVoice({
      ...characterVoice,
      emotion_level: characterVoice.emotion_level,
    })
  }
  const handleUpdateVoice = async () => {
    if (characterVoice.voiceName !== 'Mayu' && characterVoice.emotion === 'whisper') {
      toast.error('Emotionを選択できます。')
      return
    }
    if (selectedChar?.id?.includes('uRoidTemp_')) return
    updateCharVoice({
      ...characterVoice,
      id: voice.id,
    })
  };

  const checkIsNormal = useMemo(() => {
    if (characterVoice?.emotion === 'normal' || characterVoice.voiceName === 'Tsuna') return true
  }, [characterVoice?.voiceName, characterVoice?.emotion])

  const [slideAction, setSlideAction] = useState(MOTION);

  const handleChangeEmotion = (emotion: string) => {
    handleLayer(emotion, slideAction, setSlideAction)
    setCharacterVoice({
      ...characterVoice,
      emotion: emotion,
    });
  };
  return (
    <div className={'text-black w-full'}>
      <div className="laptop:px-12 flex flex-col space-y-2 h-[550px]">
        <h2 className="text-center m-3">基本の声の設定</h2>
        <div
          className="flex flex-wrap flex-col justify-center items-center laptop:items-start laptop:space-y-4 laptop:justify-around laptop:space-x-10 laptop:flex-row">
          <img src={selectedChar?.avatar} className="w-[50px] object-cover rounded-full laptop:w-[100px] laptop:mt-6"
               alt="avatar"/>
          <div className="flex flex-col space-y-3 flex-1">
            <input
              className="bg-gray-200 h-10 text-[16px] text-black focus:outline-none border-none  text-center rounded-lg"
              value={characterVoice.displayName}
              onChange={(e) => handleChangeCharacterVoice('displayName', e.target.value)}
              placeholder={"名前を入力してください。"}
            />
            <FormControl size="small">
              <div className="w-full flex justify-between items-center">
                <span className="w-[38%] pl-2.5">音声合成名</span>
                {loadingDefaultVoice ? <CircularProgress size={20} className={'mx-auto'}/> :
                  <Select
                    className="bg-gray-200 w-[62%] rounded-lg outline-0"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={characterVoice.voiceName}
                    onChange={handleChangeVoice}
                  >
                    {
                      OptionSpeaker?.map((option, index: number) => {
                        return (
                          <MenuItem key={option.value + index} value={option.value}>
                            {option.label}
                          </MenuItem>
                        );
                      })
                    }
                  </Select>
                }
              </div>
            </FormControl>
            {
              characterVoice.voiceName !== 'noVoice' &&
              <div className="w-full gap-2 flex justify-between items-center">
                {!['Tsuna', 'Show-DNN'].includes(characterVoice?.voiceName) &&
                  slideAction?.map((s) => {
                    if (characterVoice.voiceName !== 'Mayu' && s.value === 'whisper') return null
                    return (
                      <Button
                        variant="text"
                        className={"text-black"}
                        sx={{borderRadius: '5px', border: '1px solid #9B9B9B'}}
                        style={{backgroundColor: `${characterVoice.emotion === s.value ? '#F5BA15' : ''}`}}
                        onClick={() => handleChangeEmotion(s.value)}
                        key={s.value}
                      >
                        <div className={'mx-3'}>
                          {s.text}
                        </div>
                      </Button>
                    );
                  })}
              </div>
            }


            {
              (!checkIsNormal || characterVoice.voiceName !== 'noVoice') &&
              <div className="w-full">
                <RenderInputSlider label={"感情レベル"}
                                   handleClickAdjust={handleClickAdjust}
                                   stateValue={characterVoice.emotion_level} type={"emotion_level"}
                                   handleChange={(e) => handleChangeEmotionLevel(e, 'emotion_level')}
                                   min={1} max={characterVoice?.voiceName === 'Mayu' ? 4 : 2}/>
              </div>
            }
            {
              characterVoice.voiceName !== 'noVoice' &&
              <div className="flex items-center border-none rounded-lg px-4 space-x-10 bg-gray-200">
                <input
                  placeholder="テスト文章"
                  className="bg-gray-200  flex-1 text-black laptop:py-7 py-3 justify-start  focus:outline-none  border-none rounded-lg"
                  value={characterVoice.txtText}
                  onChange={(e) => handleChangeCharacterVoice('txtText', e.target.value)}
                />
                <PlayVoiceButton text={characterVoice.txtText}
                                 pitch={characterVoice.pitch}
                                 volume={characterVoice.volume}
                                 speed={characterVoice.speed}
                                 voiceName={characterVoice?.voiceName}
                                 emotion={checkIsNormal ? '' : characterVoice?.emotion}
                                 emotion_level={checkIsNormal ? 2 : characterVoice?.emotion_level}
                                 audio={audio}
                                 setAudio={setAudio}
                                 disabled={disableSound}
                />
              </div>
            }
            {
              characterVoice.voiceName !== 'noVoice' &&
              <FormControl size="small">
                <RenderInputSlider label={"高さ:"}
                                   handleClickAdjust={handleClickAdjust}
                                   stateValue={characterVoice.pitch} type={"pitch"}
                                   handleChange={(e) => handleAdjustVoice(e, "pitch")} min={1} max={200}/>
                <RenderInputSlider label={"大きさ:"}
                                   handleClickAdjust={handleClickAdjust}
                                   stateValue={characterVoice.volume} type={"volume"}
                                   handleChange={(e) => handleAdjustVoice(e, "volume")} min={1} max={200}/>
                <RenderInputSlider label={"速さ:"}
                                   handleClickAdjust={handleClickAdjust}
                                   stateValue={characterVoice.speed} type={"speed"}
                                   handleChange={(e) => handleAdjustVoice(e, "speed")} min={1} max={200}/>

              </FormControl>
            }
          </div>
        </div>
      </div>
      <div className="flex justify-center laptop:my-6">
        <Button
          className={twMerge(`my-5 rounded-sm bg-blue-600 text-white laptop:aspect-auto laptop:min-w-[182px] disabled:bg-gray-400`)}
          onClick={updateVoice ? handleUpdateVoice : handleCreate}
          disabled={isPendingUpdate || isPendingCreate}
        >保存</Button>
      </div>
    </div>
  );
};

AudioModal.Input = function Input({labelTitle, value, setValue, placeholder}) {
  return (
    <div className="flex justify-end laptop:space-x-10 flex-col laptop:flex-row items-center">
      <div className="text-sm py-0">{labelTitle}</div>
      <input
        className="bg-gray-200 w-52 h-10 text-[16px] focus:outline-none border-none  text-center rounded-lg"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};
