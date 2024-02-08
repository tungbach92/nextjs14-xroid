import React, {useEffect, useState} from "react";
import {Character, Motion, Pose} from "@/app/types/types";
import ModalAction from "@/app/components/Mentaloids/modal/ModalAction";
import {getCharacterMotionDefault, setCharacterMotionDefault} from "@/app/common/commonApis/characterVoiceSetting";
import {useAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {OWNER_IDS} from "../../../common/ownerId";
import {ListMotionPose} from "@/app/components/Mentaloids/ListMotionPose";
import {useMotionPose} from "@/app/hooks/useMotionPose";
import {ModalListMotionPose} from "@/app/components/Mentaloids/modal/ModalListMotionPose";
import {toast} from "react-toastify";
import {isFunction} from "lodash";

export interface AnimationProps {
  selectedChar: Character
}

export default function Animation({selectedChar}: AnimationProps) {
  const [isMotionModal, setIsMotionModal] = useState(false)
  const [isPoseModal, setIsPoseModal] = useState(false)
  const [defaultMotionId, setDefaultMotionId] = useState<string>('')
  const [selectedMotionId, setSelectedMotionId] = useState<string>(defaultMotionId)
  const [editMotion, setEditMotion] = useState<Motion>(null)
  const [editPose, setEditPose] = useState<Pose>(null)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [userInfo] = useAtom(userAtomWithStorage);
  // const canNotEdit = userInfo?.user_id !== OWNER_ID && selectedChar?.isSystem && ENA_AND_RABBIT_ID.includes(selectedChar?.id)
  const {poses, motions, loading} = useMotionPose(selectedChar?.id)
  useEffect(() => {
    if (!selectedChar) return;
    const getDefaultMotion = async () => {
      if(!selectedChar?.id || selectedChar?.id?.includes('uRoidTemp_')) return;
      try {
        const res = await getCharacterMotionDefault(selectedChar?.id)
        setDefaultMotionId(res.data.id ?? '')
        setSelectedMotionId(res.data.id ?? '')
      } catch (e) {
        console.log(e)
      }
    }
    getDefaultMotion()
  }, [selectedChar?.id])
  const handleSelectMotion = (id: string) => {
    setSelectedMotionId(id)
  }
  const handleSaveDefaultMotion = async () => {
    try {
      await setCharacterMotionDefault(selectedChar?.id, {
        motionId: selectedMotionId
      })
      toast.success('デフォルトモーションの設定に成功しました')
      const res = await getCharacterMotionDefault(selectedChar?.id)
      isFunction(setDefaultMotionId) && setDefaultMotionId(res.data.id)
      setOpenModal(false)
    } catch (e) {
      toast.error('デフォルトモーションの設定に失敗しました')
      console.log(e)
    } finally {
      setSelectedMotionId('')
    }
  }
  const isSuperAdmin = OWNER_IDS.includes(userInfo?.user_id)
  const isTemplate = selectedChar?.isTemplate

  return (
    <>
      <ListMotionPose poses={poses} motions={motions} loading={loading}
                      selectedMotionId={defaultMotionId} setSelectedMotionId={setSelectedMotionId}
                      setIsMotionModal={setIsMotionModal} setIsPoseModal={setIsPoseModal} setOpenModal={setOpenModal}
                      isModal={false} canEdit={!isSuperAdmin && isTemplate} defaultMotionId={defaultMotionId}
                      setEditMotion={setEditMotion} setEditPose={setEditPose} selectedChar={selectedChar}/>
      <ModalListMotionPose setOpenModal={setOpenModal} selectedMotionId={selectedMotionId}
                           setSelectedMotionId={setSelectedMotionId} openModal={openModal}
                           handleSubmit={handleSaveDefaultMotion}>
        <ListMotionPose poses={poses} motions={motions} loading={loading}
                        handleSelectMotion={handleSelectMotion}
                        selectedMotionId={selectedMotionId} setSelectedMotionId={setSelectedMotionId}
                        defaultMotionId={defaultMotionId}/>
      </ModalListMotionPose>
      <ModalAction
        selectChar={selectedChar}
        open={isMotionModal}
        setOpen={setIsMotionModal}
        isMotion={true}
        editMotion={editMotion}
        setEditMotion={setEditMotion}
      />
      <ModalAction
        selectChar={selectedChar}
        open={isPoseModal}
        setOpen={setIsPoseModal}
        isPose={true}
        editPose={editPose}
        setEditPose={setEditPose}
      />
    </>
  )
}
