import {FormControl, FormHelperText} from "@mui/material";
import {CssTextField} from "@/app/components/custom/CssTextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import CustomizedSwitch from "@/app/components/base/CustomizedSwitch";
import Dropdown from "@/app/components/custom/Dropdown";
import {rankData} from "@/app/common/rankData";
import {getLabelWithColorOfEnecolor} from "@/app/common/getLabelWithColorOfEnecolor";
import UploadAndSelectImage from "@/app/components/custom/UploadAndSelectImage";
import TextBlocksCustom from "@/app/components/custom/chapter/TextBlocksCustom";
import React, {useEffect, useMemo, useState} from "react";
import {ModalEnecolorsProps} from "@/app/components/Structures/ModalEnecolors";
import {useAtom, useAtomValue} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {enecolorsAtom} from "@/app/store/atom/enecolors.atom";
import {OWNER_ID, TEST_AND_OWNER_ID} from "../../../common/ownerId";
import {getColorJpName} from "@/app/common/getColorJpName";
import {Enecolor16ImageText, Enecolor16Rank, Enecolor4ImageText, Enecolor4Rank} from "@/app/common/colorData";
import {InitEnecolor, isProd} from "@/app/configs/constants";
import {cloneDeep} from "lodash";
import {SelectColor} from "@/app/components/Structures/SelectColor";


interface Props extends Omit<ModalEnecolorsProps, 'openEnecolorDialog'> {
  focusColorRankRight?: string | number
  setErrors?: React.Dispatch<React.SetStateAction<{ [p: string]: string }>>
  setIsNameInValid?: React.Dispatch<React.SetStateAction<boolean>>,
  isNameInValid?: boolean,
  setFocusColorRankRight?: React.Dispatch<React.SetStateAction<string | number>>,
  errors?: { [p: string]: string }
  isPreview?: boolean
}

export default function ModalEnecolorDetail({
  enecolor,
  isImage,
  setEnecolor,
  setSelectedEnecolor,
  headerIcon,
  isPopover,
  focusColorRankRight,
  setErrors,
  setIsNameInValid,
  isNameInValid,
  setFocusColorRankRight,
  errors,
  isPreview = false
}: Props) {
  const [userInfo] = useAtom<any>(userAtomWithStorage)
  const [colInput, setColInput] = useState<number>(1);
  const isRank = enecolor?.output_type === 'enecolor_4_rank' || enecolor?.output_type === 'enecolor_16_rank'
  const isAdmin = isProd() ? [OWNER_ID].includes(userInfo?.user_id) : TEST_AND_OWNER_ID.includes(userInfo?.user_id)
  const [focusedColorLeft, setFocusedColorLeft] = useState<string>('')
  const leftText = isImage ? getLeftText(enecolor?.color, enecolor?.rank, focusedColorLeft) : getLeftText(enecolor?.groupsText?.color, enecolor?.groupsText?.rank, focusedColorLeft)
  const rightText = getRightText(focusColorRankRight)
  const enecolors = useAtomValue(enecolorsAtom)

  function getLeftText(color: string, rank: number, focusedColorLeft: string) {
    if (color && !focusedColorLeft)
      return `<${getColorJpName(color)}> 診断結果の`
    if (rank && !focusedColorLeft)
      return `<${rank}位> 診断結果の`
    if (focusedColorLeft)
      return `<${getColorJpName(focusedColorLeft)}> 診断結果の`
    return ''
  }

  function getRightText(color: string | number) {
    if (color)
      return `<${color}> の時、内容が出力されます`
    return ''
  }

  const enecolorForms: { name: string, text: string, label?: string, color?: string }[] = useMemo(() => {
    if (enecolor?.output_type === 'enecolor_4_rank') {
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
    if (enecolor?.output_type === 'enecolor_16_rank') {

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
    if (enecolor?.output_type === 'enecolor_4') {
      setColInput(1);
      return Enecolor4Rank.map((item) => {
        return {
          name: item.name,
          text: item.url,
        }
      })
    }
    if (enecolor?.output_type === 'enecolor_16') {
      setColInput(2);
      return Enecolor16Rank.map((item) => {
        return {
          name: item.name,
          text: item.url,
        }
      });
    }
  }, [enecolor?.output_type])

  const handleChangeSelectedEnecolor = (e) => {
    const id = e.target.value
    const selected = enecolors.find(item => item.id === (id || enecolor.id))
    id ? setSelectedEnecolor(selected) : setSelectedEnecolor(null)
    id ? setEnecolor(selected) : setEnecolor(InitEnecolor)
  }

  const handleChangeEnecolorName = (e) => {
    setErrors?.({})
    setIsNameInValid?.(false)
    const _enecolor = cloneDeep(enecolor)
    _enecolor.name = e.target.value
    setEnecolor(_enecolor)
  }

  const handleChangeRankColor = (e) => {
    const _enecolor = cloneDeep(enecolor)
    isRank ? (_enecolor.groupsText.rank = e.target.value) : (_enecolor.groupsText.color = e.target.dataset.color)
    setEnecolor(_enecolor)
  }

  const handleChangeRankColorImg = (e) => {
    const _enecolor = cloneDeep(enecolor)
    isRank ? (_enecolor.rank = e.target.value) : (_enecolor.color = e.target.dataset.color)
    setEnecolor(_enecolor)
  }


  const handleGroupTextChange = (e, grtIndex, grIndex) => {
    const _enecolor = cloneDeep(enecolor)
    _enecolor.groupsText.groups[grIndex] = e.target.value
    setEnecolor(_enecolor)
  }


  const handleUploadImage = (url: string, idx: number) => {
    const _enecolor = cloneDeep(enecolor)
    _enecolor.groupsImg[idx].url = url
    setEnecolor(_enecolor)
  }
  const onChangeShare = (e) => {
    const _enecolor = cloneDeep(enecolor)
    _enecolor.isShare = e.target.checked
    setEnecolor(_enecolor)
  }

  useEffect(() => {
    if (isImage) {
      const {label} = getLabelWithColorOfEnecolor(enecolor?.output_type, enecolor?.groupsImg?.[0]?.name)
      setFocusColorRankRight?.(label || enecolor?.groupsImg?.[0]?.name)
      return
    }
    setFocusColorRankRight?.(enecolorForms?.[0]?.label ? enecolorForms?.[0].label : enecolorForms?.[0].name)

  }, [enecolorForms?.[0]?.label, enecolor?.output_type, enecolor?.groupsImg?.[0]?.name, enecolorForms?.[0].label, enecolorForms?.[0].name, isImage])
  return (
    <div
      className={`flex flex-col items-center gap-3 ${isPopover && 'hidden'} ${isPreview && 'p-4 z-50 bg-white rounded min-w-max border-1 border-solid border-gray-300 pointer-events-none'}`}>
      <div className={'flex flex-col gap-12 justify-center items-center w-full h-full'}>
        <div className={'flex flex-wrap items-end gap-5'}>
          <div className={'mb-1'}>{headerIcon}</div>
          <FormControl variant="outlined" margin='dense'>
            <FormHelperText>テキスト</FormHelperText>
            <CssTextField
              id="outlined-basic"
              multiline={true}
              value={enecolor?.name ?? ''}
              onChange={handleChangeEnecolorName}
              variant="outlined"
              size={'small'}
              className={'flex-1'}
              error={isNameInValid}
              helperText={errors?.name}
            />
          </FormControl>
          {isAdmin &&
            <FormControlLabel labelPlacement="top"
                              control={<CustomizedSwitch checked={enecolor?.isShare}
                                                         onChange={(e) => onChangeShare(e)}
                              />}
                              label="アセットシェア"/>
          }
        </div>
        <div className={'flex flex-wrap gap-8 items-center'}>
          {isImage ?
            <>
              <div className={'flex flex-col gap-12 items-center'}>
                {isRank ?
                  <Dropdown dataSelect={rankData(enecolor?.output_type)}
                            value={enecolor?.rank}
                            onChange={handleChangeRankColorImg}
                            className={'py-2 max-w-fit'}/>
                  :
                  <SelectColor enecolor={enecolor} handleChangeRankColor={handleChangeRankColorImg}
                               setFocusedColorLeft={setFocusedColorLeft}/>
                }
                {!isPreview && <div>{leftText}</div>}
              </div>
              <div className={'flex flex-col gap-3 pb-3 max-w-fit'}>
                <div
                  className={`grid ${enecolor?.output_type === 'enecolor_16' || enecolor?.output_type === 'enecolor_16_rank' ? 'grid-cols-4' : 'grid-cols-2'} gap-3 pb-3 max-w-fit`}>
                  {
                    enecolor?.groupsImg?.map((item, idx) => {
                      const {label, color} = getLabelWithColorOfEnecolor(enecolor.output_type, item.name)
                      return (
                        <div className={'col-span-1'} key={'groupsImg' + item.url + idx}
                             onMouseOver={() => setFocusColorRankRight?.(label || item.name)}>
                          <UploadAndSelectImage id={enecolor?.id}
                                                url={item.url}
                                                text={label || item.name}
                                                borderColor={color || ""}
                                                index={idx}
                                                uploadImage={(url) => handleUploadImage(url, idx)}

                          />
                        </div>
                      )
                    })
                  }
                </div>
                {!isPreview && <div>{rightText}</div>}
              </div>
            </>
            :
            <>
              <div className={'flex flex-col gap-12 items-center'}>
                {isRank && enecolor?.groupsText?.rank ?
                  <Dropdown
                    dataSelect={rankData(enecolor?.output_type)}
                    isInPutLabel={true}
                    label={isRank ? '順位' : 'カラー'}
                    value={enecolor?.groupsText?.rank ?? 1}
                    maxWidth={100}
                    onChange={handleChangeRankColor}
                    className={'max-w-fit'}
                  />
                  :
                  <SelectColor enecolor={enecolor} handleChangeRankColor={handleChangeRankColor}
                               setFocusedColorLeft={setFocusedColorLeft}/>
                }
                {!isPreview && <div>{leftText}</div>}
              </div>
              <div className={'flex flex-col gap-3'}>
                <div
                  className={`grid gap-y-2 gap-x-4 ${enecolor?.output_type === 'enecolor_16' ? `grid-rows-8 grid-flow-col` : `grid-cols-${colInput}`} `}
                >
                  {
                    enecolorForms?.map((group, groupIndex) => {
                      return (
                        <TextBlocksCustom item={enecolor} idx={0} groupIndex={groupIndex} group={group}
                                          colInput={colInput} output_type={enecolor.output_type}
                                          key={groupIndex} handleGroupTextChange={handleGroupTextChange}
                                          setFocusColorRankRight={setFocusColorRankRight}/>
                      )
                    })
                  }
                </div>
                {!isPreview && <div>{rightText}</div>}
              </div>
            </>
          }
        </div>
      </div>
    </div>
  )
}
