import {Grid, MenuItem, Select, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {handleLayer} from "@/app/common/selectButtonColor";
import NextArrow from "@/app/components/custom/NextArrow";
import PrevArrow from "@/app/components/custom/PrevArrow";
import {blocksAtom} from "@/app/store/atom/blocks.atom";
import {zoneDateSlash} from "@/common/dayJs/format";
import {useAtom} from "jotai";
import React, {SetStateAction, useState} from "react";
import {NumericFormat, NumericFormatProps} from "react-number-format";
import Slider from "react-slick";
import {SLIDE_ACTION} from "@/app/configs/constants";
import {renderUrlSlide} from "@/app/common/renderUrlSlide";
import {getCharInBlock} from "@/app/common/getCharInBlock";
import {selectedCharacterInContentAtom} from "@/app/store/atom/selectedCharacterInContent.atom";
import {Block, DataSlide} from "@/app/types/block";
import {newBlockData} from "@/app/common/newBlockData";
import {getId} from "@/app/common/getId";


interface SlideActionDialogProps {
  data: any[];
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setDummyAdd: React.Dispatch<SetStateAction<number>>
  blockIndex?: number;
  addNewBlocks: Block[];
  setAddNewBlocks: React.Dispatch<SetStateAction<Block[]>>;
}

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

function SlideActionDialog({
                             data,
                             setOpen,
                             setDummyAdd,
                             blockIndex,
                             addNewBlocks,
                             setAddNewBlocks
                           }: SlideActionDialogProps) {
  const settings = {
    className: "!space-x-[1px]",
    infinite: true,
    slidesToShow: data?.length < 3 ? data?.length : 3,
    slidesToScroll: 1,
    speed: 500,
    nextArrow: <NextArrow/>,
    prevArrow: <PrevArrow/>,
  };
  const [slideAction, setSlideAction] = useState(SLIDE_ACTION);
  const [blocks, setBlocks] = useAtom(blocksAtom);
  const initialvalue = {
    id: data[0]?.id || "",
    pageObjectId: data[0]?.slides[0]?.objectId || "",
    slideActionType: {seconds: "1" || 1, replay: true},
    slides: data[0]?.slides || [],
    slideId: data[0]?.presentationId,
    title: data[0]?.title,
    image: data[0]?.image,
  };
  const [slideActionValue, setSlideActionValue] = useState(initialvalue);
  // const {characters} = useCharacters()
  const [selectedCharacter] = useAtom(selectedCharacterInContentAtom)


  function renderBorder(id: string) {
    return slideActionValue.id === id ? "border-yellow-300 shadow-md" : "border-gray-200";
  }

  const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(function NumericFormatCustom(
    props,
    ref
  ) {
    const {onChange, ...other} = props;
    return (
      <NumericFormat
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        {...other}
        getInputRef={ref}
        thousandSeparator
        valueIsNumericString
        suffix="秒"
      />
    );
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSlideActionValue({
      ...slideActionValue,
      slideActionType: {...slideActionValue.slideActionType, seconds: event.target.value},
    });
  };

  const handleReplay = (value: any) => {
    handleLayer(value, SLIDE_ACTION, setSlideAction);
    if (value === "end")
      setSlideActionValue({
        ...slideActionValue,
        slideActionType: {...slideActionValue.slideActionType, replay: false},
      });
    if (value === "change")
      setSlideActionValue({
        ...slideActionValue,
        slideActionType: {...slideActionValue.slideActionType, replay: true},
      });
  };

  const handleAdd = () => {
    setDummyAdd(prev => prev + 1)
      let data: DataSlide = {
      'slideId': slideActionValue.slideId,
      'pageObjectId': slideActionValue.pageObjectId,
      'title': slideActionValue.title,
      'slideActionType': {
        ...slideActionValue.slideActionType,
        url: renderUrlSlide(slideActionValue.slideId, slideActionValue.pageObjectId, true, Number(slideActionValue.slideActionType.seconds), slideActionValue.slideActionType.replay)
      }
    }
    slideActionValue.slideActionType.seconds = Number(slideActionValue.slideActionType.seconds);
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
  };

  return (
    <div>
      <div className={"grid grid-cols-10 items-center"}>
        <div className={"col-span-2"}>スライド</div>
        <div className={"col-span-7"}>
          <div className={"ml-3"}>
            <Slider {...settings}>
              {data?.map((item: any, index) => {
                return (
                  <div
                    className="cursor-pointer"
                    key={"list" + index}
                    onClick={() =>
                      setSlideActionValue({
                        ...slideActionValue, ...item,
                        slideId: item?.presentationId,
                        pageObjectId: item?.slides[0]?.objectId
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

      <div className={"grid grid-cols-12  items-center pt-3"}>
        <div className={"col-span-3"}>ページ移動</div>
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

      <div className={"grid grid-cols-12  items-center pt-3"}>
        <div className={"col-span-3"}>自動再生</div>
        <div className={"col-span-9"}>
          <TextField
            size={"small"}
            autoFocus
            value={slideActionValue.slideActionType.seconds}
            onChange={handleChange}
            InputProps={{
              inputComponent: NumericFormatCustom as any,
            }}
            className={"w-1/6"}
          />
        </div>
      </div>

      <div className={"grid grid-cols-12  items-center pt-3"}>
        <div className={"col-span-3"}>スライドショー</div>
        <div className={"col-span-3 flex justify-between"}>
          {slideAction.map((s: any) => {
            return (
              <Button
                variant="text"
                className={"text-black"}
                style={{backgroundColor: s.color}}
                onClick={() => handleReplay(s.value)}
                key={s.value}
              >
                {s.text}
              </Button>
            );
          })}
        </div>
      </div>
      <div className="justify-center flex pt-6">
        <Button className="bg-blue-500 px-12" onClick={handleAdd}>
          <span className="text-white">追加</span>
        </Button>
      </div>
    </div>
  );
}

export default SlideActionDialog;
