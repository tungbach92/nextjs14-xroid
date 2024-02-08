import React, {ReactNode, useState} from 'react';
import {twMerge} from "tailwind-merge";
import {IconButton, Popover} from "@mui/material";
import {BlockInputEnecolorImage, BlockInputEnecolorText, BlockText, Enecolor} from "@/app/types/block";
import {deleteEneColor} from "@/app/common/commonApis/enecolorsApi";
import {toast} from "react-toastify";
import HeaderIcon from "@/app/components/enecolorCustomComps/HeaderIcon";
import ModalEnecolorDetail from "@/app/components/Structures/ModalEnecolorDetail";
import {getIconEnecolorRC_CR_RCI_CRI} from "@/app/common/getIconEnecolorRC_CR_RCI_CRI";
import ActionIcon from "@/app/common/data/svgData/action-icon.svg";
import ModalEnecolors from "@/app/components/Structures/ModalEnecolors";
import {ModalConfirmDelete} from "@/app/components/Mentaloids/modal/ModalConfirmDetele";

type Props = {
  icon?: string | ReactNode,
  bottomTitle?: string
  bgColor?: string,
  border?: string,
  handleClick?: (item?: Enecolor) => void
  avatar?: string | ReactNode
  enecolor?: Enecolor
  padding?: string
  item?: Enecolor
  width?: string
  block?: BlockText | BlockInputEnecolorImage | BlockInputEnecolorText
  noBorder?: boolean
  isAdmin?: boolean
  copyEnecolor?: () => void
  subType?: string
  tabValue?: number
  setEnecolor?: React.Dispatch<React.SetStateAction<Enecolor>>
  inEneColor?: boolean
  isSelected?: boolean
}

function EnecolorTemplateItem({
  subType, tabValue, setEnecolor,
  icon = '',
  bottomTitle = '',
  bgColor = 'bg-[#F5F7FB]',
  border = '',
  avatar,
  handleClick = () => {
  },
  enecolor,
  padding = 'px-6 py-4',
  item,
  width,
  isAdmin,
  isSelected,
  copyEnecolor = () => {
  },
  inEneColor = false
}: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const [isDelete, setIsDelete] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [anchorElPreview, setAnchorElPreview] = useState<HTMLElement | null>(null);
  const openPreview = Boolean(anchorElPreview)
  const idPreview = openPreview ? 'simple-popover-preview' : undefined;
  const [openEneTextModal, setOpenEneTextModal] = useState<boolean>(false)
  const [openEneImgModal, setOpenEneImgModal] = useState<boolean>(false)

  const handleClosePopover = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAnchorEl(null);
  }

  const handleDelete = async () => {
    if (!enecolor) return
    try {
      setIsLoading(true)
      await deleteEneColor(enecolor.id)
      setIsDelete(false)
      toast.success('削除しました。', {autoClose: 3000})
      setAnchorEl(null)
    } catch (e) {
      console.log(e)
      toast.error('削除に失敗しました。', {autoClose: 3000})
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenPopoverPreview = (event: any) => {
    event.stopPropagation();
    setAnchorElPreview(event.currentTarget);
  };
  const handleClosePopoverPreview = (e) => {
    e.stopPropagation();
    setAnchorElPreview(null);
  };
  const onMouseEnter = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setAnchorEl(e.currentTarget);
  }

  const handleEditEnecolor = (e) => {
    e.stopPropagation()
    setOpenEneTextModal(true)
    setAnchorEl(null)
    setEnecolor(item)
  }

  const handleDeleteEnecolor = (e) => {
    e.stopPropagation()
    setIsDelete(true)
    setEnecolor(item)
    setAnchorEl(null)
  }
  return (
    <div
      className={twMerge(`flex flex-col items-center justify-center gap-2 ${padding} rounded-md cursor-pointer text-black
       ${bgColor} ${border} ${width} ${isSelected && 'border-2 border-solid border-blue-600'}`)}
      onClick={() => {
        setAnchorElPreview(null)
        handleClick(item)
      }}
    >
      <div className={'grid grid-cols-12 gap-2 justify-between'}>
        <div className={'col-span-11 grid-cols-12 grid'}
             onMouseEnter={handleOpenPopoverPreview}
             onMouseLeave={handleClosePopoverPreview}
        >
          <HeaderIcon
            className={'text-black col-span-4 my-auto'}
            icon={icon as string}
            rankTitle={`${['enecolor_4_rank', 'enecolor_16_rank'].includes(item?.output_type) ? `${item?.groupsText?.rank || item?.rank} 位 →` : ''}`}
            colorTitle={`${['enecolor_16', 'enecolor_4'].includes(item?.output_type) ? '→ 順位' : ''}`}
          />
          {item?.name &&
            <span title={item?.name} className={'col-span-6 my-auto pl-2 max-w-[130px] truncate'}>{item?.name}</span>
          }
          <div className={'col-span-2 flex'}>
            {avatar && <div className={'m-auto w-7'}>
              {avatar}
            </div>}
          </div>
        </div>
        {inEneColor &&
          <IconButton className='cursor-pointer'
                      onMouseOver={(e) => onMouseEnter(e)}
          >
            <ActionIcon/>
          </IconButton>
        }
        {bottomTitle &&
          <span className={'my-auto'}>{bottomTitle}</span>
        }
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div className={'max-w-fit h-[34px] flex rounded bg-white items-center'}>
          <img className={'w-[20px] ml-2 cursor-pointer mx-1'}
               src={'/icons/copy.svg'}
               alt={'copy'}
               onClick={() => {
                 setAnchorEl(null)
                 copyEnecolor()
               }}/>
          {isAdmin ?
            <div className={'flex'}>
              <div className={'border border-solid border-gray-300 border-r border-l-0 border-y-0 h-4/5'}/>
              <img
                className='w-[20px] ml-2 cursor-pointer mx-1'
                src={'/icons/edit.svg'} alt={'edit'}
                onClick={(e) => {
                  handleEditEnecolor(e)
                }}
              />
              <div className={'border border-solid border-gray-300 border-r border-l-0 border-y-0 h-4/5'}/>
              <img
                className='w-[20px] cursor-pointer mx-1'
                src='/icons/trash-icon.svg' alt='trash-icon'
                onClick={handleDeleteEnecolor}
              />
            </div> : null
          }

        </div>
      </Popover>
      <ModalConfirmDelete
        title={`${enecolor?.name}のキャラクターを削除しますか？`}
        id={enecolor?.id}
        openModal={isDelete}
        setOpenModal={setIsDelete}
        handleSubmit={handleDelete}
        isEnecolor={true}
      />
      {/*<BaseDeleteModal*/}
      {/*  label={`${enecolor?.name}を削除してもよろしいですか？`}*/}
      {/*  isOpen={isDelete}*/}
      {/*  handleClose={() => setIsDelete(false)}*/}
      {/*  handleDelete={handleDelete}*/}
      {/*  isLoading={isLoading}*/}
      {/*/>*/}
      <Popover
        id={idPreview + item.id}
        open={openPreview}
        anchorEl={anchorElPreview}
        onClose={handleClosePopoverPreview}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          pointerEvents: 'none',
        }}
        disableRestoreFocus
      >
        <ModalEnecolorDetail
          headerIcon={<HeaderIcon
            icon={getIconEnecolorRC_CR_RCI_CRI(item, true)}
            rankTitle={`${['enecolor_4_rank', 'enecolor_16_rank'].includes(item?.output_type) ? `順位→` : ''}`}
            colorTitle={`${['enecolor_16', 'enecolor_4'].includes(item?.output_type) ? '→ 順位' : ''}`}
          />}
          enecolor={item} isImage={Boolean(item?.groupsImg?.length)} isPreview={true}/>
      </Popover>
      <ModalEnecolors openEnecolorDialog={openEneTextModal}
                      setOpenEnecolorDialog={setOpenEneTextModal}
                      enecolor={enecolor}
                      setEnecolor={setEnecolor}
                      type={subType}
                      isImage={Boolean(enecolor?.groupsImg?.length)}
                      headerIcon={
                        <HeaderIcon
                          icon={getIconEnecolorRC_CR_RCI_CRI(enecolor, true)}
                          rankTitle={tabValue === 0 && <span className={'my-auto'}>順位→</span>}
                          colorTitle={tabValue === 1 && <span className={'my-auto'}>→順位</span>}
                        />}
      />
      <ModalEnecolors openEnecolorDialog={openEneImgModal}
                      setOpenEnecolorDialog={setOpenEneImgModal}
                      enecolor={enecolor}
                      setEnecolor={setEnecolor}
                      type={subType}
                      isImage={Boolean(enecolor?.groupsImg?.length)}
                      headerIcon={
                        <HeaderIcon
                          icon={getIconEnecolorRC_CR_RCI_CRI(enecolor, true)}
                          rankTitle={tabValue === 0 && <span className={'my-auto'}>順位→</span>}
                          colorTitle={tabValue === 1 && <span className={'my-auto'}>→順位</span>}/>}
      />
    </div>
  );
}

export default EnecolorTemplateItem;
