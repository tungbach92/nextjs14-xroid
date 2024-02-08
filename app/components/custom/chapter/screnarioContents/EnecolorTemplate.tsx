import React, {useEffect, useState} from 'react';
import Dropdown from "@/app/components/custom/Dropdown";
import {rankData} from "@/app/common/rankData";
import {dataSelect, Enecolor16Image, Enecolor16Rank, Enecolor4Image, Enecolor4Rank} from "@/app/common/colorData";
import CardCustom from "@/app/components/custom/CardCustom";
import {useAtom, useSetAtom} from "jotai";
import {readWriteBlocksAtom} from '@/app/store/atom/blocks.atom';
import {getId} from "@/app/common/getId";
import {createEneColorSetting} from "@/app/common/commonApis/eneColorSettingApi";
import {toast} from "react-toastify";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {getLabelWithColorOfEnecolor} from "@/app/common/getLabelWithColorOfEnecolor";
import UploadAndSelectImage from "@/app/components/custom/UploadAndSelectImage";
import {cloneDeep, isEqual} from "lodash";
import {EnecolorSettingName} from "@/app/components/custom/chapter/EnecolorSettingName";
import {useGetEnecolorRankImgSettings} from "@/app/hooks/useGetEnecolorRankImgSettings";
import {CssTextField} from "@/app/components/custom/CssTextField";
import {BlockEneColorRankImg, DataEneColorRankImgValues, SaveSetting} from "@/app/types/block";
import {convertInputNumber} from "@/app/common/convertNumber";


type props = {
  onDelete?: any
  onCopy?: any
  block: BlockEneColorRankImg
  isShowAddButton?: boolean
  handleGetIndex?: () => void
  handleMultiCopy?: (type: string) => void
}

function EnecolorTemplate({
  onDelete,
  onCopy,
  block,
  isShowAddButton,
  handleGetIndex,
  handleMultiCopy
}: props) {
  const updateBlocks = useSetAtom(readWriteBlocksAtom)
  const titleSetting = ['enecolor_4', 'enecolor_16'].includes(block?.data.output_type) ? 'color' : 'rank'
  const [eneColorRankImgName, setEneColorRankImgName] = useState<string>('')
  const [userInfo] = useAtom<any>(userAtomWithStorage);
  const userId = userInfo?.user_id;
  const {eneColorRankImgSettings} = useGetEnecolorRankImgSettings()
  const [openNameDialog, setOpenNameDialog] = useState<boolean>(false)

  const handleChangeOuputType = (value: string) => {
    const _block = cloneDeep(block)
    switch (value) {
      case 'enecolor_4' :
        _block.data.groupsImg = Enecolor4Rank
        break
      case 'enecolor_4_rank' :
        _block.data.groupsImg = Enecolor4Image
        break
      case 'enecolor_16' :
        _block.data.groupsImg = Enecolor16Rank
        break
      case 'enecolor_16_rank' :
        _block.data.groupsImg = Enecolor16Image
        break
      default:
        break
    }
    _block.data.output_type = value
    _block.data.rank = 1
    _block.data.color = block?.data.output_type === 'enecolor_4' ? 'Y' : 'YCS'
    updateBlocks(_block)
  }

  const handleOnChangeEneColorBlock = (field: string, value: DataEneColorRankImgValues) => {
    const _block = cloneDeep(block)
    _block.data[field] = value
    updateBlocks(_block)
  }

  const saveEnecolorSetting = async () => {
    if (!eneColorRankImgName) return
    try {
      const duplicateName = eneColorRankImgSettings?.find(item => item?.title === eneColorRankImgName)
      if (duplicateName)
        return toast.error("保存されたデータと同じ名前を使うことができません。")

      //!TODO removed customBLock here
      const enecolorSaveSetting: SaveSetting = {
        ...block,
        title: eneColorRankImgName,
        id: getId("block_", 10),
        isDeleted: false,
        userId
      }

      let duplicateData = eneColorRankImgSettings?.filter(setting => setting?.type === enecolorSaveSetting?.type && isEqual(setting?.data, enecolorSaveSetting?.data))
      if (duplicateData?.length)
        return toast.error('保存されたデータと同じ設定を保存できません。')

      await createEneColorSetting(enecolorSaveSetting)
      toast.success('エネカラー画像の設定を「保存済みエネカラー画像リスト」に保存しました。', {autoClose: 3000})
      setEneColorRankImgName('')
      setOpenNameDialog(false)
    } catch (e) {
      console.log(e)
      toast.error("エネカラー画像設定が追加できませんでした。" + e.message, {autoClose: 3000});
    } finally {
      // setEneColorRankImgName('')
    }
  }
  const handleUploadImage = (url: string, idx: number) => {
    const _block = cloneDeep(block)
    _block.data.groupsImg[idx].url = url
    updateBlocks(_block)
  }

  const [seconds, setSeconds] = useState<number>(0)
  useEffect(() => {
    setSeconds(block?.delayTime)
  }, [block])
  const handleChangeDelay = (e) => {
    const _block = cloneDeep(block)
    _block.delayTime = e.target.value
    updateBlocks(_block)
  }
  return (
    <CardCustom isCopy={true} onCopy={onCopy} onDelete={onDelete}
                title={'Enecolor'} color={'#FFBFCB'}
                block={block}
                handleMultiCopy={handleMultiCopy}
                handleGetIndex={handleGetIndex}
                isShowAddButton={isShowAddButton}
                className={'border-2 border-solid border-[#FFBFCB] min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px]'}>
      <div className={'p-2'}>

        <div className={'flex gap-2 pt-5'}>
          <Dropdown
            dataSelect={dataSelect}
            value={block?.data.output_type}
            onChange={(event) => handleChangeOuputType(event.target.value)}
            maxWidth={150}
            className='max-w-fit'
            renderValue={'enecolor_4'}
          />
        </div>
        <hr/>
        <div className={'grid grid-cols-3 gap-4'}>
          <div className={'grid-col-1 gap-2 font-bold'}>
            {titleSetting === 'rank' ? 'With Rank:' : 'With Color:'}
            {
              titleSetting === 'rank' ?
                <Dropdown dataSelect={rankData(block?.data.output_type)}
                          value={block?.data.rank}
                          onChange={(event) => handleOnChangeEneColorBlock("rank", event.target.value)}
                          className={'py-2'}></Dropdown>
                :
                <Dropdown dataSelect={rankData(block?.data.output_type)}
                          value={block?.data.color}
                          onChange={(event) => handleOnChangeEneColorBlock("color", event.target.value)}
                          className={'py-2'}></Dropdown>
            }
          </div>
        </div>

        <div className={'font-bold pb-2'}>
          Then show image by:
        </div>
        <div
          className={`grid ${block?.data.output_type === 'enecolor_16' || block?.data.output_type === 'enecolor_16_rank' ? 'grid-cols-4' : 'grid-cols-2'} gap-3 pb-3 max-w-fit`}>
          {
            block?.data?.groupsImg?.map((item, idx) => {
              const {label, color} = getLabelWithColorOfEnecolor(block.data.output_type, item.name)
              return (
                <div className={'col-span-1'} key={'groupsImg' + item.url + idx}>

                  <UploadAndSelectImage id={block?.id}
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
        <div className={'-mt-[14%] mb-5  ml-[73%]'}>
          <span className={'pl-6'}>表示時間</span>
          <div className={'flex items-center gap-2'}>
            <CssTextField inputProps={{min: 0}} size={'small'} className={'w-3/4'} type={'number'}
                          value={convertInputNumber(seconds)}
                          onChange={(e) => handleChangeDelay(e)}/>秒
          </div>
        </div>
        <EnecolorSettingName text={eneColorRankImgName} setText={setEneColorRankImgName}
                             saveSetting={saveEnecolorSetting} setOpenNameDialog={setOpenNameDialog}
                             openNameDialog={openNameDialog}
        />
      </div>
    </CardCustom>
  );
}

export default EnecolorTemplate;
