import LoadingButton from "@mui/lab/LoadingButton";
import {handleUploadFile} from "@/app/common/uploadImage/handleUploadFile";
import {BaseModal, BaseModalProps} from "@/app/components/base";
import ImageCustom from "@/app/components/custom/ImageCustom";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {useAtom} from "jotai";
import {Dispatch, SetStateAction} from "react";

interface PreviewImageModalFooter {
  handleChangeImage?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUploadImg?: () => void;
  isloading?: boolean;
  setIsloading?: Dispatch<SetStateAction<boolean>>
}

interface PreviewImageModalProps extends BaseModalProps, PreviewImageModalFooter {
  selectedImage?: any[];
  handleDeleteImage?: (id: number) => void;
  uploadImage?: (res: string) => void;
}

interface Props {
  Footer: React.FC<PreviewImageModalFooter>;
}

export const PreviewImageModal: React.FC<PreviewImageModalProps> & Props = ({
                                                                              isOpen,
                                                                              handleClose,
                                                                              selectedImage,
                                                                              handleChangeImage,
                                                                              handleDeleteImage,
                                                                              uploadImage,
                                                                              isloading,
                                                                              setIsloading,
                                                                            }) => {
  const [userInfo] = useAtom(userAtomWithStorage);

  const userId = userInfo.user_id;
  const handleUploadImg = async () => {
    try {
      setIsloading(true)
      const upFileRes = await Promise.all(selectedImage.map(img => handleUploadFile(img, userId)))
      await Promise.all(upFileRes.map(f => uploadImage(f)))
    } catch (e) {
      console.log(e)
    } finally {
      setIsloading(false)
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      handleClose={handleClose}
      header={<h3 className="text-black font-bold m-0 p-0">プレビュー</h3>}
      footer={<PreviewImageModal.Footer handleChangeImage={handleChangeImage} handleUploadImg={handleUploadImg}
                                        isloading={isloading}/>}
    >
        <div
          className="grid grid-cols-2 gap-3 border border-solid p-3 border-lightGray2 rounded-lg max-h-96 scrollbar-hide overflow-y-auto">
          {selectedImage.map((img, i) => (
            <ImageCustom
              key={i}
              src={URL.createObjectURL(img)}
              isShowAddButton={false}
              className="!w-[110px] !h-[110px] rounded-lg"
              handleDelete={() => handleDeleteImage(img.lastModified)}
              isloading={isloading}
            />
          ))}
        </div>
    </BaseModal>
  );
};

PreviewImageModal.Footer = function Footer({handleChangeImage, handleUploadImg, isloading}) {
  return (
    <div className="flex space-x-5">
      <LoadingButton loading={isloading} variant="contained" component="label"
                     startIcon={<img src={"/images/addImageIcon.svg"} alt={""}/>}>
        画像追加
        <input onChange={handleChangeImage} hidden accept="image/*" multiple type="file"/>
      </LoadingButton>
      <LoadingButton variant="contained" component="label" onClick={handleUploadImg} loading={isloading}>
        アップロード
      </LoadingButton>
    </div>
  );
};
