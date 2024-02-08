import {useCallback, useState} from "react";

export const useModal = () => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const toggleOpenModal = useCallback(()=> {
    setIsOpenModal(!isOpenModal);
  }, [isOpenModal]);
  return {isOpenModal, toggleOpenModal};
};
