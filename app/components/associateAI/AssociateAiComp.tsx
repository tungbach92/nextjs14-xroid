import React, {useState} from 'react';
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {QaDocTemplate} from "@/app/types/qaDocTemplate";
import {Popover} from "@mui/material";
import OpenAiGPTDialog from "@/app/components/associateAI/OpenAIGPTDialog";
import Modal from '../custom/Modal';
import {deleteAssociateAi} from "@/app/common/commonApis/asscociateAIApis";
import {toast} from "react-toastify";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import ClearIcon from '@mui/icons-material/Clear';


type props = {
  item: QaDocTemplate
  userId?: string
  width?: string
  inBlock?: boolean
  showEditButton?: boolean
  className?: string
  isShowRemoveBtn?: boolean
  handleRemove?: (item: QaDocTemplate) => void
  openRemoveQa?: boolean
  setOpenRemoveQa?: React.Dispatch<React.SetStateAction<boolean>>
}

function AssociateAiComp({
                           item, userId, width, inBlock = false,
                           showEditButton = false, className,
                           isShowRemoveBtn,
                           openRemoveQa = false,
                           setOpenRemoveQa,
                           handleRemove = () => {}
                         }: props) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const handleOpen = (event: any) => {
    event.preventDefault()
    event.stopPropagation()
    setAnchorEl(event.currentTarget);
  };

  const handleDelete = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await deleteAssociateAi(item?.id);
      toast.success('削除しました。');
    } catch (e) {
      toast.error('削除に失敗しました。');
      console.log(e);
    } finally {
      setOpenDelete(false);
    }
  }
  const handleCancelDelete = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setOpenDelete(false);
  }
  const onClosePopover = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setAnchorEl(null);
  }

  const handleOpenRemoveQaDialog = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setOpenRemoveQa(true);
  }

  const handleCancelRemoveQaDialog = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setOpenRemoveQa(false);
  }

  return (
    <div
      className={`bg-white rounded-md ${width} grid grid-cols-12 py-2 ${inBlock ? 'hover:bg-blue-100' : ''} ${className} relative`}>
      {
        isShowRemoveBtn &&
        <IconButton aria-label="delete"
                    size="small"
                    className="absolute top-0 right-0"
                    onClick={(e) => handleOpenRemoveQaDialog(e)}>
          <ClearIcon fontSize={'small'}/>
        </IconButton>
      }
      {
        item &&
        <Paper
          className={`my-auto p-3 ml-1 items-center bg-[#E1EAEF] rounded-md col-span-4 grid grid-cols-12`}>
          <AutoAwesomeIcon className={'mr-1 rotate-180 col-span-3'} color={'disabled'}/>
          <span className={'text-[14px] col-span-8 items-start justify-items-start justify-start'}>{item?.model}</span>
        </Paper>
      }
      <div className={`col-span-7 w-2/3 truncate m-auto`}>
        <span>{item?.title || ''}</span>
      </div>
      <div className={'col-span-1 m-auto'}>
        {
          showEditButton && <MoreHorizIcon className={'rotate-90 cursor-pointer'} onClick={handleOpen}/>
        }
        <Popover
          id={open ? 'simple-popover' : undefined}
          open={open}
          anchorEl={anchorEl}
          onClose={(e) => onClosePopover(e)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <div className={'w-[64px] h-[34px] flex  rounded bg-white items-center'}>
            <img
              className='w-[20px] ml-2 cursor-pointer'
              src={'/icons/edit.svg'} alt={'edit'}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setOpenEdit(true)
              }}
            />
            <div className={'border border-solid border-gray-300 border-r border-l-0 border-y-0 h-4/5 mx-1'}/>
            <img
              className='w-[20px] cursor-pointer'
              src='/icons/trash-icon.svg' alt='trash-icon'
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setOpenDelete(true)
              }}
            />
          </div>
        </Popover>
        {
          <OpenAiGPTDialog item={item}
                           userId={userId}
                           isUpdate={true}
                           openModal={openEdit}
                           setOpenModel={setOpenEdit}/>
        }
      </div>
      { // delete qa from list qas
        <Modal open={openDelete}
               onSubmit={(e) => handleDelete(e)}
               setOpen={setOpenDelete}
               dividers={false}
               title={'このデータ連携を削除しますか？'}
               size={'xs'}
               actionPosition={'center'}
               handleClose={(e) => handleCancelDelete(e)}
               btnSubmit={'削除'}>
          <div/>
        </Modal>
      }
      { // remove qa from block
        <Modal open={openRemoveQa}
               setOpen={setOpenRemoveQa}
               onSubmit={handleRemove}
               dividers={false}
               title={'このデータ連携を削除しますか？'}
               size={'xs'}
               actionPosition={'center'}
               handleClose={(e) => handleCancelRemoveQaDialog(e)}
               btnSubmit={'削除'}>
          <div/>
        </Modal>
      }
    </div>
  );
}

export default AssociateAiComp;
