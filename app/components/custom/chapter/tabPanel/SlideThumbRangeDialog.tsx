import React, {SetStateAction, useState} from 'react';
import Slider from "react-slick";
import {Grid, MenuItem, Select} from "@mui/material";
import Button from "@mui/material/Button";
import PrevArrow from "@/app/components/custom/PrevArrow";
import NextArrow from "@/app/components/custom/NextArrow";
import {getId} from "@/app/common/getId";
import {useAtom} from "jotai";
import {blocksAtom} from "@/app/store/atom/blocks.atom";
import {zoneDateSlash} from "../../../../../common/dayJs/format";
import {selectedCharacterInContentAtom} from "@/app/store/atom/selectedCharacterInContent.atom";
import {getCharInBlock} from '@/app/common/getCharInBlock';
import {Block, DataSlide} from "@/app/types/block";
import {newBlockData} from "@/app/common/newBlockData";

type props = {
  setOpen: any,
  data: any,
  setDummyAdd: React.Dispatch<SetStateAction<number>>
  blockIndex: number
  addNewBlocks: Block[]
  setAddNewBlocks: React.Dispatch<SetStateAction<Block[]>>;
}

function SlideThumbRangeDialog({data, setOpen, setDummyAdd, blockIndex, addNewBlocks, setAddNewBlocks}: props) {
  const settings = {
    className: "!space-x-[1px]",
    infinite: true,
    slidesToShow: data?.length < 3 ? data?.length : 3,
    slidesToScroll: 1,
    speed: 500,
    nextArrow: <NextArrow/>,
    prevArrow: <PrevArrow/>,
  };
  const [blocks, setBlocks] = useAtom(blocksAtom)
  const [selectedCharacter] = useAtom(selectedCharacterInContentAtom)

  const initialValue = {
    id: data[0]?.id || "",
    pageObjectId: data[0]?.slides[0]?.objectId || "",
    slides: data[0]?.slides || [],
    slideId: data[0]?.presentationId,
    title: data[0]?.title,
    image: data[0]?.image,
  };

  const [slideStart, setSlideStart] = useState({...initialValue});
  const [slideEnd, setSlideEnd] = useState({...initialValue, pageObjectId: data[0]?.slides[1]?.objectId || ""});

  function renderBorder(id: string) {
    return slideStart.id === id ? "border-yellow-300 shadow-md" : "border-gray-200";
  }

  const addSlide = () => {
    let showSlideId = getId("block_", 10)
    if (blockIndex == undefined) {
      setDummyAdd(prev => prev + 1)
        let data: DataSlide = {
        'slideId': slideStart.slideId,
        'pageObjectId': `${slideStart.pageObjectId},${slideEnd.pageObjectId}`,
        'title': slideStart.title,
      }
      setBlocks([...blocks, newBlockData('slide', getCharInBlock(selectedCharacter), '', data, showSlideId)]);
    } else {
        let data: DataSlide = {
        'slideId': slideStart.slideId,
        'pageObjectId': `${slideStart.pageObjectId},${slideEnd.pageObjectId}`,
        'title': slideStart.title,
      }
      setAddNewBlocks([...addNewBlocks, newBlockData('slide', getCharInBlock(selectedCharacter), '', data, showSlideId)]);
    }

    setOpen(false)
  }


  return (
    <div>
      <div className={'grid grid-cols-10 flex items-center min-w-[490px]'}>
        <div className={'col-span-2'}>
          スライド
        </div>
        <div className={'col-span-8'}>
          <div className={'ml-8'}>
            <Slider {...settings}>
              {data?.map((item: any, index) => {
                return (
                  <div
                    className="cursor-pointer"
                    key={"list" + index}
                    onClick={() => {
                      setSlideStart({
                        ...slideStart, ...item,
                        slideId: item?.presentationId,
                        pageObjectId: item?.slides?.[0]?.objectId
                      })
                      setSlideEnd({
                        ...slideEnd, ...item,
                        slideId: item?.presentationId,
                        pageObjectId: item?.slides?.[1]?.objectId
                      })
                    }}
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
        <div className={"col-span-9 flex items-center justify-start"}>
          <Select
            className={"w-1/5 h-[40px] ml-6 mr-4"}
            value={slideStart.pageObjectId}
            onChange={(e) =>
              setSlideStart({
                ...slideStart,
                pageObjectId: e.target.value,
              })
            }
          >
            {slideStart.slides.map((slide, index) => (
              <MenuItem value={slide.objectId} key={slide.objectId}>
                {index + 1}
              </MenuItem>
            ))}
          </Select>
          <span className={'font-bold'}>~</span>
          <Select
            className={"w-1/5 h-[40px] ml-6 mr-4"}
            value={slideEnd.pageObjectId ?? slideStart.pageObjectId}
            onChange={(e) =>
              setSlideEnd({
                ...slideEnd,
                pageObjectId: e.target.value,
              })
            }
          >
            {slideEnd.slides.map((slide, index) => (
              <MenuItem value={slide.objectId} key={slide.objectId}>
                {index + 1}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
      <div className={`text-center mt-3`}>
        <Button variant={"contained"} onClick={addSlide}>追加</Button>
      </div>
    </div>
  );
}

export default SlideThumbRangeDialog

