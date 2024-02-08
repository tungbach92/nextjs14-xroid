import { BaseModal, BaseModalProps } from "@/app/components/base";
import { DefaultSpreadsSheetsWidgets } from "../index";
import { ModalSpreadSheetsLayout } from "./layout";

interface SpreadSheetsNewFileModalProps extends BaseModalProps {}

export const SpreadSheetsNewFileModal: React.FC<SpreadSheetsNewFileModalProps> = ({ isOpen, handleClose }) => {
  return (
    <BaseModal className="bg-white rounded-lg pb-0 flex flex-col w-200" isOpen={isOpen} handleClose={handleClose}>
      <ModalSpreadSheetsLayout className="text-white bg-lightGreen hover:bg-lightGreenHover" titleButton="New File +">
        <div className="flex flex-col px-10 h-30 overflow-y-scroll">
          <p>既存ファイル</p>
          {/* ui mẫu sau sẽ sửa lại đúng với logic */}
          <DefaultSpreadsSheetsWidgets.Item />
        </div>
      </ModalSpreadSheetsLayout>
    </BaseModal>
  );
};
