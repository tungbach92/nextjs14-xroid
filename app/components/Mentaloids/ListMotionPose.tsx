import {CircularProgress, Tab, Tabs} from "@mui/material";
import {iconImg} from "@/app/components/assets/image/icon";
import {Add, PlayArrow} from "@mui/icons-material";
import React, {useMemo, useState} from "react";
import IconButton from "@mui/material/IconButton";
import {isFunction, isNull} from "lodash";
import {Character, Motion, Pose} from "@/app/types/types";
import {BaseDeleteModal} from "@/app/components/base";
import {deleteCharacterMotion, deleteCharacterPose} from "@/app/common/commonApis/characterVoiceSetting";
import {toast} from "react-toastify";

interface Props {
  handleSelectMotion?: (motionId: string) => void
  selectedMotionId: string
  isModal?: boolean
  canEdit?: boolean,
  setOpenModal?: React.Dispatch<React.SetStateAction<boolean>>
  setIsPoseModal?: React.Dispatch<React.SetStateAction<boolean>>
  setIsMotionModal?: React.Dispatch<React.SetStateAction<boolean>>
  poses: Pose[]
  motions: Motion[]
  loading: boolean
  setSelectedMotionId?: React.Dispatch<React.SetStateAction<string>>
  defaultMotionId?: string
  setEditMotion?: React.Dispatch<React.SetStateAction<Motion>>
  setEditPose?: React.Dispatch<React.SetStateAction<Pose>>
  selectedChar?: Character
}

export const ListMotionPose = ({
  selectedMotionId,
  handleSelectMotion,
  isModal = true,
  canEdit,
  setOpenModal,
  setIsPoseModal,
  setIsMotionModal,
  poses, motions, loading, setSelectedMotionId, defaultMotionId = '',
  setEditMotion, setEditPose, selectedChar
}: Props) => {
  const [tabValue, setTabValue] = useState<number>(isModal ? 1 : 0)
  const defaultMotionUrl = useMemo(() => {
    const motion = motions?.find(m => m?.id === selectedMotionId)
    const pose = poses?.find(p => p?.id === selectedMotionId)
    return pose?.url ?? motion?.url ?? ''
  }, [selectedMotionId, motions, poses])
  const [isDeletePoseModal, setIsDeletePoseModal] = useState<boolean>(false)
  const [isDeleteMotionModal, setIsDeleteMotionModal] = useState<boolean>(false)
  const [deletePoseId, setDeletePoseId] = useState<string>('')
  const [deleteMotionId, setDeleteMotionId] = useState<string>('')

  const handleDeletePose = async () => {
    try {
      await deleteCharacterPose(selectedChar?.id, deletePoseId)
      toast.success('削除できました。')
      setIsDeletePoseModal(false)
      setDeletePoseId('')
    } catch (e) {
      console.log(e)
      toast.error('削除できませんでした。')
    }
  }

  const handleDeleteMotion = async () => {
    try {
      await deleteCharacterMotion(selectedChar?.id, deleteMotionId)
      toast.success('削除できました。')
      setIsDeleteMotionModal(false)
      setDeleteMotionId('')
    } catch (e) {
      console.log(e)
      toast.error('削除できませんでした。')
    }
  }
  return (
    <div className={`flex flex-col bg-white`}>
      <div
        className={`flex flex-wrap gap-12 items-center justify-center border-b-2 w-full px-6 py-3 laptop:justify-start`}>
        <Tabs value={tabValue}
              onChange={(event: any, newValue: any) => {
                setTabValue(newValue)
              }}
              aria-label="anim_tab"
              variant={'scrollable'}>
          {!isModal &&
            <Tab value={0} label="デフォルト"/>
          }
          <Tab value={1} label="ポーズ(画像)"/>
          <Tab value={2} label="モーション（GIFアニメーション）"/>
        </Tabs>
      </div>
      <div className={`flex gap-6 p-6 justify-center laptop:justify-start overflow-x-auto`}>
        {tabValue === 0 && !isModal && !loading &&
          <div className={`flex flex-col items-center gap-3 border-2 border-solid border-[#1976D2] relative`}>
            <img className='object-cover max-w-[101px] max-h-[250px] w-auto h-auto'
                 src={defaultMotionUrl || iconImg.noImageIcon}
                 alt={'mentaloid-default-motion'}/>
            <IconButton
              className={`flex self-end ${canEdit && 'opacity-25'}`}
              onClick={() => {
                setOpenModal(true)
                isFunction(setSelectedMotionId) && setSelectedMotionId(defaultMotionId)
              }}
              disabled={canEdit}
            >
              <img src={iconImg.editDefault} alt={'edit-default'}/>
            </IconButton>
            <img src={iconImg.checkedCircle} alt={'checked-circle'} className={'absolute top-[-12px] right-[-12px]'}/>
          </div>
        }
        {
          tabValue === 1 &&
          <>
            {!isModal && !loading && !isNull(poses) &&
              <div
                className={'h-[90px] aspect-square flex flex-col items-center justify-center border-2 border-dashed border-shade-blue rounded-md p-3'}>
                <IconButton aria-label="add-pose" onClick={() => isFunction(setIsPoseModal) && setIsPoseModal(true)}
                            disabled={canEdit}>
                  <Add className={`${!canEdit && 'text-shade-blue'}`} fontSize={'large'}></Add>
                </IconButton>
                <div className={'text-shade-blue text-sm'}>画像追加</div>
              </div>}
            {
              loading ? <CircularProgress/> :
                poses?.map((pose) =>
                  <div key={pose?.id}
                       className={`flex flex-col items-center ${selectedMotionId === pose?.id && 'border-2 border-solid border-blue-700 relative'}`}
                       onClick={() => isFunction(handleSelectMotion) && handleSelectMotion(pose?.id)}
                  >
                    <img className='cursor-pointer object-cover max-w-[101px] max-h-[250px] w-auto h-auto m-auto'
                         src={pose?.url}
                         alt={'mentaloid-img'}
                    />
                    <div className={`flex flex-col items-center justify-center cursor-pointer w-full`}>
                      <p
                        className={'hover:scale-105 hover:text-shade-blue'}>{`${pose?.isDefault ? 'デフォルト' : pose?.name}`}</p>
                      {
                        !isModal &&
                        <div className={'flex justify-end w-full'}>
                          <IconButton
                            className={`hover:scale-110  ${canEdit && 'opacity-25'}`}
                            onClick={() => {
                              isFunction(setIsPoseModal) && setIsPoseModal(true)
                              isFunction(setEditPose) && setEditPose(pose)
                            }}
                            disabled={canEdit}
                            disableRipple
                            size={'small'}
                          >
                            <img src={iconImg.editDefault} alt={'edit-default'}/>
                          </IconButton>
                          <IconButton
                            className={`hover:scale-110 ${canEdit && 'opacity-25'}`}
                            onClick={() => {
                              setIsDeletePoseModal(true)
                              setDeletePoseId(pose?.id)
                            }}
                            disabled={canEdit}
                            disableRipple
                            size={'small'}
                          >
                            <img src={iconImg.trashIcon} alt={'trash'}/>
                          </IconButton>
                        </div>
                      }
                    </div>
                    {
                      selectedMotionId === pose?.id && !loading &&
                      <img src={iconImg.checkedCircle} alt={'checked-circle'}
                           className={'absolute top-[-12px] right-[-12px]'}/>
                    }
                  </div>)}
            <BaseDeleteModal
              label={`この設定を削除しますか？`}
              isOpen={isDeletePoseModal}
              handleClose={() => {
                setIsDeletePoseModal(false)
                setDeletePoseId('')
              }}
              handleDelete={handleDeletePose}
            />
          </>
        }
        {
          tabValue === 2 &&
          <>
            {!isModal && !loading && !isNull(motions) &&
              <div
                className={'h-[90px] aspect-square flex flex-col items-center justify-center border-2 border-dashed border-shade-blue rounded-md p-3'}>
                <IconButton aria-label="add-pose" onClick={() => isFunction(setIsMotionModal) && setIsMotionModal(true)}
                            disabled={canEdit}>
                  <Add className={`${!canEdit && 'text-shade-blue'}`} fontSize={'large'}></Add>
                </IconButton>
                <div className={'text-shade-blue text-sm'}>GIF追加</div>
              </div>}
            {loading ? <CircularProgress/> :
              motions?.map((motion) => <div key={motion?.id}

                                            className={`flex flex-col items-center cursor-pointer ${selectedMotionId === motion?.id && 'border-2 border-solid border-blue-700 relative'}`}
              >
                <img className={'object-cover max-w-[101px] max-h-[250px] w-auto h-auto'} src={motion?.url}
                     alt={'mentaloid-gif'}
                     onClick={() => isFunction(handleSelectMotion) && handleSelectMotion(motion?.id)}/>
                <div className={`flex flex-col items-center cursor-pointer w-full`}>
                  <div className={'flex items-center justify-center hover:scale-105 hover:text-shade-blue'}>
                    <PlayArrow/>
                    <p>{motion?.name}</p>
                  </div>
                  {
                    !isModal &&
                    <div className={'flex justify-end w-full'}>
                      <IconButton
                        className={`hover:scale-110  ${canEdit && 'opacity-25'}`}
                        onClick={() => {
                          isFunction(setIsMotionModal) && setIsMotionModal(true)
                          isFunction(setEditMotion) && setEditMotion(motion)
                        }}
                        disabled={canEdit}
                        disableRipple
                        size={'small'}
                      >
                        <img src={iconImg.editDefault} alt={'edit-default'}/>
                      </IconButton>
                      <IconButton
                        className={`hover:scale-110 ${canEdit && 'opacity-25'}`}
                        onClick={() => {
                          setIsDeleteMotionModal(true)
                          setDeleteMotionId(motion?.id)
                        }}
                        disabled={canEdit}
                        disableRipple
                        size={'small'}
                      >
                        <img src={iconImg.trashIcon} alt={'trash'}/>
                      </IconButton>
                    </div>
                  }
                </div>
                {
                  selectedMotionId === motion?.id && !loading &&
                  <img src={iconImg.checkedCircle} alt={'checked-circle'}
                       className={'absolute top-[-12px] right-[-12px]'}/>
                }
              </div>)}
            <BaseDeleteModal
              label={`この設定を削除しますか？`}
              isOpen={isDeleteMotionModal}
              handleClose={() => {
                setIsDeleteMotionModal(false)
                setDeleteMotionId('')
              }}
              handleDelete={handleDeleteMotion}
            />
          </>
        }
      </div>
    </div>
  )
}
