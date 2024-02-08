import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useState } from "react";
import { ImageListModal } from "../components";
import listImage from "../json/image-list.json";

interface SlideActionListProps {}

export const SlideActionList: React.FC<SlideActionListProps> = () => {
  const [chooseVideo, setChooseVideo] = useState<number>(0);

  return (
    <div className="flex   flex-col">
      <ImageListModal
        setChooseVideo={setChooseVideo}
        chooseVideo={chooseVideo}
        labelImage="スライド"
        listImage={listImage}
      />

      <div className="flex items-center space-x-10">
        <p className="text-ld text-text-gray-modal w-28">ページ移動</p>
        <p className="text-ld py-1 px-4 bg-gray-200">9</p>
      </div>

      <div className="flex items-center space-x-10">
        <p className="text-ld text-text-gray-modal w-28">自動再生</p>
        <p className="text-ld ">1秒</p>
        <p className="text-ld bg-yellow-500 rounded-sm px-1">3秒</p>
        <div className="bg-gray-200 rounded-sm items-center flex px-2 py">
          <MoreHorizIcon className="w-6 h-6 text-gray-600 " />
        </div>
      </div>
      <div className="flex items-center space-x-10">
        <p className="text-ld text-text-gray-modal w-28">スライドショー</p>
        <p className="text-ld ">更新</p>
        <p className="text-ld ">終了</p>
      </div>
    </div>
  );
};
