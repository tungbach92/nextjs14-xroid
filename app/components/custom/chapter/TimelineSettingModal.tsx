import {BaseDeleteModal, BaseModal, BaseModalProps} from "@/app/components/base";
import React, {Dispatch, SetStateAction} from "react";
import TextField from "@mui/material/TextField";
import {toNumber} from "lodash";
import AddContentImage from "@/app/components/Content/AddContentImage";

interface TimelineSettingModalProps extends BaseModalProps {
  categoryTitle?: string;
  categoryName?: string;
  label?: string,
  start?: string,
  end?: string,
  setStart?: Dispatch<SetStateAction<string>>
  setEnd?: Dispatch<SetStateAction<string>>
  uploadMusic?: any
  uploadImage?: any
  isImage?: boolean
  previewAudioUrl?: string
  imageUrl?: string
  handleSubmit?: any
  length?: number
  loading?: boolean
}

export const TimelineSettingModal: React.FC<TimelineSettingModalProps> = ({
                                                                            label,
                                                                            start,
                                                                            end,
                                                                            setStart,
                                                                            setEnd,
                                                                            uploadImage,
                                                                            uploadMusic,
                                                                            previewAudioUrl,
                                                                            imageUrl,
                                                                            isImage = false,
                                                                            isOpen,
                                                                            handleClose,
                                                                            handleSubmit,
                                                                            length,
                                                                            loading = false
                                                                          }) => {
  const pattern = `^[0-${length - 1}]$`;
  const isDisabled = (start === "" && end === "") || (parseInt(start) > parseInt(end))

  const handleChangeStart = (e) => {
    const value = e.target.value;
    const regex = new RegExp(pattern)
    if (value === "" || regex.test(value)) {
      setStart(value);
    }
    if (toNumber(value) > length - 1)
      setStart((length - 1).toString())
  }

  const handleChangeEnd = (e) => {
    const value = e.target.value;
    const regex = new RegExp(pattern)
    if (value === "" || regex.test(value)) {
      setEnd(value);
    }
    if (toNumber(value) > length - 1) setEnd((length - 1).toString())
  }
  return (
    <BaseModal isOpen={isOpen} handleClose={handleClose}
               footer={<BaseDeleteModal.footer handleCloseDeleteModal={handleClose} handleDelete={handleSubmit}
                                               isDisabled={isDisabled || loading} className={'!justify-center'}
                                               submitText={'保存'}/>}
               className={'w-[400px] h-[380px] p-0 !space-y-12'}
    >
      <div className="w-full">
        <h4 className="text-center text-gray-600 m-0">{label}</h4>
        <hr/>
        <div className={'flex gap-8 flex-col mt-6'}>
          {isImage ? <div className={'self-center'}>
              <AddContentImage previewUrl={imageUrl} loading={loading} className={'h-[138px] w-[138px]'}
                               onChange={uploadImage}/>
            </div> :
            <div className={'self-center'}>
              <AddContentImage previewUrl={previewAudioUrl} loading={loading} className={'h-[138px] w-[138px]'}
                               onChange={uploadMusic} fileType={"audio/mp3, audio/ogg"}/>
            </div>
          }
          <div className={'flex gap-6 px-6'}>
            <TextField label={'スタート'} size={'small'}
                       value={start}
                       onChange={handleChangeStart}
                       inputProps={{inputMode: "numeric", pattern: `[0-${length - 1}]*`}}
            ></TextField>
            <TextField label={'エンド'} size={'small'}
                       value={end}
                       onChange={handleChangeEnd}
                       inputProps={{inputMode: "numeric", pattern: `[0-${length - 1}]*`}}
            ></TextField>
          </div>
        </div>
      </div>
    </BaseModal>
  )
}
