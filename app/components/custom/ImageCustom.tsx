import React, {useState} from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import {imageUri} from "../assets";
import Image from "next/image";
import {BaseDeleteModal} from "@/app/components/base";
import {ImageAtom} from "@/app/store/atom/listImages";

type props = {
  src: string;
  className?: string;
  onAddImageBlock?: (type: string, src: string) => void;
  isShowAddButton?: boolean;
  handleDelete?: () => void;
  isloading?: boolean
  width?: number
  height?: number
  isNotPage?: boolean
  img?: ImageAtom
  handleSelectImage?: (item: ImageAtom) => void
};

function ImageCustom({
  src,
  className,
  onAddImageBlock,
  isShowAddButton = true,
  handleDelete,
  isloading = false, width = 110, height = 110,
  isNotPage = false, handleSelectImage, img
}: props) {
  const [isHover, setIsHover] = useState(false);
  const [isDelete, setIsDelete] = useState(false)

  return (
    <div className={"relative max-w-fit"}>
      <Image
        src={src || imageUri.iconImg.noImageIcon}
        alt={"image"}
        width={width}
        height={height}
        onMouseEnter={() => {
          setIsHover(true);
        }}
        onMouseLeave={() => {
          setIsHover(false);
        }}
        loading={'lazy'}
        className={`${className}  object-cover relative`}
        onClick={() => handleSelectImage?.(img)}
      />
      {isHover ? (
        <div
          className={`absolute translate-x-1/2 -translate-y-1/2 top-1/2 right-1/2 flex gap-1`}
          onMouseEnter={() => {
            setIsHover(true);
          }}
          onMouseLeave={() => {
            setIsHover(false);
          }}
        >
          {isShowAddButton && (
            <IconButton className={"w-[20px] h-[20px] bg-[#DAE7F6]"}
                        onClick={() => onAddImageBlock("image", src)}>
              <AddIcon color={"primary"}/>
            </IconButton>
          )}
          {(!isloading && !isNotPage) &&
            <IconButton className={"w-[20px] h-[20px] bg-[#DAE7F6]"} onClick={() => setIsDelete(true)}>
              <CloseIcon className={"w-5"} color={"error"}/>
            </IconButton>
          }
        </div>
      ) : null}
      <BaseDeleteModal
        label='この画像を削除しますか？'
        isOpen={isDelete}
        handleClose={() => setIsDelete(false)}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default ImageCustom;
