import React from 'react';
import Modal from "@/app/components/custom/Modal";
import {TextField} from "@mui/material";

type props = {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  handleSubmitAdd: () => void
  category: string
  message: string
  setCategory: React.Dispatch<React.SetStateAction<string>>
  setMessage: React.Dispatch<React.SetStateAction<string>>
}

function AddDbTextModal({
                          openModal,
                          setOpenModal,
                          handleSubmitAdd,
                          category,
                          message,
                          setCategory,
                          setMessage
                        }: props) {
  return (
    <Modal
      open={openModal}
      setOpen={setOpenModal}
      btnSubmit={'保存'}
      onSubmit={handleSubmitAdd}
      handleClose={() => {
        setOpenModal(false)
        setCategory('')
        setMessage('')
      }}
      title={''}>
      <div className={'m-auto flex flex-col pt-4 gap-2 mx-10'}>
        <div className={'grid grid-cols-12'}>
          <div className={'col-span-4 grid justify-items-end items-center mr-5'}>
            カテゴリ :
          </div>
          <TextField
            className={'col-span-8'}
            value={category}
            onChange={e => setCategory(e.target.value)}
            size={'small'}
            id="outlined-multiline-static"
            multiline={true}
            placeholder={'カテゴリ'}
            variant="outlined"
          />
        </div>
        <div className={'grid grid-cols-12'}>
          <div className={'col-span-4 items-center grid justify-items-end mr-5'}>
            テキスト :
          </div>
          <TextField
            className={'col-span-8'}
            value={message}
            onChange={e => setMessage(e.target.value)}
            size={'small'}
            id="outlined-multiline-static"
            multiline={true}
            placeholder={'メッセージ'}
            variant="outlined"
          />
        </div>
      </div>
    </Modal>
  );
}

export default AddDbTextModal;
