import listImage from "../json/image-list.json";

import { useState } from "react";
import { ImageListModal } from "../components";

interface SlideShowListProps {}

export const SlideShowList: React.FC<SlideShowListProps> = () => {
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
        <p className="text-ld text-text-gray-modal w-20">開始ページ</p>
        <p className="text-ld py-1 px-4 bg-gray-200">3</p>
      </div>
      <div className="flex items-center space-x-10">
        <p className="text-ld text-text-gray-modal w-20">レイヤー</p>
        <p className="text-ld bg-yellow-500 rounded-sm px-1">メンタロイドの後ろ</p>
        <p className="text-ld ">メンタロイドの前</p>
      </div>
      <div className="flex items-center space-x-10">
        <p className="text-ld text-text-gray-modal w-20">揃える位置</p>
        <p className="text-ld bg-yellow-500 rounded-sm px-1">上</p>
        <p className="text-ld ">中央</p>
        <p className="text-ld ">下</p>
      </div>
      <div className="flex items-center space-x-10">
        <p className="text-ld text-text-gray-modal w-20">操作ボタン</p>
        <p className="text-ld bg-yellow-500 rounded-sm px-1">表示</p>
        <p className="text-ld  text-gray-400">非表示</p>
      </div>
    </div>
  );
};
