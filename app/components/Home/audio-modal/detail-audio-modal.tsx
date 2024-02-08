import {Avatar} from "@mui/material";
import {imageUri} from "@/app/components/assets";
import {AudioButtonBase, BaseModal, BaseModalProps, ToggleButtonBase} from "@/app/components/base";

import Image from "next/image";
import React from "react";
import {FastForward} from "@mui/icons-material";
import {
  configAudioLeftBottom,
  configAudioLeftCenter,
  configAudioRight,
  configToggleButton1,
  configToggleButton2,
} from "./config/config-audio-modal";
import {AudioButtonChat} from "./components";

interface DetailAudioModalProps extends BaseModalProps {}

interface ModalDetailAudioItem {
  image?: string;
  title?: string;
}

export const DetailAudioModal: React.FC<DetailAudioModalProps> = ({ isOpen, handleClose }) => {
  return (
    <BaseModal isOpen={isOpen} handleClose={handleClose}>
      <div className="flex items-center space-x-1">
        <div className=" flex-col  space-y-4 min-w-xl bg-slate-200 rounded-lg p-3 hidden laptop:flex">
          <Image src={imageUri.bannerImg.bannerRectangle} alt="" width={280} height={320} />
          <p className="text-lg text-center text-black">楽しみましょう！</p>
          <div className="justify-center flex items-center">
            <Image src={imageUri.bannerImg.bannerRabbit1} alt="" height={160} width={120} />
            <Image src={imageUri.bannerImg.bannerRabbit2} alt="" height={160} width={140} />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center space-y-5">
          <Item title="終了時" />
          <div className="flex ">
            <div className="flex flex-col justify-center items-center space-y-4">
              <AudioButtonBase titleButton="基本" Icon={FastForward} />
              <p className="text-lg">自動モーションセット</p>
              <div className="flex space-x-7">
                {configAudioLeftCenter.map((item, i) => (
                  <AudioButtonBase key={i} titleButton={item.buttonTitle} Icon={item.icon} />
                ))}
              </div>
              <p className="text-lg">個別指定</p>

              <div className="flex  justify-center items-baseline  flex-wrap max-w-xl">
                {configAudioLeftBottom.map((item, i) => (
                  <AudioButtonBase key={i} titleButton={item.buttonTitle} Icon={item.icon} className="mx-2 mb-4" />
                ))}
              </div>
            </div>
            <div className="flex justify-center items-end   flex-wrap max-w-lg">
              {configAudioRight.map((item, i) => (
                <AudioButtonChat key={i} titleButton={item} className="mx-2 mb-6" />
              ))}
            </div>
          </div>
          <Item title="終了時" />
        </div>
      </div>
    </BaseModal>
  );
};

const Item: React.FC<ModalDetailAudioItem> = ({ title }) => {
  const [buttonLeft, setButtonLeft] = React.useState<string>("center");
  const [buttonRight, setButtonRight] = React.useState<string>("left");

  return (
    <div className="flex space-x-6 items-center">
      <h1 className="text-black font-bold text-2xl">{title}</h1>
      <div className="flex flex-row items-center space-x-4">
        <ToggleButtonBase
          configToggleButton={configToggleButton1}
          alignment={buttonLeft}
        />
        <Avatar
          src={imageUri.avtImg.avtRabbit}
          alt=""
          sx={{ width: 70, height: 70, border: 0.5, borderColor: "blue" }}
        />
        <ToggleButtonBase
          configToggleButton={configToggleButton2}
          alignment={buttonRight}
        />
      </div>
    </div>
  );
};
