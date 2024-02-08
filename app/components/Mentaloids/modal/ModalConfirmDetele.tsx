import Modal from "@/app/components/custom/Modal"
import React from "react";
import {checkCharacterDelete} from "@/app/common/commonApis/characterVoiceSetting";
import {MENTOROID_PREFIX} from "@/app/auth/urls";
import {Grid} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import {checkEnecolorDelete} from "@/app/common/commonApis/enecolorsApi";
import {useQuery} from "@tanstack/react-query";

interface Props {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  id?: string
  title?: string
  handleSubmit: () => void
  isEnecolor?: boolean
}

export const ModalConfirmDelete = (props: Props) => {
  const {openModal, setOpenModal, handleSubmit, title, id, isEnecolor} = props
  const {data: dataCheck, isLoading: loading} = useQuery({
    queryKey: isEnecolor ? ['checkEnecolor', {id}] : ['checkCharacter', {id}],
    queryFn: async () => isEnecolor ? await checkEnecolorDelete(id) : await checkCharacterDelete(id),
    enabled: !!id
  })
  //TODO: prefetch data when?

  return (
    <Modal
      open={openModal}
      setOpen={setOpenModal}
      title={title}
      onClose={() => {
        setOpenModal(false)
      }}
      onSubmit={handleSubmit}
      titlePosition={'center'}
      actionPosition={'center'}
      btnSubmit={'OK'}
      handleClose={() => setOpenModal(false)}
      isDisabled={(dataCheck?.checkedUseChapter && dataCheck?.checkedVoiceBlock) || loading}
    >
      {(dataCheck?.checkedVoiceBlock || dataCheck?.checkedUseChapter) ? isEnecolor ?
        <div className={`text-center text-red-600 text-[12px]`}>シナリオに使用されています。</div> :
        <div className={`text-center text-red-600 text-[12px]`}>話すキャラクターに使われています。 削除できません。</div> : ''
      }
      {loading ? <CircularProgress className={'flex mx-auto mt-5'}/> :
        <Grid container className={`bg-gray-50`}>
          <Grid item xs={dataCheck?.chapterData ? 6 : 12} className={`p-2`}>
            <ItemList
              listData={dataCheck?.contentData}
              id={'content'}
              title={'リストコンテンツ'}
              isEnecolor={isEnecolor}
            />
          </Grid>
          <Grid item xs={dataCheck?.contentData ? 6 : 12} className={`p-2`}>
            <ItemList
              listData={dataCheck?.chapterData}
              id={'chapter'}
              title={'リストの章'}
              isEnecolor={isEnecolor}
            />
          </Grid>
        </Grid>
      }
    </Modal>
  )
}

const ItemList = ({listData, title, id, isEnecolor}) => {

  if (!listData?.length) return
  return <div className={`${isEnecolor && 'w-1/2'}`}>
    <div>{title}</div>
    <div className={`py-3 max-h-[40vh] overflow-y-auto`}>
      {listData?.map((item, index) => {
        let link = MENTOROID_PREFIX
        if (id === 'content') link = MENTOROID_PREFIX + '/contents/' + item?.id
        if (id === 'chapter') link = MENTOROID_PREFIX + '/contents/' + item?.contentId + '/' + item.id
        return <div
          onClick={() => window.open(link)}
          className={`flex cursor-pointer bg-gray-100 rounded-md hover:bg-blue-50 m-1 hover:text-blue-600`}
          key={index + title}>
          <img
            className={'h-10 w-10 border rounded-md object-cover m-0.5'}
            src={item?.thumbnail || '/icons/no-image-frees.png'} alt='content-image'
          />
          <div
            className={`my-auto break-words ml-3 font-medium text-sm`}
          >{item?.title}</div>
        </div>
      })}
    </div>
  </div>
}
