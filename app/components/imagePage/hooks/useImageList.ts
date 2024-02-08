import {handleUploadFile} from "@/app/common/uploadImage/handleUploadFile";
import {useImagesListFireStore} from "@/app/hooks/useImagesListFireStore";
import {ImageAtom, listImagesAtom} from "@/app/store/atom/listImages";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import axios from "axios";
import {useAtom, useAtomValue} from "jotai";
import {useEffect, useState} from "react";
import {selectedImageFolderAtom} from "@/app/store/atom/selectedFolder.atom";

interface useImageListProps {
  folderId?: string
}

export const useImageList = ({folderId}: useImageListProps) => {
  const initialOpenModal = {
    modalPreview: false,
    modalDelete: false,
  };

  const [selectedImage, setSelectedImage] = useState([]);
  const [isOpen, setIsOpen] = useState(initialOpenModal);
  const [isloading, setIsloading] = useState(false);
  const [img, setImg] = useState<ImageAtom>();
  const {listVideos,loading} = useImagesListFireStore(folderId);
  const [userInfo] = useAtom(userAtomWithStorage);
  const [listImages] = useAtom(listImagesAtom);
  const userId = userInfo.user_id;
  const selectedImageFolder = useAtomValue(selectedImageFolderAtom)

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const propertyValues = Object.values(e.target.files);

    setSelectedImage((pre) => [...pre, ...propertyValues]);
  };

  const handleDeleteImage = (id: number) => {
    const newSelectedImage = selectedImage;
    const filterSelectedImage = newSelectedImage.filter((item) => item.lastModified !== id);
    setSelectedImage(filterSelectedImage);
  };

  const uploadImage = async (res) => {
    try {
      await axios.post(`/v2/images/create`, {url: res, folderId: folderId || selectedImageFolder.id, mediaType: "image"});
      handleCloseDeleteModal();
      handleClosePreview()
    } catch (e) {
      console.log(e)
    }
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsloading(false);
  //   }, 1500);
  // }, [isOpen.modalPreview, selectedImage]);

  useEffect(() => {
    if (selectedImage?.length === 1 && isOpen.modalPreview === false) {
      setIsloading(true)
      handleUploadFile(selectedImage[0], userId)
        .then(res => uploadImage(res))
        .catch(e => console.log(e))
        .finally(() => setIsloading(false));
      setSelectedImage([]);
    } else if (selectedImage?.length > 1) {
      setIsOpen((isOpen) => ({...isOpen, modalPreview: true}));
    }
  }, [selectedImage]);

  const handleClosePreview = () => {
    setIsOpen((isOpen) => ({...isOpen, modalPreview: false}));
    setSelectedImage([]);
  };

  const handleCloseDeleteModal = () => {
    setIsOpen((isOpen) => ({...isOpen, modalDelete: false}));
    setImg({});
  };

  const handleModalDelete = (img: ImageAtom) => {
    setIsOpen((isOpen) => ({...isOpen, modalDelete: true}));
    setImg(img);
  };

  const handleDelete = async () => {
    setIsloading(true);
    await axios.post(`/v2/images/delete/${img.id}`);
    try {
      setIsloading(false);
      handleCloseDeleteModal();
    } catch (e) {
      setIsloading(false);
      console.error(e);
    }
  };

  return {
    handleClosePreview,
    handleDeleteImage,
    handleChangeImage,
    handleDelete,
    handleModalDelete,
    handleCloseDeleteModal,
    uploadImage,
    isloading,
    setIsloading,
    img,
    isOpen,
    selectedImage,
    listImages,
    loading,
    listVideos
  };
};
