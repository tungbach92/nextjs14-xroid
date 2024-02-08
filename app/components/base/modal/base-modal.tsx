import {DetailedHTMLProps, HTMLAttributes, PropsWithChildren} from "react";
import {Modal} from "@mui/material";

export interface BaseModalProps
  extends PropsWithChildren,
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  isOpen?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  handleClose?: () => void;
}

export const BaseModal: React.FC<BaseModalProps> = ({
                                                      handleClose,
                                                      isOpen,
                                                      children,
                                                      footer,
                                                      header,
                                                      className,
                                                      ...props
                                                    }) => {
  return (
    <>
      <Modal
        open={isOpen}
        onClose={() => handleClose()}
        closeAfterTransition
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="justify-center items-center flex"
      >
        <div
          className={` bg-white rounded-lg p-6 space-y-6 justify-center flex flex-col items-center ${className}`} {...props}>
          {header}
          {children}
          {footer}
        </div>
      </Modal>
    </>
  );
};
