import React, {useEffect, useMemo, useState} from 'react';
import {Button} from "@mui/material";
import {CssTextField} from "@/app/components/custom/CssTextField";
import CustomizedRadios from "@/app/components/custom/RadioGroup";
import {Chapter} from "@/app/types/types";
import copy from "copy-to-clipboard";
import {Content} from "@/app/types/content";
import {toast} from "react-toastify";
import {isProd} from "@/app/configs/constants";
import {updateContent} from "@/app/common/commonApis/contentsApi";

const GroupButton = [
  {
    value: 'res',
    label: 'レスポンシブ',
  },
  {
    value: 'nonRes',
    label: '固定サイズ',
  }
]

type Props = {
  chapterGenId?: string
  contentId: string
  data?: Chapter | Content
  setData?: React.Dispatch<React.SetStateAction<Chapter>> | React.Dispatch<React.SetStateAction<Content>>
  isChapter?: boolean
  content?: Content
  onSave?: (type: string) => void
  onPreviewOnContent?: (type: string) => void
}

function KudenEmbedComp({
                          contentId,
                          data,
                          setData,
                          chapterGenId,
                          isChapter = false,
                          content,
                          onSave,
                          onPreviewOnContent
                        }: Props) {
  const [value, setValue] = useState<string>('res');
  const [height, setHeight] = useState<string>('100%');
  const [width, setWidth] = useState<string>('100%');
  const [embedUrl, setEmbedUrl] = useState<string>('')

  const chapterId = useMemo(() => {
    if ((data?.id === 'createChapter' || !data?.id) && isChapter) return chapterGenId
    return data?.id
  }, [chapterGenId, data?.id, isChapter])

  const src = useMemo(() => {
    if (isChapter) {
      if (isProd()) {
        return `https://enterprise.roidemia.com/enterprise/chapter/${contentId}/conversation/${chapterId}`
      } else {
        return `https://enterprise-stg.roidemia.com/enterprise/chapter/${contentId}/conversation/${chapterId}`
      }
    } else {
      if (isProd()) {
        return `https://enterprise.roidemia.com/enterprise/chapter/${contentId}`
      } else {
        return `https://enterprise-stg.roidemia.com/enterprise/chapter/${contentId}`
      }
    }
  }, [contentId, chapterId, isProd(), isChapter])


  useEffect(() => {
    if (value === 'res') {
      setHeight('100%')
    } else {
      setHeight(data?.embedData?.embedHeight || '100%')
    }
  }, [data?.embedData?.embedHeight, value])

  useEffect(() => {
    if (value === 'res') {
      setWidth('100%')
    } else {
      setWidth(data?.embedData?.embedWidth || '100%')
    }
  }, [data?.embedData?.embedWidth, value])

  const iframe = () => {
    if (data?.embedData?.isResponsive) {
      return `<div style="display: flex; align-items:center; justify-content:center;"><iframe src="${src}?uid=***&username=***" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" style="position:absolute;top:0;left:0;width:${width}${(value === 'nonRes' && !data.embedData.embedWidth) || value === 'res' ? '' : 'px'};height:${height}${(value === 'nonRes' && !data.embedData.embedHeight) || value === 'res' ? '' : 'px'};" title="${data?.title}"></iframe></div>`;
    } else {
      return `<iframe src="${src}?uid=***&username=***" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" style="display: block;margin:auto;width:${width}${(value === 'nonRes' && !data.embedData.embedWidth) || value === 'res' ? '' : 'px'};height:${height}${(value === 'nonRes' && !data.embedData.embedHeight) || value === 'res' ? '' : 'px'};" title="${data?.title}"></iframe>`
    }
  }

  useEffect(() => {
    if (data?.embedData?.embedHtml) {
      setEmbedUrl(data?.embedData?.embedHtml)
    } else {
      setEmbedUrl(iframe())
    }
    setData({
      ...data,
      embedData: {
        ...data?.embedData,
        embedHtml: iframe(),
        src: src,
      }
    })
  }, [src, isChapter, embedUrl, data?.embedData?.embedHeight, data?.embedData?.embedWidth, value, data?.embedData?.embedHtml, iframe()])


  useEffect(() => {
    setValue(data?.embedData?.isResponsive ? 'res' : 'nonRes')
  }, [data?.embedData?.isResponsive])


  const onChangeRadio = async (e) => {
    if (isChapter || content?.id === 'create' || !content?.id) {
      setData({...data, embedData: {...data?.embedData, isResponsive: e.target.value === 'res'}})
      setData({...data, embedData: {...data?.embedData, isResponsive: e.target.value === 'res'}})
      return;
    } else try {
      if (content?.id !== 'create' || !content?.id) {
        await updateContent({
          ...content,
          embedData: {
            ...data?.embedData,
            isResponsive: e.target.value === 'res'
          }
        })
      }
      toast.success("埋め込みコードを更新しました。", {autoClose: 3000})
    } catch (e) {
      console.log(e);
    }
  }

  const onChangeWidthHeight = async (e, filed: string) => {
    const inputValue = e.target.value.replace(/^0+/, '');
    setData({...data, embedData: {...data?.embedData, [filed]: inputValue.toString()}});
  }
  const onBlurToChangeWidthHeight = async (e, filed: string) => {
    if (isChapter || !content?.id || content?.id === 'create') return;
    const inputValue = e.target.value.replace(/^0+/, '');
    {
      try {
        if (content?.id !== 'create') {
          await updateContent({
            ...content,
            embedData: {
              ...data?.embedData,
              [filed]: inputValue.toString()
            }
          })
        }
        toast.success("埋め込みコードを更新しました。", {autoClose: 3000})
      } catch (e) {
        console.log(e);
      }
    }
  }

  const onCopyEmbedCode = () => {
    copy(iframe())
    if (iframe()) {
      toast.success("埋め込みコードをコピーしました。", {autoClose: 3000})
    } else {
      toast.error("埋め込みコードがありません。", {autoClose: 3000})
    }
  }

  return (
    <div className={'w-[230px] h-[235px] bg-white rounded mx-[10px] 2xl:w-[300px]'}>
      <div className={'p-2'}>
        <CssTextField
          size={'small'}
          fullWidth
          multiline
          rows={3}
          inputProps={{
            style: {
              fontSize: '13px'
            }
          }}
          value={iframe()}
          placeholder={'埋め込みコード'}/>
        <CustomizedRadios group={GroupButton} onChange={(e) => onChangeRadio(e)} value={value}/>
        <div className={'flex justify-items-center text-center items-center text-gray-500'}>
          <CssTextField
            onBlur={(e) => onBlurToChangeWidthHeight(e, 'embedWidth')}
            type={'number'}
            size={'small'}
            placeholder={'幅'}
            disabled={value === 'res'}
            inputProps={{
              style: {
                height: '12px',
                fontSize: '13px'
              },
              min: 1
            }}
            value={width}
            onChange={(e) => onChangeWidthHeight(e, 'embedWidth')}/>
          <span className={'mx-1'}>x</span>
          <CssTextField
            onBlur={(e) => onBlurToChangeWidthHeight(e, 'embedHeight')}
            type={'number'}
            size={'small'}
            placeholder={'高さ'}
            disabled={value === 'res'}
            inputProps={{
              style: {
                height: '12px',
                fontSize: '13px'
              }
            }}
            value={height}
            onChange={(e) => onChangeWidthHeight(e, 'embedHeight')}/>
          <span className={'ml-1 text-sm'}>Pixel</span>
        </div>


        <div className={'flex gap-3'}>
          <Button variant="contained"
                  onClick={() => onCopyEmbedCode()}
                  fullWidth size={'small'}
                  className={'mt-2 mx-auto'}>
            コピー
          </Button>

          {
            isChapter &&
            <Button variant="contained"
                    onClick={() => onSave('preview')}
                    fullWidth size={'small'}
                    className={'mt-2 mx-auto'}>
              プレビュー
            </Button>
          }
          {
            !isChapter &&
            <Button variant="contained"
                    onClick={() => onPreviewOnContent('preview')}
                    fullWidth size={'small'}
                    className={'mt-2 mx-auto'}>
              プレビュー
            </Button>
          }
        </div>
      </div>

    </div>
  );
}

export default KudenEmbedComp;
