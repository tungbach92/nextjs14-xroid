import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";

import Image from "next/image";
import {LisImageProps} from "../models";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {getDayTimeFromTimeStamp} from "@/app/utils/time";
import {imageUri} from "@/app/components/assets";

interface ImageContainerProps extends LisImageProps {}

export const ImageContainer: React.FC<ImageContainerProps> = ({ image, create_at, name }) => {
  return (
    <div className="flex   flex-col ">
      <Image
        src={image || imageUri.iconImg.noImageIcon}
        height={80}
        width={80}
        className="object-cover border-none rounded-t-sm"
        alt=""
      />
      <div className="px-1 mb-1">
        <p className="text-[10px]  uppercase">{name}</p>
        <div className="flex space-x-[2px] items-center">
          <div className="flex items-baseline space-x-[5px]">
            <div className="flex space-x-[2px] items-center">
              <div className="border border-solid w-2 h-[5px] border-yellow-300 " />
              <PeopleOutlineIcon className="w-2 h-2 " />
            </div>
            <p className="text-[7px]">{getDayTimeFromTimeStamp(create_at)}</p>
          </div>
          <MoreVertIcon className="w-2 h-2 text-gray-500 justify-end" />
        </div>
      </div>
    </div>
  );
};
