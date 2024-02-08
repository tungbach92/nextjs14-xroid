import {Grid} from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import {getThumbById, getThumbByPresentationId} from "@/app/common/commonApis/slide";
import {SlidePageThumb} from "@/app/components/base/img/imgSlide";
import CardCustom from "@/app/components/custom/CardCustom";
import Dropdown from "@/app/components/custom/Dropdown";
import {readWriteBlocksAtom} from "@/app/store/atom/blocks.atom";
import {useAtom, useSetAtom} from "jotai";
import * as React from 'react';
import {useEffect, useState} from 'react';
import {cloneDeep} from "lodash";
import {renderUrlSlide} from "@/app/common/renderUrlSlide";
import {showSlide} from "@/app/store/atom/showSlides.atom";
import {BlockSlide, DataSlide} from "@/app/types/block";

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
    const updateBlocks = useSetAtom(readWriteBlocksAtom)
    const [data, setData] = useState<DataSlide>(block?.data)
    const [getShowSlide, setShowSlide] = useAtom(showSlide)
    const slideData = block?.data

    useEffect(() => {
        if (slideData?.slideId && !slideData?.slides) {
            getThumbByPresentationId(slideData.slideId).then((res) => setData({
                ...block,
                slides: res?.slides,
                title: res?.title
            }))
        }
    }, [block, slideData])

    const [thumb, setThumb] = useState<any>(data?.pageObjectId || `${data?.slides?.[0]?.objectId}, ${data?.slides?.[0]?.objectId}`)
    const [imgThumbStart, setImgThumbStart] = useState<any>()
    const [imgThumbEnd, setImgThumbEnd] = useState<any>()
    const [dropdownSlide, setDropdownSlide] = useState([])
    const [isLoading, setIsLoading] = useState(false);

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
            setImgThumbStart(valueImageThumbs[0])
            setImgThumbEnd(valueImageThumbs[valueImageThumbs?.length - 1])
            setIsLoading(false)
        }
    }

    const handleUpdate = (event, type) => {
        let isRange = thumb.includes(',')
        let valueThumb = ''
        if (isRange) {
            let value = thumb.split(',')
            if (type === 'start') {
                valueThumb = `${event.target.value},${value[1]}`
            } else {
                valueThumb = `${value[0]},${event.target.value}`
            }
        } else {
            valueThumb = `${data?.slides?.[0]?.objectId}, ${data?.slides?.[0]?.objectId}`
        }
        setThumb(valueThumb)

        const _block = cloneDeep(block)
        let newSlide: DataSlide = {...block.data as DataSlide}
        let url = valueThumb.split(',').map(i => {
            renderUrlSlide(newSlide.slideId, i, false)
        })
        newSlide = {
            ...newSlide,
            pageObjectId: valueThumb,
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
    }, [data?.slides])

    return (
        <div className={'min-w-[600px] h-full'}>
            <CardCustom
              block={block}
              handleGetIndex={handleGetIndex}
              handleMultiCopy={handleMultiCopy}
              isCopy={true}
              onCopy={onCopy}
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
                    <div>
                        <Grid container className={`mb-2 flex items-center`}>
                            <Grid item xs={5} className={'flex justify-center pl-8'}>
                                <Dropdown
                                    dataSelect={dropdownSlide}
                                    value={thumb.split(',')[0]}
                                    onChange={(event) => handleUpdate(event, 'start')}
                                    className={'py-2 w-28'}
                                    label={'ページ'}
                                    isInPutLabel={true}/>
                            </Grid>
                            <Grid item xs={2} className={'flex justify-center'}>
                                <span className={'font-bold text-lg'}>~</span>
                            </Grid>
                            <Grid item xs={5} className={'flex justify-center pr-8'}>
                                <Dropdown
                                    dataSelect={dropdownSlide}
                                    value={thumb.split(',')[1] === 'undefined' ? thumb.split(',')[0] : thumb.split(',')[1]}
                                    onChange={(event) => handleUpdate(event, 'end')}
                                    className={'py-2 w-28'}
                                    label={'ページ'}
                                    isInPutLabel={true}/>
                            </Grid>
                        </Grid>
                        <Grid container className={'w-full p-2'}>
                            <Grid item xs={6} className={'text-center'}>
                                {isLoading && <LinearProgress/>}
                                <SlidePageThumb pageThumbnail={imgThumbStart} className={`w-[136px] h-auto`}/>
                            </Grid>
                            <Grid item xs={6} className={'text-center'}>
                                {isLoading && <LinearProgress/>}
                                <SlidePageThumb pageThumbnail={imgThumbEnd} className={`w-[136px] h-auto`}/>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </CardCustom>
        </div>
    );
}

export default SlideTemplate;
