import Modal from "@/app/components/custom/Modal"
import React, {ReactNode} from "react";
import {isFunction} from "lodash";

interface Props {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedMotionId: React.Dispatch<React.SetStateAction<string>>
  selectedMotionId: string
  children: ReactNode
  setSelectedCharId?: React.Dispatch<React.SetStateAction<string>>
  handleSubmit: () => void
}

export const ModalListMotionPose = ({
                                      openModal,
                                      setOpenModal,
                                      setSelectedMotionId,
                                      children,
                                      selectedMotionId,
                                      setSelectedCharId,
                                      handleSubmit
                                    }: Props) => {


  return (
    <Modal
      open={openModal}
      setOpen={setOpenModal}
      title={'キャラクターの動き'}
      onClose={() => {
        setOpenModal(false)
        setSelectedMotionId('')
        isFunction(setSelectedCharId) && setSelectedCharId('')
      }}
      onSubmit={handleSubmit}
      titlePosition={'center'}
      actionPosition={'center'}
      handleClose={() => setOpenModal(false)}
      isDisabled={!Boolean(selectedMotionId)}
    >
      {children}
    </Modal>
  )
}
