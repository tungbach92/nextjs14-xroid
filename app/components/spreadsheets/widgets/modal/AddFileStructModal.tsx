import {BaseModal, BaseModalProps} from "@/app/components/base";
import {Button, TextField} from "@mui/material";
import React from "react";

interface Props extends BaseModalProps {
  title?: string
}

export const AddFileStructModal: React.FC<Props> = ({title, isOpen, handleClose}) => {
  const handleAddSheet = () => {
    if (handleClose) handleClose();
  }

  return (
    <BaseModal className="bg-white rounded-lg p-4 flex flex-col min-w-[300px]" isOpen={isOpen}
               handleClose={handleClose}>
      <div className={"text-center border-0 border-b border-solid border-gray-300 pb-3 mb-3"}>スプレッドシート追加</div>
      <div className="import-name-file mb-3 flex gap-2">
        <TextField
          placeholder={"エネビーストデータ"}
          size={"small"}
          className={"w-full border-solid border-1 border-lightGreen"}
          inputProps={{
            style: {
              paddingTop: 5,
              paddingBottom: 4
            }
          }}
        />
      </div>
      <div className="action flex justify-end items-center">
        <Button onClick={handleClose}
                className="justify-start px-3 flex text-lightGreen duration-300 hover:text-lightGreenHover text-center">
          キャンセル
        </Button>
        <Button onClick={handleAddSheet}
                className="justify-center px-3 flex bg-lightGreen duration-300 hover:text-white hover:bg-lightGreenHover text-center text-white">
          同意
        </Button>
      </div>
    </BaseModal>
  );
};
