import React from 'react';
import {Avatar, IconButton} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import {avtImg} from "@/app/components/assets/image/avatar";
import ClearIcon from '@mui/icons-material/Clear';


type Props = {
  checked?: boolean,
  src: string,
  onchange?: any
  width?: number
  height?: number
  isCheckbox?: boolean
  onClickAvatar?: any
  borderColor?: string
  isVolume?: boolean
  onlyAvatar?: boolean
  disableAvatar?: boolean
  hasDeleteIcon?: boolean
  removeCharacter?: () => void
  isUroid?: boolean
  noSelectedCharacter?: boolean
}

const selectedColor = '#1976d2'

function CharacterSettingComponent({
                                     src,
                                     onchange,
                                     checked,
                                     width,
                                     height,
                                     isCheckbox,
                                     onClickAvatar,
                                     borderColor,
                                     isVolume = false,
                                     onlyAvatar = false,
                                     disableAvatar,
                                     hasDeleteIcon = false,
                                     removeCharacter = () => {},
                                     isUroid = false,
                                     noSelectedCharacter = false
                                   }: Props) {
  return (
    <div className={'relative cursor-pointer group'}>
      <img
        onClick={onClickAvatar}
        src={src}
        alt="character"
        style={{
          width: width,
          height: height,
          border: borderColor === selectedColor ? '4px solid' : '2px solid',
          borderColor: borderColor || selectedColor,
          borderRadius : '50%'
        }}
        className={`${(disableAvatar || noSelectedCharacter) && 'opacity-30 object-cover'}`}
      />
      {
        onlyAvatar &&
        <div className={'absolute -right-1 -bottom-1'}>
          {
            isUroid ?
              <img src={'/icons/uRoid.svg'} alt={'uRoid'} className={''} width={25} height={25}/>
              : <img src={'/icons/mRoid.svg'} alt={'mRoid'} className={''} width={25} height={25}/>
          }
        </div>
      }
      {
        hasDeleteIcon &&
        <IconButton
          className={'absolute left-[34px] top-0 bg-white w-5 h-5 opacity-0 transition-300 group-hover:opacity-100'}
          size={'small'} onClick={removeCharacter}>
          <ClearIcon fontSize={'small'} color={'warning'}/>
        </IconButton>
      }
      {
        !onlyAvatar ?
          <div>
            {
              isCheckbox ?
                <Checkbox className={'absolute left-7 top-5 characterCheckBox'}
                          size={'small'}
                          checked={checked}
                          onChange={onchange}/>
                :
                <>
                  {
                    isVolume ?
                      <img src={avtImg.soundOn}
                           alt={'soundOn'}
                           className={'absolute left-8 top-7'}
                           width={25}
                           height={25}/> :
                      <img src={avtImg.akarSoundOff}
                           alt={'soundOff'}
                           className={'absolute left-8 top-7'}
                           width={25}
                           height={25}/>
                  }
                </>
            }
          </div> : null
      }
    </div>
  );
}

export default CharacterSettingComponent;
