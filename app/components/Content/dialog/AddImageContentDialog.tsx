import React, {useState} from 'react';
import DialogCustom from "@/app/components/DialogCustom";
import ButtonGroupCustom from "@/app/components/ButtonCustom";
import AddCoverIcon1 from '@/app/common/data/svgData/add-cover-content-icon1.svg';
import AddCoverIcon2 from '@/app/common/data/svgData/add-cover-content-icon2.svg';
import AddContentImage from "@/app/components/Content/AddContentImage";
import ImageWithTitleContent from "@/app/components/Content/ImageWithTitleContent";
import {Content, ContentState} from "@/app/types/content";
import {initialState} from "@/app/components/Content/data/data";
import {IMAGE_ONLY, IMAGE_WITH_TITLE} from "@/app/common/constants";
import {updateContent} from "@/app/common/commonApis/contentsApi";
import {saveError, saveSuccess} from "@/app/services/content";

type AddImageContentDialogProps = {
  open?: boolean,
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  state: ContentState
  handleChangeState: (field: string) => (value: any) => void
  setState?: React.Dispatch<React.SetStateAction<ContentState>>
  content?: Content
  contentId?: string,
}

function AddImageContentDialog({
                                 open,
                                 setOpen,
                                 state,
                                 handleChangeState,
                                 setState,
                                 content,
                                 contentId,
                               }: AddImageContentDialogProps) {
  const [loading, setLoading] = useState(false);
  const addCoverContentButton = [
    {
      checkActive: state.checkActive,
      button: <AddCoverIcon1 fill={`${state.checkActive === IMAGE_ONLY ? '#1976D2' : 'gray'}`}/>,
      onClick: () => {
        handleChangeState('checkActive')(IMAGE_ONLY)
      },
    },
    {
      checkActive: state.checkActive,
      button: <AddCoverIcon2 fill={`${state.checkActive === IMAGE_WITH_TITLE ? '#1976D2' : 'gray'}`}/>,
      onClick: () => {
        handleChangeState('checkActive')(IMAGE_WITH_TITLE)
      },
    }
  ]
  const handleSubmit = async () => {
    const _state: ContentState = {
      ...state,
      thumb: state.previewUrl ? state.previewUrl : state.thumb,
      imageTitle: state.checkActive === IMAGE_WITH_TITLE && state.previewImageTitle ? state.previewImageTitle : initialState.previewImageTitle,
      previewUrl: initialState.previewUrl,
      saveLoading: contentId !== "create"
    }
    setState(_state)
    if (contentId === "create") return setOpen(false)
    if ((!state.previewUrl || state.previewUrl === content?.thumbnail) && state.previewImageTitle === content?.imageTitle) return setOpen(false)
    try {
      const _content = {
        ...content,
        thumbnail: state.previewUrl || content?.thumbnail,
        imageTitle: state.previewImageTitle
      }
      await updateContent(_content)
      setState({..._state, saveLoading: false})
      saveSuccess()
      setOpen(false)
    } catch (e) {
      console.log(e)
      saveError()
      const _oldState: ContentState = {
        ...state,
        thumb: content?.thumbnail,
        imageTitle: content?.imageTitle,
        previewUrl: state.previewUrl || initialState.previewUrl,
        saveLoading: false
      }
      setState(_oldState)
    }
  }
  const handleClose = () => {
    handleChangeState('previewUrl')(initialState.previewUrl)
  }
  return (
    <div className='relative'>
      <DialogCustom
        title='表紙の設定'
        open={open}
        setOpen={setOpen}
        onClick={handleSubmit}
        onClose={handleClose}
        disable={loading || state.saveLoading || !Boolean(state.previewUrl)}
        subHeader={<ButtonGroupCustom className='bg-gray-200' buttonProps={addCoverContentButton}/>}
      >
        {
          state.checkActive === IMAGE_ONLY &&
            <div>
              <AddContentImage
                loading={loading}
                setLoading={setLoading}
                previewUrl={state.previewUrl}
                setPreviewUrl={handleChangeState('previewUrl')}
              />
              <div className={'text-center pt-5 font-bold'}>
                {'推奨サイズ：3x4'}
              </div>
              <div className='text-center pt-2 font-bold'>
                {'※ 例 : 1200px x 1600px'}
              </div>
            </div>
        }
        {
          state.checkActive === IMAGE_WITH_TITLE &&
          <div>
            <div>
              <ImageWithTitleContent
                state={state}
                loading={loading}
                setLoading={setLoading}
                setPreviewImageTitle={handleChangeState('previewImageTitle')}
                setPreviewUrl={handleChangeState('previewUrl')}/>
            </div>
            <div className={'text-center pt-5 font-bold'}>
              {'推奨サイズ：3x4'}
            </div>
            <div className='text-center pt-2 font-bold'>
              {'※ 例 : 1200px x 1600px'}
            </div>
          </div>
        }
      </DialogCustom>
    </div>
  )
    ;
}

export default AddImageContentDialog;
