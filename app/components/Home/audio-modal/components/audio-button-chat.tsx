import { ClassNames } from "@emotion/react";
import { imageUri } from "@/app/components/assets";
import { FormEventHandler, MouseEventHandler } from "react";

interface AudioButtonChatProps {
  titleButton?: string;
  onChange?: FormEventHandler<HTMLButtonElement>;
  className: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const AudioButtonChat: React.FC<AudioButtonChatProps> = ({ titleButton, className, onChange, onClick }) => {
  return (
    <button
      className={` justify-center cursor-pointer border-none  relative group min-w-fit hover:scale-110 duration-300 ${className}`}
      onChange={onChange}
      onClick={onClick}
    >
      <img src={imageUri.bannerImg.bgButtonChat} className="" />
      <div className=" absolute top-0  left-0 mobile:left-10 mobile:top-1  flex  space-x-10  duration-300">
        <p className="text-center">{titleButton}</p>
        <img src={imageUri.iconImg.speakerIcon} />
      </div>
    </button>
  );
};
