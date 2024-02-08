import {Grid} from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import {getThumbById, getThumbByPresentationId} from "@/app/common/commonApis/slide";
import {SlidePageThumb} from "@/app/components/base/img/imgSlide";
import CardCustom from "@/app/components/custom/CardCustom";
import Dropdown from "@/app/components/custom/Dropdown";
import {readWriteBlocksAtom} from "@/app/store/atom/blocks.atom";
import {useAtom, useSetAtom} from "jotai";
import {useEffect, useState} from 'react';
import {SLIDE_SHOW} from "@/app/configs/constants";
import {cloneDeep, findIndex} from "lodash";
import {renderUrlSlide} from "@/app/common/renderUrlSlide";
import {showSlide} from "@/app/store/atom/showSlides.atom";
import {BlockSlide} from "@/app/types/block";

type props = {
    onDelete: () => void
    onCopy: () => void
    isShowAddButton?: boolean
    handleGetIndex?: () => void
    handleMultiCopy?: (type: string) => void
    block: BlockSlide
}

function SlideTemplate({
                           onCopy,
                           onDelete,
                           isShowAddButton,
                           handleMultiCopy,
                           handleGetIndex,
                           block
                       }: props) {
    const slideData = block?.data
    const [data, setData] = useState(slideData)
    const [getShowSlide, setShowSlide] = useAtom(showSlide)

    useEffect(() => {
        if (slideData?.slideId && !slideData?.slides) {
            getThumbByPresentationId(slideData.slideId).then((res) => setData({
                ...slideData,
                slides: res?.slides,
                title: res?.title
            }))
        }
    }, [slideData])

    const [thumb, setThumb] = useState<any>(data?.pageObjectId || data?.slides?.[0]?.objectId)
    const [imgThumb, setImgThumb] = useState<any>()
    const [dropdownSlide, setDropdownSlide] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [dataSetting, setDataSetting] = useState<any>({});
    const updateBlocks = useSetAtom(readWriteBlocksAtom)
    const getDropdownThumb = (dataSlides) => {
        if (dataSlides?.length > 0) {
            let option = [];
            dataSlides.map((value, index) => {
                option.push({
                    label: index + 1,
                    value: value?.objectId
                })
            })
            setDropdownSlide(option)
        }
    }

    const getThumb = async (presentationId, pageObjectId) => {
        setIsLoading(true)
        let valueImageThumbs = []
        try {
            const imgThumbs = await getThumbById(presentationId, pageObjectId).then()
            if (imgThumbs?.slides?.length) valueImageThumbs = imgThumbs?.slides?.map(i => {
                return i?.pageThumbnail?.contentUrl
            })
        } catch (err) {
            valueImageThumbs = [data?.image]
        } finally {
            let find = getShowSlide.find(i => i?.showSlideId === block?.showSlideId)
            if (find) {
                setShowSlide(getShowSlide.map(i => {
                    if (i?.showSlideId === find?.showSlideId) return {
                        showSlideId: block?.showSlideId,
                        imgThumbs: valueImageThumbs
                    }
                    return i
                }))
            } else {
                setShowSlide([...getShowSlide, {showSlideId: block?.showSlideId, imgThumbs: valueImageThumbs}])
            }
            setImgThumb(valueImageThumbs)
            setIsLoading(false)
        }
    }

    const handleUpdate = (event, type = '') => {
        setThumb(event.target.value)
        const _block = cloneDeep(block)
        const pageObjectId = event.target.value
        let newSlide = {...block.data}
        let url = ''
        newSlide = {
            ...newSlide,
            pageObjectId,
        }
        if (newSlide?.slideShow) {
            url = renderUrlSlide(newSlide.slideId, pageObjectId, false)
            newSlide = {
                ...newSlide,
                slideShow: {
                    ...newSlide.slideShow,
                    url
                }
            }
        }
        if (newSlide?.slideActionType) {
            url = renderUrlSlide(newSlide.slideId, pageObjectId, true, Number(newSlide.slideActionType.seconds), newSlide.slideActionType.replay)
            newSlide = {
                ...newSlide,
                slideActionType: {
                    ...newSlide.slideActionType,
                    url
                }
            }
        }

        _block.data = newSlide
        let newShowSlides = getShowSlide.map((i: any) => {
            if (block?.showSlideId === i?.showSlideId) return {showSlideId: i?.showSlideId, imgThumbs: url}
            return i
        })
        updateBlocks(_block)
        setShowSlide(newShowSlides)
    }

    useEffect(() => {
        if (!data?.slideId || !thumb) return
        getThumb(data?.slideId, thumb).then()
    }, [thumb, data?.slideId])

    useEffect(() => {
        getDropdownThumb(data?.slides)

        if (data?.slideShow) {
            let indLayer = findIndex(SLIDE_SHOW.layers, item => item.value === data.slideShow?.layer)
            let indPosition = findIndex(SLIDE_SHOW.positions, item => item.value === data.slideShow?.position)
            setDataSetting({layer: SLIDE_SHOW.layers[indLayer].text, position: SLIDE_SHOW.positions[indPosition].text})
        }

        if (data?.slideActionType) {
            setDataSetting(data?.slideActionType)
        }
    }, [data?.slides])

    return (
        <div className={'min-w-[600px] h-full'}>
            <CardCustom
              handleGetIndex={handleGetIndex}
              handleMultiCopy={handleMultiCopy}
              isCopy={true}
              onCopy={onCopy}
              block={block}
              onDelete={onDelete}
              title={'Slide'}
              color={'#F5BA15'}
              isShowAddButton={isShowAddButton}
              className={'border-2 border-solid border-[#F5BA15] min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px] text-xs h-full'}
            >
                <div className={'p-2'}>
                    <div className={'py-3 text-xs flex flex-col'}>
                        <TextField
                            label='スライド名'
                            multiline={true}
                            inputProps={{readOnly: true}}
                            value={data?.title}
                            variant="outlined"
                            size={'small'}
                        />
                    </div>
                    <div className={'py-3 text-xs flex flex-col'}>
                        <TextField
                          key={data?.slideId}
                          id={'outlined-basic'}
                          label='プレゼンテーションID'
                          multiline={true}
                          inputProps={{readOnly: true}}
                          defaultValue={data?.slideId}
                          variant="outlined"
                          size={'small'}
                        />
                    </div>
                    <Grid container className={`mb-2`}>
                        <Grid item xs={6}>
                            <Dropdown
                                dataSelect={dropdownSlide}
                                value={thumb}
                                onChange={(event) => handleUpdate(event)}
                                className={'py-2 w-24'}
                                label={'ページ'}
                                isInPutLabel={true}/>
                        </Grid>
                        <Grid item xs={6} className={`text-center`}>
                            {isLoading && <LinearProgress/>}
                            <SlidePageThumb pageThumbnail={imgThumb} className={`w-[136px] h-auto`}/>
                        </Grid>
                    </Grid>
                    {
                        data?.slideShow &&
                        <>
                            <Grid container className={`mb-2 text-sm text-gray-500`}>
                                <Grid item xs={4}>レイヤー</Grid>
                                <Grid item xs={8}>{dataSetting?.layer}</Grid>
                            </Grid>
                            <Grid container className={`mb-2 text-sm text-gray-500`}>
                                <Grid item xs={4}>揃える位置</Grid>
                                <Grid item xs={8}>{dataSetting?.position}</Grid>
                            </Grid>
                        </>
                    }

                    {data?.slideActionType &&
                        <>
                            <Grid container className={`mb-2 text-sm text-gray-500`}>
                                <Grid item xs={4}>自動再生</Grid>
                                <Grid item xs={8}>{dataSetting?.seconds}秒</Grid>
                            </Grid>
                            <Grid container className={`mb-2 text-sm text-gray-500`}>
                                <Grid item xs={4}>スライドショー</Grid>
                                <Grid item xs={8}>{dataSetting?.replay ? '更新' : '終了'}</Grid>
                            </Grid>
                        </>
                    }

                </div>
            </CardCustom>
        </div>
    );
}

export default SlideTemplate;
