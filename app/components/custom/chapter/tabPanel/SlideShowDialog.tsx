import React, {SetStateAction, useState} from 'react';
import Slider from "react-slick";
import {Grid, MenuItem, Select} from "@mui/material";
import Button from "@mui/material/Button";
import {handleLayer} from "@/app/common/selectButtonColor";
import PrevArrow from "@/app/components/custom/PrevArrow";
import NextArrow from "@/app/components/custom/NextArrow";
import {useAtom} from "jotai";
import {blocksAtom} from "@/app/store/atom/blocks.atom";
import {zoneDateSlash} from "../../../../../common/dayJs/format";
import {SLIDE_SHOW} from "@/app/configs/constants";
import {renderUrlSlide} from "@/app/common/renderUrlSlide"
import {selectedCharacterInContentAtom} from "@/app/store/atom/selectedCharacterInContent.atom";
import {getCharInBlock} from "@/app/common/getCharInBlock";
import {Block, DataSlide} from "@/app/types/block";
import {newBlockData} from "@/app/common/newBlockData";
import {getId} from "@/app/common/getId";

type props = {
  setOpen: React.Dispatch<SetStateAction<boolean>>,
  dataSlides: DataSlide[],
  setDummyAdd: React.Dispatch<SetStateAction<number>>
  blockIndex?: number,
  addNewBlocks: Block[],
  setAddNewBlocks: React.Dispatch<SetStateAction<Block[]>>
}

const defaultSlideShow = {
  layer: 'after',
  position: 'left',
}

function SlideShowDialog({dataSlides, setOpen, setDummyAdd, blockIndex, addNewBlocks, setAddNewBlocks}: props) {
  const settings = {
    className: "!space-x-[1px]",
    infinite: true,
    slidesToShow: dataSlides?.length < 3 ? dataSlides?.length : 3,
    slidesToScroll: 1,
    speed: 500,
    nextArrow: <NextArrow/>,
    prevArrow: <PrevArrow/>,
  };
  const [blocks, setBlocks] = useAtom(blocksAtom)
  const [layer, setLayer] = useState(SLIDE_SHOW.layers)
  const [position, setPosition] = useState(SLIDE_SHOW.positions)
  const [slideShow, setSlideShow] = useState(defaultSlideShow)
  const [selectedCharacter] = useAtom(selectedCharacterInContentAtom)


  const initialValue = {
    id: dataSlides[0]?.id || "",
    pageObjectId: dataSlides[0]?.slides[0]?.objectId || "",
    slideShow: defaultSlideShow,
    slides: dataSlides[0]?.slides || [],
    slideId: dataSlides[0]?.presentationId,
    title: dataSlides[0]?.title,
    image: dataSlides[0]?.image,
  };

  const [slideActionValue, setSlideActionValue] = useState(initialValue);

  function renderBorder(id: string) {
    return slideActionValue.id === id ? "border-yellow-300 shadow-md" : "border-gray-200";
  }

  const handleChange = (data) => {
    setSlideShow({
      ...slideShow,
      ...data
    })
  }

  const addSlide = () => {
    setDummyAdd(prev => prev + 1)
      let data: DataSlide = {
      'slideId': slideActionValue.slideId,
      'pageObjectId': slideActionValue.pageObjectId,
      'title': slideActionValue.title,
      slideShow: {
        ...slideShow,
        url: renderUrlSlide(slideActionValue.slideId, slideActionValue.pageObjectId, false)
      }
    }
    let showSlideId = getId("block_", 10)
    if (blockIndex == undefined) {
      setBlocks([...blocks, newBlockData('slide', getCharInBlock(selectedCharacter), '', data, showSlideId),
        newBlockData('show_slide', getCharInBlock(selectedCharacter), '', data, showSlideId)]);
    } else {
      setAddNewBlocks(
          [...addNewBlocks, newBlockData('slide', getCharInBlock(selectedCharacter), '', data, showSlideId),
            newBlockData('show_slide', getCharInBlock(selectedCharacter), '', data, showSlideId)])
    }
    setOpen(false)
  }

  return (
    <div>
      <div className={'grid grid-cols-10 flex items-center'}>
        <div className={'col-span-2'}>
          スライド
        </div>
        <div className={'col-span-8'}>
          <div className={'ml-8'}>
            <Slider {...settings}>
              {dataSlides?.map((item: any, index) => {
                return (
                  <div
                    className="cursor-pointer"
                    key={"list" + index}
                    onClick={() =>
                      setSlideActionValue({
                        ...slideActionValue, ...item,
                        slideId: item?.presentationId,
                        pageObjectId: item?.slides?.[0]?.objectId
                      })
                    }
                  >
                    <Grid item sm={12} lg={3} md={4} className={`w-[120px]`}>
                      <Grid className={`bg-white m-4 border  rounded border-solid ${renderBorder(item?.id)}`}>
                        <Grid>
                          <img className="w-full" src={item?.image} alt=""/>
                        </Grid>
                        <Grid className={`m-1 font-medium text-[10px] line-clamp-1`}>{item?.title}</Grid>
                        <Grid className={`flex relative px-1 pb-1 items-center`}>
                          <img className={`w-2`} src="/icons/rectangle.svg" alt=""/>
                          <img className={`mx-1 w-2`} src="/icons/users.svg" alt=""/>
                          <Grid className={`mx-1 font-light text-[8px] text-lightGray1 my-auto`}>
                            {zoneDateSlash(item?.createdAt)}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                );
              })}
            </Slider>
          </div>
        </div>
      </div>
      <div className={'grid grid-cols-12 flex items-center pt-3'}>
        <div className={'col-span-3'}>
          開始ページ
        </div>
        <div className={"col-span-9"}>
          <Select
            className={"w-1/6 h-[40px]"}
            value={slideActionValue.pageObjectId}
            onChange={(e) =>
              setSlideActionValue({
                ...slideActionValue,
                pageObjectId: e.target.value,
              })
            }
          >
            {slideActionValue.slides.map((slide, index) => (
              <MenuItem value={slide.objectId} key={slide.objectId}>
                {index + 1}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
      <div className={'grid grid-cols-12 flex items-center pt-3'}>
        <div className={'col-span-3'}>
          レイヤー
        </div>
        <div className={'col-span-7 flex justify-between'}>
          {
            layer.map((val: any) => {
              return (
                <Button
                  variant="text" className={'text-black'}
                  style={{backgroundColor: val.color}}
                  onClick={() => {
                    handleLayer(val.value, SLIDE_SHOW.layers, setLayer)
                    handleChange({layer: val.value})
                  }}
                  key={val.value}
                >
                  {val.text}
                </Button>
              )
            })
          }
        </div>
      </div>
      <div className={'grid grid-cols-12 flex items-center pt-3'}>
        <div className={'col-span-3'}>
          揃える位置
        </div>
        <div className={'col-span-5 flex justify-between'}>
          {
            position.map((p: any) => {
              return (
                <Button
                  variant="text" className={'text-black'}
                  style={{backgroundColor: p.color}}
                  onClick={() => {
                    handleLayer(p.value, SLIDE_SHOW.positions, setPosition)
                    handleChange({position: p.value})
                  }}
                  key={p.value}
                >
                  {p.text}
                </Button>
              )
            })
          }
        </div>
      </div>
      <div className={`text-center mt-3`}>
        <Button variant={"contained"} onClick={addSlide}>追加</Button>
      </div>
    </div>
  );
}

export default SlideShowDialog;
