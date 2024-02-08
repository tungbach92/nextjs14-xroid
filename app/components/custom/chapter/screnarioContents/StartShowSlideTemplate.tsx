import {Grid} from "@mui/material";
import {SlidePageThumb} from "@/app/components/base/img/imgSlide";
import CardCustom from "@/app/components/custom/CardCustom";
import {useAtom} from "jotai";
import * as React from 'react';
import {useEffect, useState} from 'react';
import {showSlide} from "@/app/store/atom/showSlides.atom";
import {BlockShowSlide} from "@/app/types/block";

type props = {
  block:BlockShowSlide
  onDelete: () => void
  onCopy: () => void
  showSlideId: string
  isShowAddButton?: boolean
  handleGetIndex?: () => void
  handleMultiCopy?: (type: string) => void
}

function StartShowSlideTemplate({
                                  onCopy,
                                  onDelete,
                                  showSlideId,
                                  isShowAddButton,
                                  handleMultiCopy,
                                  handleGetIndex,
                                  block
                                }: props) {
  const [getShowSlide] = useAtom(showSlide)
  const [images, setImages] = useState([])

  useEffect(() => {
    if (getShowSlide?.length) {
      let img = getShowSlide.find(i => i?.showSlideId === showSlideId)
      if (img) setImages(img?.imgThumbs?.length === 1 ? ['', ...img?.imgThumbs] : img?.imgThumbs)
    }
  }, [getShowSlide])
  return (
    <div className={'min-w-[600px] h-full'}>
      <CardCustom
        block={block}
        handleGetIndex={handleGetIndex}
        handleMultiCopy={handleMultiCopy}
        isCopy={true}
        onCopy={onCopy}
        onDelete={onDelete}
        title={'Show Slide'}
        color={'#F5BA15'}
        isShowAddButton={isShowAddButton}
        className={'border-2 border-solid border-[#F5BA15] min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px] text-xs h-full'}
      >
        <div className={'p-2'}>
          <Grid container className={'w-full p-2'}>
            <Grid item xs={6} className={'text-center'}>
              <SlidePageThumb pageThumbnail={images[0]} className={`w-[136px] h-auto`}/>
            </Grid>
            <Grid item xs={6} className={'text-center'}>
              <SlidePageThumb pageThumbnail={images[images?.length - 1]} className={`w-[136px] h-auto`}/>
            </Grid>
          </Grid>
        </div>
      </CardCustom>
    </div>
  );
}

export default StartShowSlideTemplate;
