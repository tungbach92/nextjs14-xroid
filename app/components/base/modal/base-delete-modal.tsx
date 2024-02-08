import {Button} from "@mui/material";
import {imageUri} from "@/app/components/assets";
import {BaseModal, BaseModalProps} from "./base-modal";
import {twMerge} from "tailwind-merge";
import React from "react";

interface BaseDeleteModalProps extends BaseModalProps, BaseDeleteModalFooter {
  categoryTitle?: string
  categoryName?: string
  label?: string | React.ReactNode
}

interface BaseDeleteModalFooter {
  handleCloseDeleteModal?: () => void
  handleDelete?: () => void
  isDisabled?: boolean
  className?: string
  submitText?: string
  isLoading?: boolean
}

interface Props {
  footer: React.FC<BaseDeleteModalFooter>;
}

export const BaseDeleteModal: React.FC<BaseDeleteModalProps> & Props = ({
  isOpen,
  handleClose,
  categoryTitle,
  categoryName,
  handleDelete,
  label,
  isDisabled,
  submitText,
  className
}) => {
  return (
    <BaseModal
      isOpen={isOpen}
      handleClose={handleClose}
      header={<img alt="icon" src={imageUri.iconImg.iconsDeleteDatabase}/>}
      footer={<BaseDeleteModal.footer handleCloseDeleteModal={handleClose} handleDelete={handleDelete}
                                      isDisabled={isDisabled} submitText={submitText} className={className}/>}
      className="bg-white rounded-lg p-6 justify-center flex flex-col items-center"
    >
      <div className="flex space-x-1">
        <h4 className="text-center text-gray-600">{label}</h4>
      </div>
    </BaseModal>
  );
};

BaseDeleteModal.footer = function ({
  isDisabled = false, isLoading = false,
  handleCloseDeleteModal, handleDelete, className, submitText
}) {
  return (
    <div className={twMerge(`justify-end flex w-full px-3 ${className}`)}>
      <div className="space-x-4">
        <Button onClick={handleCloseDeleteModal} disabled={isDisabled || isLoading}>キャンセル</Button>
        <Button className={twMerge(`bg-blue-500 text-white px-8 disabled:bg-gray-400`)} onClick={handleDelete}
                disabled={isDisabled || isLoading}>
          {submitText || "OK"}
        </Button>
      </div>
    </div>
  );
};
