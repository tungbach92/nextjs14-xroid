import React, {useState} from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import {imageUri} from "@/app/components/assets";
import EditIcon from '@mui/icons-material/Edit';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {BaseDeleteModal} from "@/app/components/base";

type props = {
  isBanner?: boolean,
  src: string;
  className?: string;
  isShowAddButton?: boolean;
  handleDelete?: () => void;
  hide?: boolean;
  onEdit?: () => void;
  onOpenLink?: () => void;
  onchangeHide?: () => void;
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
};

function ImageBannerPopup({
                            src,
                            className,
                            onEdit,
                            onOpenLink,
                            onchangeHide,
                            isShowAddButton = true,
                            handleDelete,
                            hide = false,
                            isBanner,
                            isOpen,
                            setIsOpen,
                          }: props) {
  const [isHover, setIsHover] = useState(false);
  const renderPosition = () => {
    return isShowAddButton ? "left-6" : "left-10";
  };

  return (
    <div className={"relative"}>
      <Image
        src={src || imageUri.iconImg.noImageIcon}
        alt={"image"}
        width={144}
        height={104}
        onMouseEnter={() => {
          setIsHover(true);
        }}
        onMouseLeave={() => {
          setIsHover(false);
        }}
        className={`${className} object-cover ${hide ? 'opacity-50' : ''}`}
      />
      {isHover ? (
        <div
          className={`absolute ${renderPosition()} bottom-6 right-6 flex flex-col gap-1`}
          onMouseEnter={() => {
            setIsHover(true);
          }}
          onMouseLeave={() => {
            setIsHover(false);
          }}
        >
          <div className={'m-auto flex gap-1'}>
            <IconButton className={"w-[30px] h-[30px] bg-[#DAE7F6]"} onClick={onEdit}>
              <EditIcon className={"w-5"} color={"primary"}/>
            </IconButton>
            {
              isBanner && <IconButton className={"w-[30px] h-[30px] bg-[#DAE7F6]"} onClick={onOpenLink}>
                <OpenInNewIcon className={"w-5"} color={"primary"}/>
              </IconButton>
            }
          </div>
          <div className={'m-auto flex gap-1'}>
            <IconButton className={"w-[30px] h-[30px] bg-[#DAE7F6]"} onClick={onchangeHide}>
              {
                hide ? <VisibilityOffIcon className={"w-5"} color={"disabled"}/> :
                  <RemoveRedEyeIcon className={"w-5"} color={"primary"}/>
              }
            </IconButton>
            <IconButton className={"w-[30px] h-[30px] bg-[#DAE7F6]"} onClick={() => setIsOpen(true)}>
              <CloseIcon className={"w-5"} color={"error"}/>
            </IconButton>
            <BaseDeleteModal label={isBanner ? 'バナーを削除しますか？' : 'ポップアップを削除しますか？'} isOpen={isOpen}
                             handleClose={() => setIsOpen(false)} handleDelete={handleDelete}/>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ImageBannerPopup;
