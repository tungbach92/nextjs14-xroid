import { Divider } from "@mui/material";
import { BaseModal, BaseModalProps } from "@/app/components/base";
import { SlideActionList, SlideShowList } from "./widgets";

interface SideModalProps extends BaseModalProps {
  modalTitle: string;
  isAction: boolean;
}

export const SideModal: React.FC<SideModalProps> = ({ isOpen, handleClose, modalTitle, isAction }) => {
  return (
    <BaseModal
      isOpen={isOpen}
      handleClose={handleClose}
      className="bg-white  rounded-xl shadow-xl "
      header={
        <div>
          <h1 className=" pl-10 text-xl">{modalTitle}</h1>
          <Divider />
        </div>
      }
    >
      <div className=" px-10 ">{isAction ? <SlideActionList /> : <SlideShowList />}</div>
    </BaseModal>
  );
};
