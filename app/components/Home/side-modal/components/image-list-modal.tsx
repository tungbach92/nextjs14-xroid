import { Dispatch, SetStateAction } from "react";
import { ImageContainer } from "./index";
import { LisImageProps } from "../models";

interface ImageListModalProps {
  labelImage?: string;
  listImage?: LisImageProps[];
  chooseVideo?: number;
  setChooseVideo: Dispatch<SetStateAction<number>>;
}

interface ImageListModalItem extends LisImageProps, ImageListModalProps {}

interface Props {
  Item: React.FC<ImageListModalItem>;
}

export const ImageListModal: React.FC<ImageListModalProps> & Props = ({
  labelImage,
  listImage,
  setChooseVideo,
  chooseVideo,
}) => {
  return (
    <div className="flex my-4 items-center  space-x-10">
      <p className="text-ld text-text-gray-modal w-28">{labelImage}</p>
      <div>
        <div className=" flex  flex-wrap">
          {listImage.map((item) => (
            <ImageListModal.Item
              id={item.id}
              key={item.id}
              create_at={item.create_at}
              image={item.image}
              name={item.name}
              setChooseVideo={setChooseVideo}
              chooseVideo={chooseVideo}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

ImageListModal.Item = function Item({ id, create_at, image, name, chooseVideo, setChooseVideo }) {
  function renderBorder() {
    return id === chooseVideo
      ? "border-solid border border-yellow-300 shadow-xl"
      : "border-solid border border-gray-300";
  }

  return (
    <div
      className={`border  max-w-[80px] mr-2 mt-2 cursor-pointer hover:border-solid hover:border hover:border-yellow-300 hover:shadow-xl rounded-sm ${renderBorder()}`}
      onClick={() => setChooseVideo(id)}
    >
      <ImageContainer image={image} create_at={create_at} name={name} id={id} />
    </div>
  );
};
