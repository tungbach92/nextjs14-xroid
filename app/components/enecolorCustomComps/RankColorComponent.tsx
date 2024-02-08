import * as React from "react";
import {ReactNode, useMemo, useState} from "react";
import {Enecolor} from "@/app/types/block";
import {ENECOLOR_RANK_IMG_V2, InitEnecolor, INPUT_ENECOLOR_IMAGE} from "@/app/configs/constants";
import {useAtomValue} from "jotai";
import {enecolorsAtom} from "@/app/store/atom/enecolors.atom";
import {Button, styled, Tab, Tabs} from "@mui/material";
import EnecolorItemsComponent from "@/app/components/enecolorCustomComps/EnecolorItemsComponent";
import AddIcon from "@mui/icons-material/Add";
import ModalEnecolors from "@/app/components/Structures/ModalEnecolors";
import {EnecolorsProps} from "@/app/components/Enecolors/Enecolors";
import HeaderIcon from "@/app/components/enecolorCustomComps/HeaderIcon";
import {getIconEnecolorRC_CR_RCI_CRI} from "@/app/common/getIconEnecolorRC_CR_RCI_CRI";
import {allUserEnecolorsAtom} from "@/app/store/atom/allUserEnecolors.atom";
import {Studio} from "@/app/types/types";

interface StyledTabProps {
  label: string | ReactNode;
  value: number
}

const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({theme}) => ({
  backgroundColor: '#F5F7FB',
  textTransform: 'none',
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(15),
  marginRight: theme.spacing(8),
  marginLeft: theme.spacing(8),
}));

export interface RankColorProps extends EnecolorsProps {
  icon?: string,
  typeValue?: number
  isTextOnly?: boolean
  ownerStudios: Studio[]
  loadingOwnerStudios: boolean
}

function RankColorComponent({
  ...props
}: RankColorProps) {
  const {typeValue, type, icon, isTextOnly} = props;
  const enecolors = useAtomValue(enecolorsAtom)
  const [tabValue, setTabValue] = useState<number>(0)
  const [openEneTextModal, setOpenEneTextModal] = useState<boolean>(false)
  const [openEneImgModal, setOpenEneImgModal] = useState<boolean>(false)
  const [enecolor, setEnecolor] = useState<Enecolor>(InitEnecolor)
  const allUserEnecolors = useAtomValue(allUserEnecolorsAtom)
  const enecolorsRC = useMemo(() => allUserEnecolors?.filter(x => x.output_type === (typeValue === 0 ? 'enecolor_4_rank' : 'enecolor_16_rank') && !x?.groupsImg), [enecolors, typeValue, allUserEnecolors])
  const enecolorsCR = useMemo(() => allUserEnecolors?.filter(x => x.output_type === (typeValue === 0 ? 'enecolor_4' : 'enecolor_16') && !x?.groupsImg), [enecolors, typeValue, allUserEnecolors])
  const enecolorsRI = useMemo(() => allUserEnecolors?.filter(x => x.output_type === (typeValue === 0 ? 'enecolor_4_rank' : 'enecolor_16_rank') && !x?.groupsText && x?.groupsImg.length), [enecolors, typeValue, allUserEnecolors])
  const enecolorsIR = useMemo(() => allUserEnecolors?.filter(x => x.output_type === (typeValue === 0 ? 'enecolor_4' : 'enecolor_16') && !x?.groupsText && x?.groupsImg.length), [enecolors, typeValue, allUserEnecolors])
  const output_type = useMemo(() => {
    let text = 'enecolor_4_rank'
    typeValue === 0 && tabValue === 0 && (text = 'enecolor_4_rank')
    typeValue === 1 && tabValue === 0 && (text = 'enecolor_16_rank')
    typeValue === 0 && tabValue === 1 && (text = 'enecolor_4')
    typeValue === 1 && tabValue === 1 && (text = 'enecolor_16')
    return text
  }, [typeValue, tabValue])


  const subType = useMemo(() => {
    let res = 'RC'
    if (tabValue === 0) res = 'RC'
    if (tabValue === 1) res = 'CR'
    return res
  }, [tabValue])
  const handleOpenEneTextModal = () => {
    setOpenEneTextModal(true)
  }
  const handleSetEnecolorText = () => {
    const ene: Enecolor = {name: "", groupsText: {groups: [], userInput: ''}}
    ene.output_type = output_type
    ene.name = ''
    switch (output_type) {
      case 'enecolor_4':
        ene.groupsText.groups = ['', '', '', '']
        ene.groupsText.color = 'Y'
        ene.groupsText.rank = null
        break
      case 'enecolor_4_rank':
        ene.groupsText.groups = ['', '', '', '']
        ene.groupsText.rank = 1
        ene.groupsText.color = ''
        break
      case 'enecolor_16':
        ene.groupsText.groups = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
        ene.groupsText.color = 'YCS'
        ene.groupsText.rank = null
        break
      case 'enecolor_16_rank':
        ene.groupsText.groups = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
        ene.groupsText.rank = 1
        ene.groupsText.color = ''
        break
      default:
        break
    }
    setEnecolor(ene)
  }

  const handleSetEnecolorImg = () => {
    const ene: Enecolor = {name: "", groupsImg: []}
    ene.output_type = output_type
    switch (output_type) {
      case 'enecolor_4':
        ene.groupsImg = [
          {name: '1位', url: ''},
          {name: '2位', url: ''},
          {name: '3位', url: ''},
          {name: '4位', url: ''}]
        ene.color = 'Y'
        ene.rank = null
        break
      case 'enecolor_4_rank':
        ene.groupsImg = [
          {name: 'Y', url: ''},
          {name: 'R', url: ''},
          {name: 'G', url: ''},
          {name: 'B', url: ''}]
        ene.rank = 1
        ene.color = ''
        break
      case 'enecolor_16':
        ene.groupsImg = [
          {name: '1位', url: ''},
          {name: '2位', url: ''},
          {name: '3位', url: ''},
          {name: '4位', url: ''},
          {name: '5位', url: ''},
          {name: '6位', url: ''},
          {name: '7位', url: ''},
          {name: '8位', url: ''},
          {name: '9位', url: ''},
          {name: '10位', url: ''},
          {name: '11位', url: ''},
          {name: '12位', url: ''},
          {name: '13位', url: ''},
          {name: '14位', url: ''},
          {name: '15位', url: ''},
          {name: '16位', url: ''}]
        ene.color = 'YCS'
        ene.rank = null
        break
      case 'enecolor_16_rank':
        ene.groupsImg = [
          {name: 'YCS', url: ''},
          {name: 'YOS', url: ''},
          {url: '', name: 'RCS'},
          {url: '', name: 'ROS'},
          {name: 'YCG', url: ''},
          {url: '', name: 'YOG'},
          {url: '', name: 'RCG'},
          {name: 'ROG', url: ''},
          {url: '', name: 'GCS'},
          {url: '', name: 'GOS'},
          {name: 'BCS', url: ''},
          {name: 'BOS', url: ''},
          {name: 'GCG', url: ''},
          {url: '', name: 'GOG'},
          {url: '', name: 'BCG'},
          {name: 'BOG', url: ''},
        ]
        ene.rank = 1
        ene.color = ''
        break
      default:
        break
    }
    setEnecolor(ene)
  }
  const handleClickBtnAddText = () => {
    handleOpenEneTextModal()
    handleSetEnecolorText()
  }

  const handleClickBtnAddImg = () => {
    setOpenEneImgModal(true)
    handleSetEnecolorImg()
  }

  return (
    <>
      <div className={'flex w-full items-center justify-center'}>
        <Tabs value={tabValue}
              onChange={(event, newValue) => setTabValue(newValue)}
              aria-label="anim_tab"
        >
          <StyledTab value={0}
                     label={
                       <Button className={'text-black m-3'}>
                         <HeaderIcon
                           className={'m-auto flex flex-col gap-2'}
                           icon={icon}
                           bottomTitle={'（例:1位は{{赤}}です。）'}
                           rankTitle={<span className={'my-auto'}>順位 →</span>}/>
                       </Button>

                     }/>
          <StyledTab value={1}
                     label={
                       <Button className={'text-black m-3'}>
                         <HeaderIcon
                           className={'m-auto flex flex-col gap-2'}
                           icon={icon}
                           bottomTitle={'（例:赤は{{2位}}です。）'}
                           colorTitle={<span className={'my-auto'}>→ 順位</span>}/>
                       </Button>
                     }/>
        </Tabs>
      </div>
      <div className={'flex w-full gap-12 items-start justify-center'}>
        {tabValue === 0 &&
          <>
            {(type !== INPUT_ENECOLOR_IMAGE && type !== ENECOLOR_RANK_IMG_V2) &&
              <div className={'flex flex-col bg-white pt-2'}>
                <Button variant="contained"
                        onClick={handleClickBtnAddText}
                        startIcon={<AddIcon/>}
                        className={'flex-1 ml-3 w-40'}>テキスト</Button>
                <EnecolorItemsComponent {...props}
                                        items={enecolorsRC}
                                        rankTitle={<span className={'my-auto'}>順位→</span>}
                                        type={subType}/>
              </div>
            }
            {(!isTextOnly || type === INPUT_ENECOLOR_IMAGE || type === ENECOLOR_RANK_IMG_V2) &&
              <div className={'flex flex-col bg-white pt-2'}>
                <Button variant="contained"
                        onClick={handleClickBtnAddImg}
                        startIcon={<AddIcon/>}
                        className={'flex-1 w-40 ml-3'}>画像</Button>
                <EnecolorItemsComponent  {...props}
                                         items={enecolorsRI}
                                         rankTitle={<span className={'my-auto'}>順位→</span>}
                                         type={subType}
                />
              </div>
            }
          </>
        }

        {tabValue === 1 &&
          <>
            {(type !== INPUT_ENECOLOR_IMAGE && type !== ENECOLOR_RANK_IMG_V2) &&
              <div className={'flex flex-col bg-white pt-2'}>
                <Button variant="contained"
                        onClick={handleClickBtnAddText}
                        startIcon={<AddIcon/>}
                        className={'flex-1 ml-3 w-40'}>テキスト</Button>
                <EnecolorItemsComponent {...props}
                                        items={enecolorsCR}
                                        colorTitle={<span className={'my-auto'}>→順位</span>}
                                        type={subType}
                />
              </div>
            }
            {(!isTextOnly || type === INPUT_ENECOLOR_IMAGE || type === ENECOLOR_RANK_IMG_V2) &&
              <div className={'flex flex-col bg-white pt-2'}>
                <Button variant="contained"
                        onClick={handleClickBtnAddImg}
                        startIcon={<AddIcon/>}
                        className={'flex-1 w-40 ml-3'}>画像</Button>
                <EnecolorItemsComponent {...props}
                                        colorTitle={<span className={'my-auto'}>→順位</span>}
                                        items={enecolorsIR}
                                        type={subType}
                                        tabValue={tabValue}
                />
              </div>
            }
          </>
        }
      </div>
      <ModalEnecolors openEnecolorDialog={openEneTextModal} setOpenEnecolorDialog={setOpenEneTextModal}
                      enecolor={enecolor} setEnecolor={setEnecolor} type={subType}
                      headerIcon={
                        <HeaderIcon
                          icon={getIconEnecolorRC_CR_RCI_CRI(enecolor, true)}
                          rankTitle={tabValue === 0 && <span className={'my-auto'}>順位→</span>}
                          colorTitle={tabValue === 1 && <span className={'my-auto'}>→順位</span>}
                        />}
      />
      <ModalEnecolors openEnecolorDialog={openEneImgModal} setOpenEnecolorDialog={setOpenEneImgModal}
                      enecolor={enecolor} setEnecolor={setEnecolor} type={subType} isImage={true}
                      headerIcon={
                        <HeaderIcon
                          icon={getIconEnecolorRC_CR_RCI_CRI(enecolor, true)}
                          rankTitle={tabValue === 0 && <span className={'my-auto'}>順位→</span>}
                          colorTitle={tabValue === 1 && <span className={'my-auto'}>→順位</span>}
                        />}
      />
    </>
  )
}

export default RankColorComponent
